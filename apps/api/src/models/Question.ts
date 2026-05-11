import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  poll: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  isMandatory: boolean;
  order: number;
}

const questionSchema = new Schema<IQuestion>({
  poll: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
  text: { type: String, required: true },
  options: { type: [String], required: true },
  isMandatory: { type: Boolean, default: false },
  order: { type: Number, required: true },
});

export const Question = mongoose.model<IQuestion>("Question", questionSchema);
