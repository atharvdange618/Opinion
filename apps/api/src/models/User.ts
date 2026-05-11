import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  sub: string;
  email: string;
  name: string;
  picture?: string | null;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    sub: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String, default: null },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
