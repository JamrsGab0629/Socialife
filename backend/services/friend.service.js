import { Friendship, User } from "../model/association.model.js";
import { Op } from "sequelize";

export class FriendService {
    // Send a friend request
    static async sendRequest(requesterId, addresseeId) {
        if (requesterId === addresseeId) {
            throw new Error("You cannot send a friend request to yourself.");
        }

        // Check if a relationship already exists in either direction
        const existing = await Friendship.findOne({
            where: {
                [Op.or]: [
                    { requester_id: requesterId, addressee_id: addresseeId },
                    { requester_id: addresseeId, addressee_id: requesterId }
                ]
            }
        });

        if (existing) {
            if (existing.status === 'accepted') throw new Error("You are already friends.");
            if (existing.status === 'pending') throw new Error("A friend request is already pending.");
            // If previously declined, allow resending by updating status back to pending
            existing.requester_id = requesterId;
            existing.addressee_id = addresseeId;
            existing.status = 'pending';
            await existing.save();
            return existing;
        }

        return await Friendship.create({
            requester_id: requesterId,
            addressee_id: addresseeId,
            status: 'pending'
        });
    }

    // Accept or Decline a request
    static async respondToRequest(currentUserId, requesterId, status) {
        const friendship = await Friendship.findOne({
            where: {
                requester_id: requesterId,
                addressee_id: currentUserId,
                status: 'pending'
            }
        });

        if (!friendship) {
            throw new Error("Pending friend request not found.");
        }

        friendship.status = status; 
        await friendship.save();
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
                { model: User, as: 'requester', attributes: ['user_id', 'username', 'email'] },
                { model: User, as: 'addressee', attributes: ['user_id', 'username', 'email'] }
            ]
        });

        
        return friendships.map(f => {
            return f.requester_id === userId ? f.addressee : f.requester;
        });
    }

    // Get pending received requests
    static async getPendingRequests(userId) {
        return await Friendship.findAll({
            where: {
                addressee_id: userId,
                status: 'pending'
            },
            include: [
                { model: User, as: 'requester', attributes: ['user_id', 'username', 'email'] }
            ]
        });
    }

    // Remove friendship / cancel request
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
            throw new Error("Friendship connection not found.");
        }
        return true;
    }
}