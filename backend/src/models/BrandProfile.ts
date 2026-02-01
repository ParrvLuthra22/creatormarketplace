import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandProfile extends Document {
    userId: mongoose.Types.ObjectId;
    companyName?: string;
    industry?: string;
    totalRevenue: number;
    creatorsHired: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const BrandProfileSchema = new Schema<IBrandProfile>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    companyName: {
        type: String,
        trim: true,
    },
    industry: {
        type: String,
        trim: true,
    },
    totalRevenue: {
        type: Number,
        default: 0,
        min: 0,
    },
    creatorsHired: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const BrandProfile = mongoose.model<IBrandProfile>('BrandProfile', BrandProfileSchema);

export default BrandProfile;
