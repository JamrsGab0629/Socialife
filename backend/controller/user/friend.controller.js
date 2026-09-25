import { FriendService } from "../../services/friend.service.js";

export const sendFriendRequest = async (req, res) => {
    try {
        const requesterId = req.user.userId || req.user.user_id;
        const { userId: addresseeId } = req.params;

        const request = await FriendService.sendRequest(requesterId, addresseeId);
        return res.status(201).json({ success: true, message: "Friend request sent successfully", data: request });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const currentUserId = req.user.userId || req.user.user_id;
        const { userId: requesterId } = req.params;

        const updated = await FriendService.respondToRequest(currentUserId, requesterId, 'accepted');
        return res.status(200).json({ success: true, message: "Friend request accepted", data: updated });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const declineFriendRequest = async (req, res) => {
    try {
        const currentUserId = req.user.userId || req.user.user_id;
        const { userId: requesterId } = req.params;

        const updated = await FriendService.respondToRequest(currentUserId, requesterId, 'declined');
        return res.status(200).json({ success: true, message: "Friend request declined", data: updated });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getFriendsList = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const friends = await FriendService.getFriends(userId);
        return res.status(200).json({ success: true, data: friends });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getPendingRequestsList = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const requests = await FriendService.getPendingRequests(userId);
        return res.status(200).json({ success: true, data: requests });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getSuggestions = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const suggestions = await FriendService.getSuggestions(userId);
        return res.status(200).json({ success: true, data: suggestions });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.user_id;
        const { userId: targetId } = req.params;

        await FriendService.removeFriendship(userId, targetId);
        return res.status(200).json({ success: true, message: "Friendship removed successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
export const getRelationshipStatus = async (req, res) => {
    try {
        const currentUserId = req.user.userId || req.user.user_id;
        const { userId: targetUserId } = req.params;

        const result = await FriendService.getRelationshipStatus(currentUserId, targetUserId);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};