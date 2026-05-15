import mongoose, { Document, Schema } from 'mongoose';

export interface IResponse extends Document {
  createdAt: Date;
  fingerprint?: string;
  poll: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  respondent?: mongoose.Types.ObjectId | null;
  respondentId?: string;
  selectedOption: string;
}

const responseSchema = new Schema<IResponse>(
  {
    fingerprint: { type: String },
    poll: { ref: 'Poll', required: true, type: Schema.Types.ObjectId },
    question: { ref: 'Question', required: true, type: Schema.Types.ObjectId },
    respondent: {
      default: null,
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
    respondentId: { type: String },
    selectedOption: { required: true, type: String },
  },
  { timestamps: true },
);

responseSchema.index({ poll: 1, respondentId: 1 });
responseSchema.index({ poll: 1, question: 1 });

export const Response = mongoose.model<IResponse>('Response', responseSchema);
