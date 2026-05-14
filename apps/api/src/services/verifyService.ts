import { SignJWT, jwtVerify } from 'jose';
import { Poll } from '../models/Poll.js';
import { BadRequestError, NotFoundError } from '../lib/errors.js';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const VERIFY_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return false;

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

export async function createVerification(slug: string, turnstileToken: string): Promise<string> {
  const poll = await Poll.findOne({ slug });
  if (!poll) throw new NotFoundError('Poll not found');

  if (poll.responseMode !== 'anonymous') {
    throw new BadRequestError('Verification is only required for anonymous polls');
  }

  if (!(await verifyTurnstileToken(turnstileToken))) {
    throw new BadRequestError('Security check failed. Please try again.');
  }

  const jwt = await new SignJWT({ slug, verified: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(VERIFY_SECRET);

  return jwt;
}

export async function checkVerification(
  slug: string,
  cookie: string | undefined,
): Promise<boolean> {
  if (!cookie) return false;

  try {
    const { payload } = await jwtVerify(cookie, VERIFY_SECRET, {
      algorithms: ['HS256'],
    });
    return payload.slug === slug && payload.verified === true;
  } catch {
    return false;
  }
}
