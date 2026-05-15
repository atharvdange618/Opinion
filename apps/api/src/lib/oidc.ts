import { jwtVerify, SignJWT } from 'jose';
import crypto from 'node:crypto';

const STATE_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'fallback-secret-not-for-production',
);

export async function consumePkceSession(
  state: string,
): Promise<{ codeVerifier: string; redirectTo: string } | null> {
  try {
    const { payload } = await jwtVerify(state, STATE_SECRET, {
      algorithms: ['HS256'],
    });
    return {
      codeVerifier: payload.codeVerifier as string,
      redirectTo: payload.redirectTo as string,
    };
  } catch {
    return null;
  }
}

export async function createPkceSession(
  redirectTo: string,
): Promise<{ codeChallenge: string; codeVerifier: string; state: string }> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const state = await new SignJWT({ codeVerifier, redirectTo })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(STATE_SECRET);

  return { codeChallenge, codeVerifier, state };
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}
