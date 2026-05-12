import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from 'passport-facebook';
import { TwitterApi } from 'twitter-api-v2';
import { Issuer } from 'openid-client';
import User from '../models/User';

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
export async function findOrCreateOAuthUser(opts: {
    provider: 'google' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'snapchat';
    providerId: string;
    email: string;
    fullName: string;
    profilePicture?: string;
    accessToken?: string;
}): Promise<{ user: InstanceType<typeof User>; isNewUser: boolean }> {
    const { provider, providerId, email, fullName, profilePicture, accessToken } = opts;
    const idField = provider === 'google' ? 'googleId' :
                    provider === 'youtube' ? 'youtubeId' :
                    provider === 'instagram' ? 'instagramId' :
                    provider === 'twitter' ? 'twitterId' :
                    provider === 'snapchat' ? 'snapchatId' : 'linkedinId';

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
            ...(provider === 'snapchat' && { snapchatAccessToken: accessToken }),
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
        if (provider === 'snapchat' && accessToken) {
            user.snapchatAccessToken = accessToken;
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
            async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: (err: Error | null, user?: any) => void) => {
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

                    // Save the tokens so we can access YouTube data later
                    if (accessToken) (user as any).googleAccessToken = accessToken;
                    if (refreshToken) (user as any).googleRefreshToken = refreshToken;
                    await user.save();

                    (user as any)._isNewOAuthUser = isNewUser;
                    return done(null, user);
                } catch (error) {
                    return done(error as Error, undefined);
                }
            }
        )
    );
});

// ─── YouTube Strategy (Google OAuth with YouTube read scope) ───────────────────
tryRegister('youtube', () => {
    const clientID = process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '';

    if (!clientID || clientID.includes('PASTE_YOUR')) {
        throw new Error('YOUTUBE_CLIENT_ID is not configured');
    }

    passport.use(
        'google-youtube',
        new GoogleStrategy(
            {
                clientID,
                clientSecret,
                callbackURL: process.env.YOUTUBE_CALLBACK_URL || 'http://localhost:5001/api/auth/youtube/callback',
            },
            async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: (err: Error | null, user?: any) => void) => {
                try {
                    const email = profile.emails?.[0]?.value;
                    if (!email) return done(new Error('No email in Google profile'), undefined);

                    const { user, isNewUser } = await findOrCreateOAuthUser({
                        provider: 'youtube',
                        providerId: profile.id,
                        email,
                        fullName: profile.displayName || profile.name?.givenName || 'YouTube User',
                        profilePicture: profile.photos?.[0]?.value,
                    });

                    user.youtubeId = profile.id;
                    if (accessToken) user.youtubeAccessToken = accessToken;
                    if (refreshToken) user.youtubeRefreshToken = refreshToken;
                    await user.save();

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


// ─── Twitter (X) Strategy (OAuth 2.0 PKCE) ────────────────────────────────────
export let twitterClient: TwitterApi | null = null;

const setupTwitter = () => {
    const clientID = process.env.TWITTER_CLIENT_ID || '';
    const clientSecret = process.env.TWITTER_CLIENT_SECRET || '';

    if (!clientID || clientID.includes('PASTE_YOUR')) {
        console.warn(`⚠️  OAuth: twitter strategy SKIPPED — TWITTER_CLIENT_ID is not configured`);
        return;
    }

    try {
        twitterClient = new TwitterApi({
            clientId: clientID,
            clientSecret: clientSecret,
        });
        console.log(`✅ OAuth: twitter client initialized via twitter-api-v2`);
    } catch (error: any) {
        console.warn(`⚠️  OAuth: twitter strategy SKIPPED — ${error.message}`);
    }
};

setupTwitter();

// ─── LinkedIn Strategy (OpenID Connect) ───────────────────────────────────────
export let linkedinClient: any = null;

const setupLinkedIn = async () => {
    const clientID = process.env.LINKEDIN_CLIENT_ID || '';
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';

    if (!clientID || clientID.includes('PASTE_YOUR')) {
        console.warn(`⚠️  OAuth: linkedin strategy SKIPPED — LINKEDIN_CLIENT_ID is not configured`);
        return;
    }

    try {
        const linkedinIssuer = await Issuer.discover('https://www.linkedin.com/oauth');
        linkedinClient = new linkedinIssuer.Client({
            client_id: clientID,
            client_secret: clientSecret,
            redirect_uris: [process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:5001/api/auth/linkedin/callback'],
            response_types: ['code'],
            token_endpoint_auth_method: 'client_secret_post',
        });
        console.log(`✅ OAuth: linkedin client initialized via openid-client`);
    } catch (error: any) {
        console.warn(`⚠️  OAuth: linkedin strategy SKIPPED — ${error.message}`);
    }
};

setupLinkedIn();

// ─── Snapchat OAuth 2.0 / OpenID Connect ──────────────────────────────────────
export let snapchatClient: any = null;

const setupSnapchat = async () => {
    const clientID = process.env.SNAPCHAT_CLIENT_ID || '';
    const clientSecret = process.env.SNAPCHAT_CLIENT_SECRET || '';

    if (!clientID || clientID.includes('PASTE_YOUR')) {
        console.warn(`⚠️  OAuth: snapchat strategy SKIPPED — SNAPCHAT_CLIENT_ID is not configured`);
        return;
    }

    try {
  const snapchatIssuer = new Issuer({
    issuer: 'https://accounts.snapchat.com',

    authorization_endpoint:
      'https://accounts.snapchat.com/accounts/oauth2/auth',

    token_endpoint:
      'https://accounts.snapchat.com/accounts/oauth2/token',

    userinfo_endpoint:
      'https://kit.snapchat.com/v1/me',
  });

  snapchatClient = new snapchatIssuer.Client({
    client_id: clientID,
    client_secret: clientSecret,

    redirect_uris: [
      process.env.SNAPCHAT_CALLBACK_URL ||
      'http://localhost:5001/api/auth/snapchat/callback'
    ],

    response_types: ['code'],

    token_endpoint_auth_method: 'client_secret_post',
  });

  console.log('✅ OAuth: snapchat client initialized manually');
} catch (error: any) {
  console.warn(`⚠️ OAuth: snapchat strategy SKIPPED — ${error.message}`);
}
};

setupSnapchat();


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
