import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from 'passport-facebook';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

/**
 * Helper: attempt to register a strategy and log a warning if credentials are missing.
 * This prevents the server from crashing when env vars are not yet configured.
 */
function tryRegister(name: string, register: () => void) {
    try {
        register();
        console.log(`✅ OAuth: ${name} strategy registered`);
    } catch (err: any) {
        console.warn(`⚠️  OAuth: ${name} strategy SKIPPED — ${err.message}`);
        console.warn(`   → Set ${name.toUpperCase()}_CLIENT_ID and ${name.toUpperCase()}_CLIENT_SECRET in .env to enable it.`);
    }
}

// ─── Shared OAuth user handler ─────────────────────────────────────────────────
async function findOrCreateOAuthUser(opts: {
    provider: 'google' | 'instagram';
    providerId: string;
    email: string;
    fullName: string;
    profilePicture?: string;
    accessToken?: string;
}): Promise<{ user: InstanceType<typeof User>; isNewUser: boolean }> {
    const { provider, providerId, email, fullName, profilePicture, accessToken } = opts;
    const idField = provider === 'google' ? 'googleId' : 'instagramId';

    // 1. Find by provider ID
    let user = await User.findOne({ [idField]: providerId });

    // 2. Find by email (link existing account)
    if (!user) {
        user = await User.findOne({ email: email.toLowerCase() });
    }

    let isNewUser = false;

    if (!user) {
        // 3. Create new user — accountType placeholder, set in onboarding
        isNewUser = true;
        const newUser = new User({
            fullName,
            email: email.toLowerCase(),
            [idField]: providerId,
            oauthProvider: provider,
            accountType: 'Creator', // placeholder, overwritten in /onboarding
            profilePicture,
            ...(provider === 'instagram' && { instagramAccessToken: accessToken }),
            plan: 'free',
            subscriptionStatus: 'inactive',
        });
        await newUser.save();
        user = newUser;
    } else {
        // 4. Link provider ID to existing account
        let changed = false;
        if (!user[idField as keyof typeof user]) {
            (user as any)[idField] = providerId;
            changed = true;
        }
        if (provider === 'instagram' && accessToken) {
            user.instagramAccessToken = accessToken;
            changed = true;
        }
        if (profilePicture && !user.profilePicture) {
            user.profilePicture = profilePicture;
            changed = true;
        }
        if (changed) await user.save();
    }

    return { user: user as any, isNewUser };
}

// ─── Google Strategy ───────────────────────────────────────────────────────────
tryRegister('google', () => {
    const clientID = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

    if (!clientID || clientID.includes('PASTE_YOUR')) {
        throw new Error('GOOGLE_CLIENT_ID is not configured');
    }

    passport.use(
        new GoogleStrategy(
            {
                clientID,
                clientSecret,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback',
            },
            async (_accessToken: string, _refreshToken: string, profile: GoogleProfile, done: (err: Error | null, user?: any) => void) => {
                try {
                    const email = profile.emails?.[0]?.value;
                    if (!email) return done(new Error('No email in Google profile'), undefined);

                    const { user, isNewUser } = await findOrCreateOAuthUser({
                        provider: 'google',
                        providerId: profile.id,
                        email,
                        fullName: profile.displayName || profile.name?.givenName || 'User',
                        profilePicture: profile.photos?.[0]?.value,
                    });

                    (user as any)._isNewOAuthUser = isNewUser;
                    return done(null, user);
                } catch (error) {
                    return done(error as Error, undefined);
                }
            }
        )
    );
});

// ─── Facebook / Instagram Strategy ────────────────────────────────────────────
tryRegister('instagram', () => {
    const clientID = process.env.INSTAGRAM_CLIENT_ID || '';
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || '';

    if (!clientID || clientID.includes('PASTE_YOUR')) {
        throw new Error('INSTAGRAM_CLIENT_ID is not configured');
    }

    passport.use(
        new FacebookStrategy(
            {
                clientID,
                clientSecret,
                callbackURL: process.env.INSTAGRAM_CALLBACK_URL || 'http://localhost:5001/api/auth/instagram/callback',
                profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
                // Request a long-lived token scope
                enableProof: true,
            },
            async (accessToken: string, _refreshToken: string, profile: FacebookProfile, done: (err: Error | null, user?: any) => void) => {
                try {
                    const email = profile.emails?.[0]?.value;
                    if (!email) {
                        return done(
                            new Error('No email found. Please ensure your Facebook account has a verified email address.'),
                            undefined
                        );
                    }

                    const fullName = [profile.name?.givenName, profile.name?.familyName]
                        .filter(Boolean)
                        .join(' ') || 'User';

                    const { user, isNewUser } = await findOrCreateOAuthUser({
                        provider: 'instagram',
                        providerId: profile.id,
                        email,
                        fullName,
                        profilePicture: profile.photos?.[0]?.value,
                        accessToken, // Store for Instagram Graph API calls
                    });

                    (user as any)._isNewOAuthUser = isNewUser;
                    (user as any)._accessToken = accessToken; // Pass token to callback handler
                    return done(null, user);
                } catch (error) {
                    return done(error as Error, undefined);
                }
            }
        )
    );
});


// ─── Passport session stubs (we use JWT cookies, not sessions) ─────────────────
passport.serializeUser((user: any, done: (err: any, id?: any) => void) => done(null, user._id));
passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
