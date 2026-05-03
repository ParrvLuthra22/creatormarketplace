import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    fullName: string;
    email: string;
    password?: string;
    accountType: 'Brand' | 'Creator';
    plan: 'free' | 'basic' | 'pro';
    subscriptionStatus: 'inactive' | 'active' | 'past_due' | 'cancelled' | 'expired';
    razorpaySubscriptionId?: string;
    razorpayCustomerId?: string;
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    profilePicture?: string;
    isAdmin: boolean;
    suspended: boolean;
    emailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
    verificationBadge: 'none' | 'verified' | 'premium';
    verificationRequestedAt?: Date;
    verificationApprovedAt?: Date;
    verificationApprovedBy?: mongoose.Types.ObjectId;
    verificationRejectionReason?: string;
    youtubeId?: string;
    youtubeChannelId?: string;
    youtubeAccessToken?: string;
    youtubeRefreshToken?: string;
    snapchatId?: string;
    snapchatAccessToken?: string;
    lastSocialSyncAt?: Date;
    lastLoginAt?: Date;
    lastSeen?: Date;
    // OAuth fields
    googleId?: string;
    instagramId?: string;
    twitterId?: string;
    linkedinId?: string;
    oauthProvider?: 'google' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'snapchat' | 'local';
    instagramAccessToken?: string;
    googleAccessToken?: string;
    googleRefreshToken?: string;
    instagramHandle?: string;
    isNewOAuthUser?: boolean; // transient flag, not persisted
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters long'],
        // Not required for OAuth users
    },
    profilePicture: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    suspended: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
        index: true,
        sparse: true,
    },
    emailVerificationExpires: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
        index: true,
        sparse: true,
    },
    passwordResetExpires: {
        type: Date,
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified',
    },
    verificationBadge: {
        type: String,
        enum: ['none', 'verified', 'premium'],
        default: 'none',
    },
    verificationRequestedAt: {
        type: Date,
    },
    verificationApprovedAt: {
        type: Date,
    },
    verificationApprovedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    verificationRejectionReason: {
        type: String,
    },
    // OAuth
    googleId: {
        type: String,
        sparse: true,
        unique: true,
    },
    instagramId: {
        type: String,
        sparse: true,
        unique: true,
    },
    twitterId: {
        type: String,
        sparse: true,
        unique: true,
    },
    linkedinId: {
        type: String,
        sparse: true,
        unique: true,
    },
    youtubeId: {
        type: String,
        sparse: true,
        unique: true,
    },
    youtubeChannelId: {
        type: String,
    },
    youtubeAccessToken: {
        type: String,
    },
    youtubeRefreshToken: {
        type: String,
    },
    snapchatId: {
        type: String,
        sparse: true,
        unique: true,
    },
    snapchatAccessToken: {
        type: String,
    },
    oauthProvider: {
        type: String,
        enum: ['google', 'instagram', 'twitter', 'linkedin', 'youtube', 'snapchat', 'local'],
        default: 'local',
    },
    instagramAccessToken: {
        type: String,
    },
    googleAccessToken: {
        type: String,
    },
    googleRefreshToken: {
        type: String,
    },
    instagramHandle: {
        type: String,
    },
    lastSocialSyncAt: {
        type: Date,
    },
    lastLoginAt: {
        type: Date,
    },
    lastSeen: {
        type: Date,
    },
    accountType: {
        type: String,
        enum: ['Brand', 'Creator'],
        required: [true, 'Account type is required'],
    },
    plan: {
        type: String,
        enum: ['free', 'basic', 'pro'],
        default: 'free',
    },
    subscriptionStatus: {
        type: String,
        enum: ['inactive', 'active', 'past_due', 'cancelled', 'expired'],
        default: 'inactive',
    },
    razorpaySubscriptionId: {
        type: String,
        sparse: true,
    },
    razorpayCustomerId: {
        type: String,
        sparse: true,
    },
    subscriptionStartDate: {
        type: Date,
    },
    subscriptionEndDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    // Only hash if password is present and modified
    if (!this.password || !this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
