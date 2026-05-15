import mongoose, { Document, Schema } from 'mongoose';

export interface IPoll extends Document {
  createdAt: Date;
  creator: mongoose.Types.ObjectId;
  description: string;
  expiresAt: Date;
  responseMode: 'anonymous' | 'authenticated';
  slug: string;
  status: 'active' | 'expired' | 'published';
  title: string;
}

const pollSchema = new Schema<IPoll>(
  {
    creator: { ref: 'User', required: true, type: Schema.Types.ObjectId },
    description: { default: '', type: String },
    expiresAt: { required: true, type: Date },
    responseMode: {
      enum: ['anonymous', 'authenticated'],
      required: true,
      type: String,
    },
    slug: { required: true, type: String, unique: true },
    status: {
      default: 'active',
      enum: ['active', 'expired', 'published'],
      type: String,
    },
    title: { required: true, type: String },
  },
  { timestamps: true },
);

export const Poll = mongoose.model<IPoll>('Poll', pollSchema);
