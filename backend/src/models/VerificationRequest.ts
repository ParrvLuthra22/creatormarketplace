import mongoose, { Document, Schema } from 'mongoose';

interface VerificationEvidence {
    type: string;
    url: string;
}

export interface IVerificationRequest extends Document {
    userId: mongoose.Types.ObjectId;
    requestType: 'auto_flag' | 'self_request';
    followerCount: number;
    platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'multi';
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    rejectionReason?: string;
    evidence: VerificationEvidence[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const VerificationRequestSchema = new Schema<IVerificationRequest>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        requestType: {
            type: String,
            enum: ['auto_flag', 'self_request'],
            required: true,
        },
        followerCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        platform: {
            type: String,
            enum: ['instagram', 'youtube', 'tiktok', 'twitter', 'multi'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reviewedAt: {
            type: Date,
        },
        rejectionReason: {
            type: String,
            trim: true,
        },
        evidence: {
            type: [{
                type: {
                    type: String,
                    required: true,
                    trim: true,
                },
                url: {
                    type: String,
                    required: true,
                    trim: true,
                },
            }],
            default: [],
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

VerificationRequestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IVerificationRequest>('VerificationRequest', VerificationRequestSchema);
