import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import User from '../models/User';
import CreatorProfile from '../models/CreatorProfile';
import BrandProfile from '../models/BrandProfile';

const router = Router();

// GET /api/chat/summary - Summary counts for sidebar badges
router.get('/summary', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const conversations = await Conversation.find({ participants: userId }).select('_id');
        const conversationIds = conversations.map(c => c._id);

        const unreadMessages = await Message.countDocuments({
            conversationId: { $in: conversationIds },
            senderId: { $ne: userId },
            read: false,
            deleted: { $ne: true },
        });

        res.status(200).json({
            success: true,
            unreadMessages,
        });
    } catch (error: any) {
        console.error('Get chat summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/chat/conversations - Get all conversations for a user
router.get('/conversations', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const conversations = await Conversation.find({
            participants: userId
        })
        .populate('participants', 'fullName accountType')
        .sort({ lastMessageAt: -1 });

        // Enrich with profile photos
        const enrichedConversations = await Promise.all(conversations.map(async (conv) => {
            const convObj = conv.toObject();
            convObj.participants = await Promise.all(convObj.participants.map(async (p: any) => {
                if (p.accountType === 'Creator') {
                    const profile = await CreatorProfile.findOne({ userId: p._id }).select('profilePhoto');
                    if (profile?.profilePhoto) p.profilePhoto = profile.profilePhoto;
                } else if (p.accountType === 'Brand') {
                    const profile = await BrandProfile.findOne({ userId: p._id }).select('logoUrl');
                    if (profile?.logoUrl) p.profilePhoto = profile.logoUrl;
                }
                return p;
            }));
            return convObj;
        }));

        res.status(200).json({ conversations: enrichedConversations });
    } catch (error: any) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/chat/:conversationId - Get messages for a specific conversation
router.get('/:conversationId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;

        // Verify user is part of the conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found or access denied' });
            return;
        }

        // Fetch messages
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        // Mark unread messages as read
        await Message.updateMany(
            { conversationId, senderId: { $ne: userId }, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ messages });
    } catch (error: any) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/chat/conversations - Create or get a conversation
router.post('/conversations', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { participantId } = req.body;

        if (!participantId) {
            res.status(400).json({ error: 'participantId is required' });
            return;
        }

        let conversation;
        let pId = participantId;

        // Verify if participantId is valid objectID, if not, try to find a user by name or just get any brand/creator
        if (!participantId.match(/^[0-9a-fA-F]{24}$/)) {
            const currentUser = await User.findById(userId);
            const oppositeType = currentUser?.accountType === 'Creator' ? 'Brand' : 'Creator';
            const fallbackUser = await User.findOne({ accountType: oppositeType });
            if (!fallbackUser) {
                res.status(404).json({ error: 'No user found to start conversation' });
                return;
            }
            pId = fallbackUser._id.toString();
        }

        // Check if conversation already exists
        conversation = await Conversation.findOne({
            participants: { $all: [userId, pId] }
        }).populate('participants', 'fullName accountType');

        if (!conversation) {
            // Check if participant exists
            const participant = await User.findById(pId);
            if (!participant) {
                res.status(404).json({ error: 'Participant user not found' });
                return;
            }

            conversation = await Conversation.create({
                participants: [userId, pId],
            });
            await conversation.populate('participants', 'fullName accountType');
        }

        const convObj = conversation.toObject();
        convObj.participants = await Promise.all(convObj.participants.map(async (p: any) => {
            if (p.accountType === 'Creator') {
                const profile = await CreatorProfile.findOne({ userId: p._id }).select('profilePhoto');
                if (profile?.profilePhoto) p.profilePhoto = profile.profilePhoto;
            } else if (p.accountType === 'Brand') {
                const profile = await BrandProfile.findOne({ userId: p._id }).select('logoUrl');
                if (profile?.logoUrl) p.profilePhoto = profile.logoUrl;
            }
            return p;
        }));

        res.status(200).json({ conversation: convObj });
    } catch (error: any) {
        console.error('Create conversation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/chat/messages/:messageId - Edit a message (sender only)
router.put('/messages/:messageId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;
        const { text } = req.body;

        if (!text || !text.trim()) {
            res.status(400).json({ error: 'Message text is required' });
            return;
        }

        const message = await Message.findById(messageId);
        if (!message) {
            res.status(404).json({ error: 'Message not found' });
            return;
        }

        if (message.senderId.toString() !== userId) {
            res.status(403).json({ error: 'You can only edit your own messages' });
            return;
        }

        message.text = text.trim();
        message.edited = true;
        await message.save();

        res.status(200).json({ success: true, message });
    } catch (error: any) {
        console.error('Edit message error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/chat/messages/:messageId - Delete a message (sender only)
router.delete('/messages/:messageId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;

        const message = await Message.findById(messageId);
        if (!message) {
            res.status(404).json({ error: 'Message not found' });
            return;
        }

        if (message.senderId.toString() !== userId) {
            res.status(403).json({ error: 'You can only delete your own messages' });
            return;
        }

        message.text = 'This message was deleted';
        message.deleted = true;
        await message.save();

        res.status(200).json({ success: true, message });
    } catch (error: any) {
        console.error('Delete message error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/chat/conversations/:id/close - Close a conversation
router.put('/conversations/:id/close', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const conversation = await Conversation.findOne({
            _id: id,
            participants: userId,
        });

        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
            return;
        }

        conversation.closed = true;
        await conversation.save();

        res.status(200).json({ success: true, conversation });
    } catch (error: any) {
        console.error('Close conversation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
