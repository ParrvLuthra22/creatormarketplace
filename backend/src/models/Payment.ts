import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    razorpayPaymentId: string;
    razorpayOrderId?: string;
    razorpaySubscriptionId?: string;
    amount: number;
    currency: string;
    status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
    paymentType: 'subscription' | 'commission' | 'refund';
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    razorpayPaymentId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    razorpayOrderId: String,
    razorpaySubscriptionId: String,
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'INR',
    },
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
        default: 'created',
    },
    paymentType: {
        type: String,
        enum: ['subscription', 'commission', 'refund'],
        required: true,
    },
    metadata: Schema.Types.Mixed,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update updatedAt on save
PaymentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
