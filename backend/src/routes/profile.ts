import { Router, Response } from 'express';
import BrandProfile from '../models/BrandProfile';
import CreatorProfile from '../models/CreatorProfile';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/profile/brand/:userId - Get brand profile
router.get('/brand/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // Verify user exists and is a brand
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Brand') {
            res.status(400).json({ error: 'User is not a brand account' });
            return;
        }

        // Fetch brand profile
        const profile = await BrandProfile.findOne({ userId })
            .populate('creatorsHired', 'fullName email');

        if (!profile) {
            res.status(404).json({ error: 'Brand profile not found' });
            return;
        }

        res.status(200).json({ profile });
    } catch (error: any) {
        console.error('Get brand profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/profile/creator/:userId - Get creator profile
router.get('/creator/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // Verify user exists and is a creator
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Creator') {
            res.status(400).json({ error: 'User is not a creator account' });
            return;
        }

        // Fetch creator profile
        const profile = await CreatorProfile.findOne({ userId });

        if (!profile) {
            res.status(404).json({ error: 'Creator profile not found' });
            return;
        }

        res.status(200).json({ profile });
    } catch (error: any) {
        console.error('Get creator profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
