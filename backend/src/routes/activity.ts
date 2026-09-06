import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Proposal from '../models/Proposal';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import VerificationRequest from '../models/VerificationRequest';
import BrandProfile from '../models/BrandProfile';
import CreatorProfile from '../models/CreatorProfile';
import { trackEvent } from '../config/posthog';

const router = Router();

interface ActivityItem {
    id: string;
    type: 'proposal_created' | 'proposal_accepted' | 'proposal_declined' | 'message' | 'verification';
    text: string;
    message: string;
    highlight?: string;
    actorId?: string;
    actorName?: string;
    actorAvatar?: string | null;
    entityId?: string;
    entityName?: string;
    timestamp: string;
    href?: string;
}

// GET /api/activity - Recent events relevant to the current user, aggregated
// from proposals, messages, and verification requests (no dedicated activity log yet).
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId as string;
        const isBrand = req.user?.accountType === 'Brand';
        const base = isBrand ? '/dashboard/brand' : '/dashboard/creator';

        const proposalQuery = isBrand ? { brandId: userId } : { creatorId: userId };
        const proposals = await Proposal.find(proposalQuery)
            .populate('brandId', 'fullName')
            .populate('creatorId', 'fullName')
            .sort({ updatedAt: -1 })
            .limit(15)
            .lean();

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

        // Batch-fetch avatars for every "other party" referenced above, in one
        // pass per profile type, instead of a query per item.
        const otherUserIds = new Set<string>();
        (proposals as any[]).forEach((p) => {
            const other = isBrand ? p.creatorId : p.brandId;
            if (other?._id) otherUserIds.add(other._id.toString());
        });
        (messages as any[]).forEach((m) => {
            if (m.senderId?._id) otherUserIds.add(m.senderId._id.toString());
        });

        const [brandProfiles, creatorProfiles] = await Promise.all([
            BrandProfile.find({ userId: { $in: Array.from(otherUserIds) } }).select('userId logoUrl').lean(),
            CreatorProfile.find({ userId: { $in: Array.from(otherUserIds) } }).select('userId profilePhoto').lean(),
        ]);
        const avatarByUserId = new Map<string, string | null>();
        brandProfiles.forEach((p) => avatarByUserId.set(p.userId.toString(), p.logoUrl || null));
        creatorProfiles.forEach((p) => avatarByUserId.set(p.userId.toString(), p.profilePhoto || null));

        const items: ActivityItem[] = [];

        for (const p of proposals as any[]) {
            const other = isBrand ? p.creatorId : p.brandId;
            const name = other?.fullName || 'Someone';
            const actorId = other?._id?.toString();
            const actorAvatar = actorId ? avatarByUserId.get(actorId) ?? null : null;
            const proposalsHref = isBrand ? `${base}/campaigns` : `${base}/inbox`;

            if (p.status === 'accepted') {
                items.push({
                    id: `proposal-${p._id}-accepted`,
                    type: 'proposal_accepted',
                    text: `${name} accepted your proposal for "${p.title}"`,
                    message: `${name} accepted your proposal for "${p.title}"`,
                    highlight: name,
                    actorId,
                    actorName: name,
                    actorAvatar,
                    entityId: p._id.toString(),
                    entityName: p.title,
                    timestamp: p.updatedAt,
                    href: isBrand ? `${base}/campaigns` : `${base}/deals`,
                });
            } else if (p.status === 'declined') {
                items.push({
                    id: `proposal-${p._id}-declined`,
                    type: 'proposal_declined',
                    text: `${name} declined your proposal for "${p.title}"`,
                    message: `${name} declined your proposal for "${p.title}"`,
                    highlight: name,
                    actorId,
                    actorName: name,
                    actorAvatar,
                    entityId: p._id.toString(),
                    entityName: p.title,
                    timestamp: p.updatedAt,
                    href: proposalsHref,
                });
            } else {
                const text = isBrand
                    ? `You sent a proposal to ${name} for "${p.title}"`
                    : `${name} sent you a proposal for "${p.title}"`;
                items.push({
                    id: `proposal-${p._id}-created`,
                    type: 'proposal_created',
                    text,
                    message: text,
                    highlight: name,
                    actorId,
                    actorName: name,
                    actorAvatar,
                    entityId: p._id.toString(),
                    entityName: p.title,
                    timestamp: p.createdAt,
                    href: proposalsHref,
                });
            }
        }

        for (const m of messages as any[]) {
            const name = m.senderId?.fullName || 'Someone';
            const actorId = m.senderId?._id?.toString();
            const actorAvatar = actorId ? avatarByUserId.get(actorId) ?? null : null;
            items.push({
                id: `message-${m._id}`,
                type: 'message',
                text: `New message from ${name}`,
                message: `New message from ${name}`,
                highlight: name,
                actorId,
                actorName: name,
                actorAvatar,
                entityId: m._id.toString(),
                timestamp: m.createdAt,
                href: `${base}/messages`,
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
                message: label,
                entityId: v._id.toString(),
                timestamp: v.updatedAt,
                href: isBrand ? `${base}/settings` : `${base}/profile`,
            });
        }

        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const activity = items.slice(0, 20);

        trackEvent(userId, 'activity_viewed', { count: activity.length });

        res.status(200).json({ success: true, activity });
    } catch (error: any) {
        console.error('Get activity error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
