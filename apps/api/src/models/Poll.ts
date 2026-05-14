import mongoose, { Schema, Document } from 'mongoose';

export interface IPoll extends Document {
  creator: mongoose.Types.ObjectId;
  title: string;
  description: string;
  expiresAt: Date;
  responseMode: 'anonymous' | 'authenticated';
  status: 'active' | 'expired' | 'published';
  slug: string;
  createdAt: Date;
}

const pollSchema = new Schema<IPoll>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    expiresAt: { type: Date, required: true },
    responseMode: {
      type: String,
      enum: ['anonymous', 'authenticated'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'published'],
      default: 'active',
    },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Poll = mongoose.model<IPoll>('Poll', pollSchema);
