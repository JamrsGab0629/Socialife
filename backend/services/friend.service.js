import { Friendship, User } from "../model/association.model.js";
import { Op } from "sequelize";
import { safeNotify } from "../utils/notify.utils.js";

export class FriendService {
    static async sendRequest(requesterId, addresseeId) {
        if (requesterId === addresseeId) {
            throw new Error("You cant send it in to your self");
        }

        const existing = await Friendship.findOne({
            where: {
                [Op.or]: [
                    { requester_id: requesterId, addressee_id: addresseeId },
                    { requester_id: addresseeId, addressee_id: requesterId }
                ]
            }
        });

        if (existing) {
            if (existing.status === 'accepted') throw new Error("Magkaibigan na kayo");
            if (existing.status === 'pending') throw new Error("May pending request");
            
            existing.requester_id = requesterId;
            existing.addressee_id = addresseeId;
            existing.status = 'pending';
            await existing.save();

            safeNotify(addresseeId, requesterId, "friend_request", "sent you a friend request.");
            return existing;
        }

        const newFriendship = await Friendship.create({
            requester_id: requesterId,
            addressee_id: addresseeId,
            status: 'pending'
        });

        safeNotify(addresseeId, requesterId, "friend_request", "sent you a friend request.");
        return newFriendship;
    }

    static async respondToRequest(currentUserId, requesterId, status) {
        const friendship = await Friendship.findOne({
            where: {
                requester_id: requesterId,
                addressee_id: currentUserId,
                status: 'pending'
            }
        });

        if (!friendship) {
            throw new Error("no pending request");
        }

        friendship.status = status; 
        await friendship.save();

        if (status === 'accepted') {
            safeNotify(requesterId, currentUserId, "friend_accept", "accepted your friend request.");
        }

        return friendship;
    }

    static async getFriends(userId) {
        const friendships = await Friendship.findAll({
            where: {
                [Op.or]: [
                    { requester_id: userId, status: 'accepted' },
                    { addressee_id: userId, status: 'accepted' }
                ]
            },
            include: [
                { model: User, as: 'requester', attributes: ['user_id', 'username', 'email', 'profile_url'] },
                { model: User, as: 'addressee', attributes: ['user_id', 'username', 'email', 'profile_url'] }
            ]
        });

        return friendships.map(f => {
            return f.requester_id === userId ? f.addressee : f.requester;
        });
    }

    static async getPendingRequests(userId) {
        return await Friendship.findAll({
            where: {
                addressee_id: userId,
                status: 'pending'
            },
            include: [
                { model: User, as: 'requester', attributes: ['user_id', 'username', 'email', 'profile_url'] }
            ]
        });
    }

    static async getSuggestions(userId) {
        const existing = await Friendship.findAll({
            where: {
                [Op.or]: [
                    { requester_id: userId },
                    { addressee_id: userId }
                ]
            },
            attributes: ['requester_id', 'addressee_id']
        });

        const excludedIds = new Set([userId]);
        existing.forEach(f => {
            excludedIds.add(f.requester_id);
            excludedIds.add(f.addressee_id);
        });

        return await User.findAll({
            where: {
                user_id: { [Op.notIn]: Array.from(excludedIds) },
                is_actived: true
            },
            attributes: ['user_id', 'username', 'email', 'profile_url'],
            limit: 20
        });
    }

    static async getRelationshipStatus(currentUserId, targetUserId) {
        if (currentUserId === targetUserId) {
            return { status: 'self' };
        }

        const friendship = await Friendship.findOne({
            where: {
                [Op.or]: [
                    { requester_id: currentUserId, addressee_id: targetUserId },
                    { requester_id: targetUserId, addressee_id: currentUserId }
                ]
            }
        });

        if (!friendship) {
            return { status: 'none' };
        }

        if (friendship.status === 'accepted') {
            return { status: 'friends' };
        }

        if (friendship.status === 'pending') {
            if (friendship.requester_id === currentUserId) {
                return { status: 'pending_sent' };
            }
            return { status: 'pending_received', requesterId: friendship.requester_id };
        }

        // declined or any other state — treat as no relationship
        return { status: 'none' };
    }

    static async removeFriendship(userId, targetUserId) {
        const deleted = await Friendship.destroy({
            where: {
                [Op.or]: [
                    { requester_id: userId, addressee_id: targetUserId },
                    { requester_id: targetUserId, addressee_id: userId }
                ]
            }
        });

        if (!deleted) {
            throw new Error("Not friendss");
        }
        return true;
    }
}