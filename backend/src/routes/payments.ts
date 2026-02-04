import { Router, Request, Response } from 'express';
import User from '../models/User';
import Payment from '../models/Payment';
import razorpay from '../config/razorpay';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

// Plan mapping to Razorpay plan IDs
const PLAN_MAPPING: { [key: string]: string } = {
    basic: process.env.RAZORPAY_PLAN_BASIC || '',
    pro: process.env.RAZORPAY_PLAN_PRO || '',
};

// GET /api/payments/plans - Return available subscription plans
router.get('/plans', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const plans = [
            {
                id: 'basic',
                name: 'Basic',
                price: 999,
                currency: 'INR',
                interval: 'monthly',
                features: [
                    'Full creator discovery',
                    'Unlimited browsing',
                    'Email support',
                    'Basic analytics'
                ],
                recommended: false
            },
            {
                id: 'pro',
                name: 'Pro',
                price: 2999,
                currency: 'INR',
                interval: 'monthly',
                features: [
                    'Everything in Basic',
                    'Send proposals',
                    'Direct messaging',
                    'TIER & SIGNAL columns',
                    'Priority support'
                ],
                recommended: true
            }
        ];

        res.status(200).json({ success: true, plans });
    } catch (error: any) {
        console.error('Get plans error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// POST /api/payments/create-subscription - Create Razorpay subscription
router.post('/create-subscription', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { planId } = req.body;
        const userId = req.userId;

        if (!planId || !['basic', 'pro'].includes(planId)) {
            res.status(400).json({ success: false, error: 'Invalid plan ID' });
            return;
        }

        // Verify user is a brand
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        if (user.accountType !== 'Brand') {
            res.status(403).json({ success: false, error: 'Only brands can subscribe' });
            return;
        }

        // Check for existing active subscription
        if (user.subscriptionStatus === 'active') {
            res.status(400).json({ success: false, error: 'Already have active subscription' });
            return;
        }

        // Check if Razorpay is configured
        if (!razorpay) {
            res.status(503).json({ success: false, error: 'Payment system not configured' });
            return;
        }

        // Create subscription in Razorpay
        const subscription = await razorpay.subscriptions.create({
            plan_id: PLAN_MAPPING[planId],
            customer_notify: 1,
            total_count: 12, // 12 monthly payments
            notes: {
                userId: userId?.toString() || '',
                planId
            }
        });

        res.status(200).json({
            success: true,
            subscription,
            razorpay_key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error: any) {
        console.error('Create subscription error:', error);
        res.status(500).json({ success: false, error: 'Failed to create subscription' });
    }
});

// POST /api/payments/verify-subscription - Verify payment signature
router.post('/verify-subscription', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;

        if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
            res.status(400).json({ success: false, error: 'Missing required fields' });
            return;
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            res.status(400).json({ success: false, error: 'Invalid signature' });
            return;
        }

        // Check if Razorpay is configured
        if (!razorpay) {
            res.status(503).json({ success: false, error: 'Payment system not configured' });
            return;
        }

        // Get subscription details from Razorpay
        const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
        const planId = (subscription.notes?.planId || 'free') as 'free' | 'basic' | 'pro';

        // Update user
        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        user.plan = planId;
        user.subscriptionStatus = 'active';
        user.razorpaySubscriptionId = razorpay_subscription_id;
        user.subscriptionStartDate = new Date();
        user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await user.save();

        // Create payment record
        await Payment.create({
            userId: req.userId,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySubscriptionId: razorpay_subscription_id,
            amount: planId === 'basic' ? 999 : 2999,
            currency: 'INR',
            status: 'captured',
            paymentType: 'subscription',
            metadata: { planId }
        });

        res.status(200).json({
            success: true,
            message: 'Subscription activated successfully',
            subscription: {
                plan: user.plan,
                status: user.subscriptionStatus,
                start_date: user.subscriptionStartDate,
                end_date: user.subscriptionEndDate
            }
        });
    } catch (error: any) {
        console.error('Verify subscription error:', error);
        res.status(500).json({ success: false, error: 'Failed to verify subscription' });
    }
});

// GET /api/payments/subscription-status - Get current user's subscription
router.get('/subscription-status', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        res.status(200).json({
            success: true,
            subscription: {
                plan: user.plan,
                status: user.subscriptionStatus,
                start_date: user.subscriptionStartDate,
                end_date: user.subscriptionEndDate,
                razorpay_subscription_id: user.razorpaySubscriptionId,
                auto_renew: user.subscriptionStatus === 'active'
            }
        });
    } catch (error: any) {
        console.error('Get subscription status error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// POST /api/payments/cancel-subscription - Cancel active subscription
router.post('/cancel-subscription', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        if (!user.razorpaySubscriptionId) {
            res.status(400).json({ success: false, error: 'No active subscription' });
            return;
        }

        // Check if Razorpay is configured
        if (!razorpay) {
            res.status(503).json({ success: false, error: 'Payment system not configured' });
            return;
        }

        // Cancel subscription in Razorpay
        await razorpay.subscriptions.cancel(user.razorpaySubscriptionId);

        // Update user status (keep access until end date)
        user.subscriptionStatus = 'cancelled';
        await user.save();

        const endDate = user.subscriptionEndDate?.toLocaleDateString() || 'end of period';
        res.status(200).json({
            success: true,
            message: `Subscription cancelled. Access until ${endDate}`
        });
    } catch (error: any) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ success: false, error: 'Failed to cancel subscription' });
    }
});

// POST /api/payments/webhook - Handle Razorpay webhooks
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'] as string;
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (expectedSignature !== webhookSignature) {
            res.status(400).send('Invalid signature');
            return;
        }

        const event = req.body.event;
        const payload = req.body.payload.subscription.entity;

        // Handle different webhook events
        switch (event) {
            case 'subscription.charged':
                // Payment successful, extend subscription
                const chargedUser = await User.findOne({ razorpaySubscriptionId: payload.id });
                if (chargedUser) {
                    chargedUser.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    chargedUser.subscriptionStatus = 'active';
                    await chargedUser.save();
                }
                break;

            case 'subscription.cancelled':
                // Subscription cancelled
                const cancelledUser = await User.findOne({ razorpaySubscriptionId: payload.id });
                if (cancelledUser) {
                    cancelledUser.subscriptionStatus = 'cancelled';
                    await cancelledUser.save();
                }
                break;

            case 'subscription.halted':
                // Payment failed, suspend access
                const haltedUser = await User.findOne({ razorpaySubscriptionId: payload.id });
                if (haltedUser) {
                    haltedUser.subscriptionStatus = 'past_due';
                    await haltedUser.save();
                }
                break;

            case 'payment.failed':
                // Log failed payment
                console.error('Payment failed for subscription:', payload.id);
                break;
        }

        res.status(200).json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

export default router;
