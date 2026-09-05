import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Proposal from '../models/Proposal';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import VerificationRequest from '../models/VerificationRequest';

const router = Router();

interface ActivityItem {
    id: string;
    type: 'proposal_created' | 'proposal_accepted' | 'proposal_declined' | 'message' | 'verification';
    text: string;
    highlight?: string;
    timestamp: string;
    href?: string;
}

// GET /api/activity - Recent events relevant to the current user, aggregated
// from proposals, messages, and verification requests (no dedicated activity log yet).
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const isBrand = req.user?.accountType === 'Brand';

        const proposalQuery = isBrand ? { brandId: userId } : { creatorId: userId };
        const proposals = await Proposal.find(proposalQuery)
            .populate('brandId', 'fullName')
            .populate('creatorId', 'fullName')
            .sort({ updatedAt: -1 })
            .limit(15)
            .lean();

        const items: ActivityItem[] = [];

        for (const p of proposals as any[]) {
            const otherName = isBrand ? p.creatorId?.fullName : p.brandId?.fullName;
            const name = otherName || 'Someone';

            if (p.status === 'accepted') {
                items.push({
                    id: `proposal-${p._id}-accepted`,
                    type: 'proposal_accepted',
                    text: `${name} accepted your proposal for "${p.title}"`,
                    highlight: name,
                    timestamp: p.updatedAt,
                    href: '/dashboard/brand/campaigns',
                });
            } else if (p.status === 'declined') {
                items.push({
                    id: `proposal-${p._id}-declined`,
                    type: 'proposal_declined',
                    text: `${name} declined your proposal for "${p.title}"`,
                    highlight: name,
                    timestamp: p.updatedAt,
                    href: '/dashboard/brand/campaigns',
                });
            } else {
                items.push({
                    id: `proposal-${p._id}-created`,
                    type: 'proposal_created',
                    text: isBrand
                        ? `You sent a proposal to ${name} for "${p.title}"`
                        : `${name} sent you a proposal for "${p.title}"`,
                    highlight: name,
                    timestamp: p.createdAt,
                    href: '/dashboard/brand/campaigns',
                });
            }
        }

        const conversations = await Conversation.find({ participants: userId }).select('_id').lean();
        const conversationIds = conversations.map((c) => c._id);

        const messages = await Message.find({
            conversationId: { $in: conversationIds },
            senderId: { $ne: userId },
            deleted: { $ne: true },
        })
            .populate('senderId', 'fullName')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        for (const m of messages as any[]) {
            const name = m.senderId?.fullName || 'Someone';
            items.push({
                id: `message-${m._id}`,
                type: 'message',
                text: `New message from ${name}`,
                highlight: name,
                timestamp: m.createdAt,
                href: '/dashboard/brand/messages',
            });
        }

        const verifications = await VerificationRequest.find({ userId }).sort({ updatedAt: -1 }).limit(5).lean();
        for (const v of verifications as any[]) {
            const label =
                v.status === 'approved'
                    ? 'Your verification badge was approved'
                    : v.status === 'rejected'
                        ? 'Your verification request was declined'
                        : 'Your verification badge is under review';
            items.push({
                id: `verification-${v._id}`,
                type: 'verification',
                text: label,
                timestamp: v.updatedAt,
                href: '/dashboard/brand/settings',
            });
        }

        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        res.status(200).json({ success: true, activity: items.slice(0, 20) });
    } catch (error: any) {
        console.error('Get activity error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
