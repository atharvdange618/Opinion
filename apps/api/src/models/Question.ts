import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  isMandatory: boolean;
  options: string[];
  order: number;
  poll: mongoose.Types.ObjectId;
  text: string;
}

const questionSchema = new Schema<IQuestion>({
  isMandatory: { default: false, type: Boolean },
  options: { required: true, type: [String] },
  order: { required: true, type: Number },
  poll: { ref: 'Poll', required: true, type: Schema.Types.ObjectId },
  text: { required: true, type: String },
});

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
