import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  createdAt: Date;
  email: string;
  name: string;
  picture?: null | string;
  sub: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { required: true, type: String },
    name: { required: true, type: String },
    picture: { default: null, type: String },
    sub: { required: true, type: String, unique: true },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);
