import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import passport from 'passport';
import User from '../models/User';
import BrandProfile from '../models/BrandProfile';
import CreatorProfile from '../models/CreatorProfile';
import { generateToken } from '../utils/jwt';
import { validateEmail, validatePassword, validateFullName } from '../utils/validation';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { generators } from 'openid-client';
import { linkedinClient, findOrCreateOAuthUser, snapchatClient, twitterClient } from '../config/passport';
import { trackEvent } from '../config/posthog';
import { sendEmail } from '../config/email';
import { passwordResetEmail, verifyEmail, welcomeEmail } from '../utils/emailTemplates';

const router = Router();
const TOKEN_EXPIRY_HOURS = {
    emailVerification: 24,
    passwordReset: 1,
};

function generateRawToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

async function sendAccountEmail(input: { to: string; subject: string; html: string }) {
    try {
        await sendEmail(input);
    } catch (error) {
        console.error(`Email send failed (${input.subject}):`, error);
    }
}

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

        const emailVerificationRawToken = generateRawToken();

        // Create new user
        const user = new User({
            fullName,
            email: email.toLowerCase(),
            password,
            accountType,
            plan: plan || selectedPlan || subscriptionPlan,
            subscriptionStatus,
            emailVerificationToken: hashToken(emailVerificationRawToken),
            emailVerificationExpires: addHours(new Date(), TOKEN_EXPIRY_HOURS.emailVerification),
            lastLoginAt: new Date(),
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

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        await Promise.all([
            sendAccountEmail({
                to: user.email,
                subject: 'Welcome to CreatorLyff',
                html: welcomeEmail(user.fullName, user.accountType),
            }),
            sendAccountEmail({
                to: user.email,
                subject: 'Verify your CreatorLyff email',
                html: verifyEmail(user.fullName, `${frontendUrl}/verify-email?token=${emailVerificationRawToken}`),
            }),
        ]);

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

        trackEvent(user._id.toString(), 'user_signup', {
            accountType: user.accountType,
            email: user.email,
            plan: user.plan,
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
                emailVerified: user.emailVerified,
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

        user.lastLoginAt = new Date();
        await user.save();

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

        trackEvent(user._id.toString(), 'user_login', {
            accountType: user.accountType,
            email: user.email,
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

// POST /api/auth/request-password-reset - Send password reset email
router.post('/request-password-reset', authLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (email && validateEmail(email)) {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
                const rawToken = generateRawToken();
                user.passwordResetToken = hashToken(rawToken);
                user.passwordResetExpires = addHours(new Date(), TOKEN_EXPIRY_HOURS.passwordReset);
                await user.save();

                await sendAccountEmail({
                    to: user.email,
                    subject: 'Reset your CreatorLyff password',
                    html: passwordResetEmail(
                        user.fullName,
                        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}`
                    ),
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'If an account exists for that email, password reset instructions have been sent.',
        });
    } catch (error: any) {
        console.error('Request password reset error:', error);
        res.status(200).json({
            success: true,
            message: 'If an account exists for that email, password reset instructions have been sent.',
        });
    }
});

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            res.status(400).json({ error: 'token and newPassword are required' });
            return;
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            res.status(400).json({ error: passwordValidation.message });
            return;
        }

        const user = await User.findOne({
            passwordResetToken: hashToken(token),
            passwordResetExpires: { $gt: new Date() },
        });

        if (!user) {
            res.status(400).json({ error: 'Invalid or expired reset token' });
            return;
        }

        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/verify-email - Verify account email
router.post('/verify-email', async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ error: 'token is required' });
            return;
        }

        const user = await User.findOne({
            emailVerificationToken: hashToken(token),
            emailVerificationExpires: { $gt: new Date() },
        });

        if (!user) {
            res.status(400).json({ error: 'Invalid or expired verification token' });
            return;
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error: any) {
        console.error('Verify email error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/resend-verification - Send a new verification email
router.post('/resend-verification', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (req.user.emailVerified) {
            res.status(200).json({ success: true, message: 'Email is already verified' });
            return;
        }

        const rawToken = generateRawToken();
        req.user.emailVerificationToken = hashToken(rawToken);
        req.user.emailVerificationExpires = addHours(new Date(), TOKEN_EXPIRY_HOURS.emailVerification);
        await req.user.save();

        await sendAccountEmail({
            to: req.user.email,
            subject: 'Verify your CreatorLyff email',
            html: verifyEmail(
                req.user.fullName,
                `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${rawToken}`
            ),
        });

        res.status(200).json({ success: true, message: 'Verification email sent' });
    } catch (error: any) {
        console.error('Resend verification email error:', error);
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



// GET /api/auth/google - Redirect to Google consent screen (Basic Login)
router.get(
    '/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'], 
        session: false 
    })
);

// GET /api/auth/youtube - Redirect to Google consent screen (with YouTube scopes)
router.get(
    '/youtube',
    passport.authenticate('google-youtube', {
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly'],
        session: false,
        accessType: 'offline',
        prompt: 'consent'
    } as any)
);

// GET /api/auth/youtube/callback - Handle YouTube OAuth callback
router.get(
    '/youtube/callback',
    passport.authenticate('google-youtube', { session: false, failureRedirect: `${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')}/?error=youtube_auth_failed` }),
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
            user.lastLoginAt = new Date();
            await user.save();
            trackEvent(user._id.toString(), 'oauth_login', {
                provider: 'youtube',
                isNewOAuthUser: isNew === '1',
            });
            res.redirect(`${frontendUrl}/auth/callback?new=${isNew}`);
        } catch (error) {
            console.error('YouTube callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')}/?error=callback_failed`);
        }
    }
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
            user.lastLoginAt = new Date();
            await user.save();
            trackEvent(user._id.toString(), 'oauth_login', {
                provider: 'google',
                isNewOAuthUser: isNew === '1',
            });
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
            user.lastLoginAt = new Date();
            await user.save();
            trackEvent(user._id.toString(), 'oauth_login', {
                provider: 'instagram',
                isNewOAuthUser: isNew === '1',
            });
            res.redirect(`${frontendUrl}/auth/callback?new=${isNew}`);
        } catch (error) {
            console.error('Instagram callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000')}/?error=callback_failed`);
        }
    }
);

// ─── OAuth: Twitter (X) ───────────────────────────────────────────────────────

// GET /api/auth/twitter - Redirect to Twitter consent screen
router.get(
    '/twitter',
    (req: Request, res: Response): void => {
        if (!twitterClient) {
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?error=twitter_not_configured`);
            return;
        }

        try {
            const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
                process.env.TWITTER_CALLBACK_URL || 'http://localhost:5001/api/auth/twitter/callback',
                { scope: ['tweet.read', 'users.read'] }
            );

            // Store state and codeVerifier in cookies
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
                maxAge: 10 * 60 * 1000, // 10 minutes
            };

            res.cookie('twitter_oauth_state', state, cookieOptions);
            res.cookie('twitter_oauth_code_verifier', codeVerifier, cookieOptions);

            res.redirect(url);
        } catch (error: any) {
            console.error('Twitter auth init error:', error);
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?error=twitter_init_failed&details=${encodeURIComponent(error.message || 'unknown')}`);
        }
    }
);

// GET /api/auth/twitter/callback - Handle Twitter callback
router.get(
    '/twitter/callback',
    async (req: Request, res: Response): Promise<void> => {
        const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000');
        try {
            if (!twitterClient) throw new Error('Twitter client not initialized');

            const { state, code } = req.query;
            const savedState = req.cookies?.twitter_oauth_state;
            const codeVerifier = req.cookies?.twitter_oauth_code_verifier;

            if (!state || !savedState || state !== savedState) {
                throw new Error('Missing or invalid state cookie for Twitter OAuth');
            }
            if (!code || !codeVerifier) {
                throw new Error('Missing code or code verifier');
            }

            // Clear the cookies
            res.clearCookie('twitter_oauth_state');
            res.clearCookie('twitter_oauth_code_verifier');

            const { client: loggedClient, accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
                code: code as string,
                codeVerifier,
                redirectUri: process.env.TWITTER_CALLBACK_URL || 'http://localhost:5001/api/auth/twitter/callback',
            });

            // Fetch the user's profile from Twitter
            const { data: userObject } = await loggedClient.v2.me({ 'user.fields': ['profile_image_url'] });

            // Twitter API v2 doesn't return email natively without special elevated permissions
            const email = `${userObject.id}@twitter.placeholder.com`;
            const fullName = userObject.name || userObject.username || 'Twitter User';

            const { user, isNewUser } = await findOrCreateOAuthUser({
                provider: 'twitter',
                providerId: userObject.id,
                email,
                fullName,
                profilePicture: userObject.profile_image_url,
            });

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

            user.lastLoginAt = new Date();
            await user.save();

            trackEvent(user._id.toString(), 'oauth_login', {
                provider: 'twitter',
                isNewOAuthUser: isNewUser,
            });

            res.redirect(`${frontendUrl}/auth/callback?new=${isNewUser ? '1' : '0'}`);
        } catch (error: any) {
            console.error('Twitter callback error:', error);
            res.redirect(`${frontendUrl}/?error=callback_failed&details=${encodeURIComponent(error.message || 'unknown')}`);
        }
    }
);

// ─── OAuth: LinkedIn ──────────────────────────────────────────────────────────

// GET /api/auth/linkedin - Redirect to LinkedIn consent screen
router.get(
    '/linkedin',
    (req: Request, res: Response): void => {
        if (!linkedinClient) {
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?error=linkedin_not_configured`);
            return;
        }
        
        const state = generators.state();
        const url = linkedinClient.authorizationUrl({
            scope: 'openid profile email',
            state,
        });

        // Store state in a cookie
        res.cookie('linkedin_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 10 * 60 * 1000, // 10 minutes
        });

        res.redirect(url);
    }
);

// GET /api/auth/linkedin/callback - Handle LinkedIn callback
router.get(
    '/linkedin/callback',
    async (req: Request, res: Response): Promise<void> => {
        const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000');
        try {
            if (!linkedinClient) throw new Error('LinkedIn client not initialized');
            
            const params = linkedinClient.callbackParams(req);
            const state = req.cookies?.linkedin_state;
            
            if (!state) throw new Error('Missing state cookie for LinkedIn OAuth');

            const tokenSet = await linkedinClient.callback(
                process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:5001/api/auth/linkedin/callback',
                params,
                { state }
            );

            // Clear the state cookie
            res.clearCookie('linkedin_state');

            const profile = tokenSet.claims();
            const email = profile.email as string;
            if (!email) throw new Error('No email in LinkedIn profile');

            const fullName = (profile.name as string) || 'LinkedIn User';
            const picture = profile.picture as string | undefined;
            const sub = profile.sub as string;

            const { user, isNewUser } = await findOrCreateOAuthUser({
                provider: 'linkedin',
                providerId: sub,
                email,
                fullName,
                profilePicture: picture,
            });

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

            user.lastLoginAt = new Date();
            await user.save();

            trackEvent(user._id.toString(), 'oauth_login', {
                provider: 'linkedin',
                isNewOAuthUser: isNewUser,
            });

            res.redirect(`${frontendUrl}/auth/callback?new=${isNewUser ? '1' : '0'}`);
        } catch (error: any) {
            console.error('LinkedIn callback error:', error);
            res.redirect(`${frontendUrl}/?error=callback_failed&details=${encodeURIComponent(error.message || 'unknown')}`);
        }
    }
);

// ─── OAuth: Snapchat ─────────────────────────────────────────────────────────

router.get(
    '/snapchat',
    (req: Request, res: Response): void => {
        if (!snapchatClient) {
            res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?error=snapchat_not_configured`);
            return;
        }

        const state = generators.state();
        const url = snapchatClient.authorizationUrl({
            scope: [
                'https://auth.snapchat.com/oauth2/api/user.display_name',
                'https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar',
            ].join(' '),
            state,
        });

        res.cookie('snapchat_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 10 * 60 * 1000,
        });

        res.redirect(url);
    }
);

router.get(
    '/snapchat/callback',
    async (req: Request, res: Response): Promise<void> => {
        const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://creatormarketplace.vercel.app' : 'http://localhost:3000');
        try {
            if (!snapchatClient) throw new Error('Snapchat client not initialized');

            const params = snapchatClient.callbackParams(req);
            const state = req.cookies?.snapchat_state;

            if (!state) throw new Error('Missing state cookie for Snapchat OAuth');

            const tokenSet = await snapchatClient.oauthCallback(
                process.env.SNAPCHAT_CALLBACK_URL || 'http://localhost:5001/api/auth/snapchat/callback',
                params,
                { state }
            );

            res.clearCookie('snapchat_state');

            const profile = await snapchatClient.userinfo(tokenSet.access_token);
            const snapchatId = (profile.sub || profile.id) as string;
            if (!snapchatId) throw new Error('No Snapchat user id returned');

            const fullName = (profile.display_name || profile.name || 'Snapchat User') as string;
            const profilePicture = (profile.bitmoji_avatar_url || profile.picture) as string | undefined;
            const email = `${snapchatId}@snapchat.placeholder.com`;

            const { user, isNewUser } = await findOrCreateOAuthUser({
                provider: 'snapchat',
                providerId: snapchatId,
                email,
                fullName,
                profilePicture,
                accessToken: tokenSet.access_token,
            });

            if (profilePicture) {
                user.profilePicture = profilePicture;
            }
            user.lastLoginAt = new Date();
            await user.save();

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

            trackEvent(user._id.toString(), 'oauth_login', {
                provider: 'snapchat',
                isNewOAuthUser: isNewUser,
            });

            res.redirect(`${frontendUrl}/auth/callback?new=${isNewUser ? '1' : '0'}`);
        } catch (error: any) {
            console.error('Snapchat callback error:', error);
            res.redirect(`${frontendUrl}/?error=callback_failed&details=${encodeURIComponent(error.message || 'unknown')}`);
        }
    }
);

export default router;
