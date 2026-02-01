import mongoose, { Schema, Document } from 'mongoose';

interface BrandWorkItem {
    title: string;
    type: 'image' | 'video';
    url: string;
    instagramUrl?: string;
}

interface PricingInfo {
    starting: number;
    per: string;
}

export interface ICreatorProfile extends Document {
    userId: mongoose.Types.ObjectId;
    instagramHandle: string;
    profilePhoto?: string;
    niches: string[];
    pricing?: PricingInfo;
    availability: 'available' | 'limited' | 'unavailable';
    followers?: string;
    engagement?: string;
    brandWork: BrandWorkItem[];
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const CreatorProfile = mongoose.model<ICreatorProfile>('CreatorProfile', CreatorProfileSchema);

export default CreatorProfile;
