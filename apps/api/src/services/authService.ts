import type { AuthPayload } from '../middleware/auth.js';

import { NotFoundError } from '../lib/errors.js';
import { type IUser, User } from '../models/User.js';

export async function getMe(userInfo: AuthPayload): Promise<IUser> {
  const user = await User.findOne({ sub: userInfo.sub });
  if (!user) throw new NotFoundError('User not found');
  return user;
}

export async function syncUser(userInfo: AuthPayload): Promise<IUser> {
  const user = await User.findOneAndUpdate(
    { sub: userInfo.sub },
    { email: userInfo.email, name: userInfo.name, picture: userInfo.picture },
    { new: true, upsert: true },
  );
  return user;
}
