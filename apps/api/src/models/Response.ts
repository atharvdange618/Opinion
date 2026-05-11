import mongoose, { Schema, Document } from "mongoose";

export interface IResponse extends Document {
  poll: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  respondent?: mongoose.Types.ObjectId | null;
  selectedOption: string;
  respondentId?: string;
  fingerprint?: string;
  createdAt: Date;
}

const responseSchema = new Schema<IResponse>(
  {
    poll: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    respondent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    selectedOption: { type: String, required: true },
    respondentId: { type: String },
    fingerprint: { type: String },
  },
  { timestamps: true },
);

responseSchema.index({ poll: 1, respondentId: 1 });
responseSchema.index({ poll: 1, question: 1 });

export const Response = mongoose.model<IResponse>("Response", responseSchema);
