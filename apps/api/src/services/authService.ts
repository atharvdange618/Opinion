import { User, IUser } from "../models/User.js";
import { NotFoundError, UnauthorizedError } from "../lib/errors.js";
import type { AuthPayload } from "../middleware/auth.js";

export async function syncUser(userInfo: AuthPayload): Promise<IUser> {
  const user = await User.findOneAndUpdate(
    { sub: userInfo.sub },
    { email: userInfo.email, name: userInfo.name, picture: userInfo.picture },
    { upsert: true, new: true },
  );
  return user;
}

export async function getMe(userInfo: AuthPayload): Promise<IUser> {
  const user = await User.findOne({ sub: userInfo.sub });
  if (!user) throw new NotFoundError("User not found");
  return user;
}
