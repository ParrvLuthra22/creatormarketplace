import mongoose, { Document, Schema } from 'mongoose';

export interface IProposal extends Document {
  brandId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  deliverables: string;
  deadline: Date;
  status: 'pending' | 'accepted' | 'declined';
  dealStage: 'brief' | 'content_creation' | 'review' | 'approved' | 'posted' | 'paid';
  completedDeliverables: string[];
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<IProposal>(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    deliverables: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
    // Creator-tracked progress through an accepted deal. Advanced by the creator
    // via PUT /api/proposals/:id/stage — self-reported, since no payment/posting
    // integration exists yet to detect these transitions automatically.
    dealStage: {
      type: String,
      enum: ['brief', 'content_creation', 'review', 'approved', 'posted', 'paid'],
      default: 'brief',
    },
    completedDeliverables: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying proposals by brand or creator
proposalSchema.index({ brandId: 1, status: 1 });
proposalSchema.index({ creatorId: 1, status: 1 });

export default mongoose.model<IProposal>('Proposal', proposalSchema);
