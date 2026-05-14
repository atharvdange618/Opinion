import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';

const STATE_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'fallback-secret-not-for-production',
);

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

export async function createPkceSession(
  redirectTo: string,
): Promise<{ state: string; codeVerifier: string; codeChallenge: string }> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const state = await new SignJWT({ codeVerifier, redirectTo })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(STATE_SECRET);

  return { state, codeVerifier, codeChallenge };
}

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
