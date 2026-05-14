import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { verifySessionJwt } from '../services/oidcService.js';

let getKey: ReturnType<typeof createRemoteJWKSet> | null = null;

function initJwks() {
  if (!getKey) {
    const uri = `${process.env.KLEIS_IDP_URL}/.well-known/jwks.json`;
    getKey = createRemoteJWKSet(new URL(uri));
  }
  return getKey;
}

export interface AuthPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'opinion_session';

async function resolveUser(req: Request): Promise<AuthPayload | null> {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7);
    try {
      const key = initJwks();
      const { payload } = await jwtVerify(token, key, {
        issuer: process.env.KLEIS_IDP_URL,
      });
      return {
        sub: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string,
        picture: payload.picture as string | undefined,
      };
    } catch {
      return null;
    }
  }

  const cookie = req.cookies?.[SESSION_COOKIE];
  if (cookie) {
    const user = await verifySessionJwt(cookie);
    if (user) return user;
  }

  return null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await resolveUser(req);
  if (!user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  req.user = user;
  next();
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await resolveUser(req);
  if (user) req.user = user;
  next();
}
