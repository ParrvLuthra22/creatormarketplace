import mongoose, { Schema, Document } from 'mongoose';

interface BrandWorkItem {
    title: string;
    type: 'image' | 'video';
    url: string;
    instagramUrl?: string;
}

interface PricingInfo {
    starting?: number;
    per?: string;
    reel?: number;
    story?: number;
    post?: number;
}

interface RecentYouTubeVideo {
    videoId: string;
    title: string;
    thumbnailUrl?: string;
    publishedAt?: string;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
    duration?: string;
}

export interface ICreatorProfile extends Document {
    userId: mongoose.Types.ObjectId;
    instagramHandle: string;
    profilePhoto?: string;
    coverImage?: string;
    bio?: string;
    location?: string;
    niches: string[];
    pricing?: PricingInfo;
    availability: 'available' | 'limited' | 'unavailable';
    followers?: string;
    engagement?: string;
    brandWork: BrandWorkItem[];
    // Instagram Graph API data (cached after OAuth)
    instagramUserId?: string;
    instagramBio?: string;
    instagramFollowerCount?: number;
    instagramFollowingCount?: number;
    instagramMediaCount?: number;
    instagramAccountType?: string; // 'PERSONAL', 'BUSINESS', 'MEDIA_CREATOR'
    instagramWebsite?: string;
    instagramDataUpdatedAt?: Date;
    recentMedia?: {
        id: string;
        mediaUrl?: string;
        thumbnailUrl?: string;
        permalink: string;
        mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
        caption?: string;
        timestamp: string;
        likeCount?: number;
        commentsCount?: number;
    }[];
    youtubeChannelId?: string;
    youtubeChannelTitle?: string;
    youtubeSubscriberCount?: number;
    youtubeViewCount?: number;
    youtubeVideoCount?: number;
    youtubeBio?: string;
    youtubeThumbnailUrl?: string;
    youtubeBannerUrl?: string;
    youtubeDataUpdatedAt?: Date;
    recentYouTubeVideos?: RecentYouTubeVideo[];
    snapchatHandle?: string;
    snapchatBitmojiUrl?: string;
    twitterHandle?: string;
    twitterFollowerCount?: number;
    twitterDataUpdatedAt?: Date;
    linkedinHandle?: string;
    linkedinHeadline?: string;
    linkedinDataUpdatedAt?: Date;
    combinedFollowerCount?: number;
    primaryPlatform?: 'instagram' | 'youtube' | 'twitter' | 'linkedin' | 'snapchat';
    createdAt: Date;
}

const CreatorProfileSchema = new Schema<ICreatorProfile>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    instagramHandle: {
        type: String,
        required: [true, 'Instagram handle is required'],
        trim: true,
        match: [/^@?[a-zA-Z0-9._]+$/, 'Please provide a valid Instagram handle'],
    },
    profilePhoto: {
        type: String,
        trim: true,
    },
    coverImage: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    niches: {
        type: [String],
        default: [],
    },
    pricing: {
        starting: {
            type: Number,
            min: 0,
        },
        per: {
            type: String,
        },
        reel: {
            type: Number,
            min: 0,
        },
        story: {
            type: Number,
            min: 0,
        },
        post: {
            type: Number,
            min: 0,
        },
    },
    availability: {
        type: String,
        enum: ['available', 'limited', 'unavailable'],
        default: 'available',
    },
    followers: {
        type: String,
    },
    engagement: {
        type: String,
    },
    brandWork: {
        type: [{
            title: String,
            type: {
                type: String,
                enum: ['image', 'video'],
            },
            url: String,
            instagramUrl: String,
        }],
        default: [],
    },
    // Instagram Graph API cached data
    instagramUserId: { type: String },
    instagramBio: { type: String },
    instagramFollowerCount: { type: Number },
    instagramFollowingCount: { type: Number },
    instagramMediaCount: { type: Number },
    instagramAccountType: { type: String },
    instagramWebsite: { type: String },
    instagramDataUpdatedAt: { type: Date },
    recentMedia: {
        type: [{
            id: String,
            mediaUrl: String,
            thumbnailUrl: String,
            permalink: String,
            mediaType: { type: String, enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'] },
            caption: String,
            timestamp: String,
            likeCount: Number,
            commentsCount: Number,
        }],
        default: [],
    },
    youtubeChannelId: { type: String },
    youtubeChannelTitle: { type: String },
    youtubeSubscriberCount: { type: Number },
    youtubeViewCount: { type: Number },
    youtubeVideoCount: { type: Number },
    youtubeBio: { type: String },
    youtubeThumbnailUrl: { type: String },
    youtubeBannerUrl: { type: String },
    youtubeDataUpdatedAt: { type: Date },
    recentYouTubeVideos: {
        type: [{
            videoId: String,
            title: String,
            thumbnailUrl: String,
            publishedAt: String,
            viewCount: Number,
            likeCount: Number,
            commentCount: Number,
            duration: String,
        }],
        default: [],
    },
    snapchatHandle: { type: String },
    snapchatBitmojiUrl: { type: String },
    twitterHandle: { type: String },
    twitterFollowerCount: { type: Number },
    twitterDataUpdatedAt: { type: Date },
    linkedinHandle: { type: String },
    linkedinHeadline: { type: String },
    linkedinDataUpdatedAt: { type: Date },
    combinedFollowerCount: {
        type: Number,
        default: 0,
    },
    primaryPlatform: {
        type: String,
        enum: ['instagram', 'youtube', 'twitter', 'linkedin', 'snapchat'],
        default: 'instagram',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const CreatorProfile = mongoose.model<ICreatorProfile>('CreatorProfile', CreatorProfileSchema);

export default CreatorProfile;
