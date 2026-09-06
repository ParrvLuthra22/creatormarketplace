import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';

const router = Router();

// GET /api/notifications - Recent notifications for the current user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

        const [notifications, unreadCount] = await Promise.all([
            Notification.find({ userId: req.userId })
                .populate('actorId', 'fullName')
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean(),
            Notification.countDocuments({ userId: req.userId, isRead: false }),
        ]);

        res.status(200).json({ success: true, notifications, unreadCount });
    } catch (error: any) {
        console.error('List notifications error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/notifications/:id/read - Mark a single notification as read
router.post('/:id/read', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { $set: { isRead: true } },
            { new: true }
        );

        if (!notification) {
            res.status(404).json({ error: 'Notification not found' });
            return;
        }

        res.status(200).json({ success: true, notification });
    } catch (error: any) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/notifications/read-all - Mark all of the current user's notifications as read
router.post('/read-all', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await Notification.updateMany(
            { userId: req.userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error: any) {
        console.error('Mark all notifications read error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
