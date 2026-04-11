import { Router, Request, Response } from 'express';
import passport from 'passport';
import User from '../models/User';
import BrandProfile from '../models/BrandProfile';
import CreatorProfile from '../models/CreatorProfile';
import { generateToken } from '../utils/jwt';
import { validateEmail, validatePassword, validateFullName } from '../utils/validation';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/auth/signup - Create user account
router.post('/signup', authLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, password, accountType, instagramHandle, plan, selectedPlan } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !accountType) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        // Validate full name
        const nameValidation = validateFullName(fullName);
        if (!nameValidation.valid) {
            res.status(400).json({ error: nameValidation.message });
            return;
        }

        // Validate email
        if (!validateEmail(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            res.status(400).json({ error: passwordValidation.message });
            return;
        }

        // Validate account type
        if (!['Brand', 'Creator'].includes(accountType)) {
            res.status(400).json({ error: 'Account type must be either Brand or Creator' });
            return;
        }

        // Validate Instagram handle for creators
        if (accountType === 'Creator' && !instagramHandle) {
            res.status(400).json({ error: 'Instagram handle is required for creator accounts' });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(409).json({ error: 'Email already exists' });
            return;
        }

        // Determine subscription plan and status for brands
        let subscriptionPlan: 'free' | 'basic' | 'pro' = 'free';
        let subscriptionStatus: 'inactive' | 'active' | 'past_due' | 'cancelled' | 'expired' = 'inactive';

        if (accountType === 'Brand' && selectedPlan) {
            // Map selectedPlan to plan field (starter -> basic)
            if (selectedPlan === 'starter') {
                subscriptionPlan = 'basic';
            } else if (['free', 'basic', 'pro'].includes(selectedPlan)) {
                subscriptionPlan = selectedPlan as 'free' | 'basic' | 'pro';
            }

            // Set subscription status
            if (subscriptionPlan === 'free') {
                subscriptionStatus = 'active'; // Free plan is active immediately
            } else {
                subscriptionStatus = 'inactive'; // Paid plans need payment (will be handled separately)
            }
        }

        // Create new user
        const user = new User({
            fullName,
            email: email.toLowerCase(),
            password,
            accountType,
            plan: plan || selectedPlan || subscriptionPlan,
            subscriptionStatus,
        });

        await user.save();

        // Create appropriate profile based on account type
        let profile;
        if (accountType === 'Brand') {
            profile = new BrandProfile({
                userId: user._id,
            });
        } else {
            profile = new CreatorProfile({
                userId: user._id,
                instagramHandle: instagramHandle.replace(/^@+/, ''),
            });
        }

        await profile.save();

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        // Set httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Return user data + profile (exclude password)
        res.status(201).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                accountType: user.accountType,
                plan: user.plan,
                subscriptionStatus: user.subscriptionStatus,
                createdAt: user.createdAt,
            },
            profile,
            token,
            requiresPayment: accountType === 'Brand' && subscriptionPlan !== 'free',
            selectedPlan: subscriptionPlan,
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// POST /api/auth/login - Authenticate user
router.post('/login', authLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Fetch profile based on account type
        let profile;
        if (user.accountType === 'Brand') {
            profile = await BrandProfile.findOne({ userId: user._id });
        } else {
            profile = await CreatorProfile.findOne({ userId: user._id });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        // Set httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Return user data + profile (exclude password)
        res.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                accountType: user.accountType,
                plan: user.plan,
                createdAt: user.createdAt,
            },
            profile,
            token,
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// GET /api/auth/me - Verify current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Fetch profile based on account type
        let profile;
        if (user.accountType === 'Brand') {
            profile = await BrandProfile.findOne({ userId: user._id });
        } else {
            profile = await CreatorProfile.findOne({ userId: user._id });
        }

        res.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                accountType: user.accountType,
                plan: user.plan,
                createdAt: user.createdAt,
            },
            profile,
        });
    } catch (error: any) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/logout - Clear auth cookie
router.post('/logout', (req: Request, res: Response): void => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

// GET /api/auth/token - Return raw token for socket auth
router.get('/token', authMiddleware, (req: AuthRequest, res: Response): void => {
    const token = req.cookies?.token;
    if (token) {
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: 'No token' });
    }
});

// PUT /api/auth/profile - Update user profile (fullName)
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { fullName } = req.body;

        if (!fullName) {
            res.status(400).json({ error: 'Full name is required' });
            return;
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { fullName } },
            { new: true }
        ).select('-password');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ success: true, user });
    } catch (error: any) {
        console.error('Update user profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/auth/password - Change user password
router.put('/password', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
            return;
        }

        // Find user
        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
            return;
        }

        // Validate new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            res.status(400).json({
                success: false,
                message: passwordValidation.message
            });
            return;
        }

        // Update password (will be hashed by the User model pre-save hook)
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error: any) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// DELETE /api/auth/account - Delete user account
router.delete('/account', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        // Find user to check account type
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Delete associated profile
        if (user.accountType === 'Brand') {
            await BrandProfile.deleteOne({ userId });
        } else if (user.accountType === 'Creator') {
            await CreatorProfile.deleteOne({ userId });
        }

        // Delete user
        await User.deleteOne({ _id: userId });

        // Clear cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });

    } catch (error: any) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// ─── Onboarding Route (for new OAuth users selecting Creator / Brand) ──────────

// POST /api/auth/onboarding - Set accountType after OAuth signup
router.post('/onboarding', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { accountType, instagramHandle } = req.body;

        if (!['Brand', 'Creator'].includes(accountType)) {
            res.status(400).json({ error: 'accountType must be Brand or Creator' });
            return;
        }

        if (accountType === 'Creator' && !instagramHandle) {
            res.status(400).json({ error: 'Instagram handle is required for creator accounts' });
            return;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Update accountType
        user.accountType = accountType;
        if (instagramHandle) {
            user.instagramHandle = instagramHandle.replace(/^@+/, '');
        }
        await user.save();

        // Create the profile if it doesn't already exist
        if (accountType === 'Brand') {
            const existing = await BrandProfile.findOne({ userId: user._id });
            if (!existing) {
                await new BrandProfile({ userId: user._id }).save();
            }
        } else {
            const existing = await CreatorProfile.findOne({ userId: user._id });
            if (!existing) {
                await new CreatorProfile({
                    userId: user._id,
                    instagramHandle: user.instagramHandle || '',
                }).save();
            }
        }

        res.status(200).json({ success: true, accountType });
    } catch (error: any) {
        console.error('Onboarding error:', error);
        res.status(500).json({ error: 'Server error during onboarding' });
    }
});



// GET /api/auth/google - Redirect to Google consent screen
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// GET /api/auth/google/callback - Handle Google callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')}/?error=google_auth_failed` }),
    async (req: any, res: Response): Promise<void> => {
        try {
            const user = req.user as any;
            if (!user) {
                res.redirect(`${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')}/?error=no_user`);
                return;
            }

            const token = generateToken({
                userId: user._id.toString(),
                email: user.email,
            });

            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const isNew = (user as any)._isNewOAuthUser ? '1' : '0';
            const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000');
            res.redirect(`${frontendUrl}/auth/callback?new=${isNew}`);
        } catch (error) {
            console.error('Google callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')}/?error=callback_failed`);
        }
    }
);

// ─── OAuth: Instagram (via Facebook) ───────────────────────────────────────────

// GET /api/auth/instagram - Redirect to Meta consent screen
router.get(
    '/instagram',
    passport.authenticate('facebook', {
        session: false,
        scope: ['email', 'public_profile'],
    })
);

// GET /api/auth/instagram/callback - Handle Meta/Instagram callback
router.get(
    '/instagram/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')}/?error=instagram_auth_failed` }),
    async (req: any, res: Response): Promise<void> => {
        try {
            const user = req.user as any;
            if (!user) {
                res.redirect(`${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')}/?error=no_user`);
                return;
            }

            const token = generateToken({
                userId: user._id.toString(),
                email: user.email,
            });

            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const isNew = (user as any)._isNewOAuthUser ? '1' : '0';
            const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000');
            res.redirect(`${frontendUrl}/auth/callback?new=${isNew}`);
        } catch (error) {
            console.error('Instagram callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')}/?error=callback_failed`);
        }
    }
);

export default router;
