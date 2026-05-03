import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import CreatorProfile from '../models/CreatorProfile';
import VerificationRequest from '../models/VerificationRequest';
import { trackEvent } from '../config/posthog';

const router = Router();

function parseFollowerCount(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;

    const normalized = value.trim().toLowerCase().replace(/,/g, '');
    const match = normalized.match(/^(\d+(?:\.\d+)?)([km])?$/);
    if (!match) return Number(normalized) || 0;

    const amount = Number(match[1]);
    const multiplier = match[2] === 'm' ? 1_000_000 : match[2] === 'k' ? 1_000 : 1;
    return Math.round(amount * multiplier);
}

router.post('/request', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user || req.user.accountType !== 'Creator') {
            res.status(403).json({ error: 'Only creators can request verification' });
            return;
        }

        const existingPending = await VerificationRequest.findOne({
            userId: req.userId,
            status: 'pending',
        });

        if (existingPending) {
            res.status(409).json({ error: 'A verification request is already pending' });
            return;
        }

        const profile = await CreatorProfile.findOne({ userId: req.userId });
        const followerCount = parseFollowerCount(profile?.followers);
        const evidence = Array.isArray(req.body?.evidence) ? req.body.evidence : [];

        const verificationRequest = await VerificationRequest.create({
            userId: req.userId,
            requestType: 'self_request',
            followerCount,
            platform: 'instagram',
            evidence,
        });

        req.user.verificationStatus = 'pending';
        req.user.verificationRequestedAt = new Date();
        await req.user.save();

        trackEvent(req.userId, 'verification_requested', {
            requestId: verificationRequest._id.toString(),
            requestType: verificationRequest.requestType,
            followerCount,
            platform: verificationRequest.platform,
        });

        res.status(201).json({ success: true, verificationRequest });
    } catch (error: any) {
        console.error('Create verification request error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/status', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const latestRequest = await VerificationRequest.findOne({ userId: req.userId })
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            verificationStatus: req.user?.verificationStatus || 'unverified',
            verificationBadge: req.user?.verificationBadge || 'none',
            latestRequest,
        });
    } catch (error: any) {
        console.error('Get verification status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/auto-flag', async (_req, res: Response): Promise<void> => {
    try {
        const users = await User.find({
            accountType: 'Creator',
            verificationStatus: 'unverified',
        }).select('_id');

        const userIds = users.map(user => user._id);
        const profiles = await CreatorProfile.find({ userId: { $in: userIds } }).select('userId followers');
        let flaggedCount = 0;

        for (const profile of profiles) {
            const followerCount = parseFollowerCount(profile.followers);
            if (followerCount < 100_000) {
                continue;
            }

            const existingPending = await VerificationRequest.findOne({
                userId: profile.userId,
                status: 'pending',
            });

            if (existingPending) {
                continue;
            }

            await VerificationRequest.create({
                userId: profile.userId,
                requestType: 'auto_flag',
                followerCount,
                platform: 'instagram',
            });

            await User.findByIdAndUpdate(profile.userId, {
                $set: {
                    verificationStatus: 'pending',
                    verificationRequestedAt: new Date(),
                },
            });

            flaggedCount += 1;
        }

        res.status(200).json({ success: true, count: flaggedCount });
    } catch (error: any) {
        console.error('Auto-flag verification error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
