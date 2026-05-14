import { SignJWT, jwtVerify } from 'jose';
import { createPkceSession, consumePkceSession } from '../lib/oidc.js';
import { BadRequestError } from '../lib/errors.js';

const IDP_URL = process.env.KLEIS_IDP_URL!;
const CLIENT_ID = process.env.KLEIS_CLIENT_ID!;
const CLIENT_SECRET = process.env.KLEIS_CLIENT_SECRET!;
const APP_URL = process.env.PUBLIC_APP_URL!;
const FRONTEND_URL = process.env.PUBLIC_FRONTEND_URL!;
const SESSION_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);
const SESSION_DURATION = 7 * 24 * 60 * 60;

export interface SessionUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export async function initiateLogin(
  redirectTo: string,
): Promise<{ authorizeUrl: string; state: string }> {
  const { state, codeChallenge } = await createPkceSession(redirectTo);
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${APP_URL}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return { authorizeUrl: `${IDP_URL}/authorize?${params.toString()}`, state };
}

export async function completeAuth(
  code: string,
  state: string,
): Promise<{ user: SessionUser; sessionJwt: string; redirectTo: string }> {
  const pkce = await consumePkceSession(state);
  if (!pkce) throw new BadRequestError('Invalid or expired state parameter');

  const tokenRes = await fetch(`${IDP_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${APP_URL}/api/auth/callback`,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code_verifier: pkce.codeVerifier,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new BadRequestError(`Token exchange failed: ${text}`);
  }

  const tokens = await tokenRes.json();

  const userinfoRes = await fetch(`${IDP_URL}/userinfo`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userinfoRes.ok) {
    throw new BadRequestError('Failed to fetch user info');
  }

  const userinfo = await userinfoRes.json();

  const user: SessionUser = {
    sub: userinfo.sub,
    email: userinfo.email,
    name: userinfo.given_name
      ? `${userinfo.given_name} ${userinfo.family_name || ''}`.trim()
      : userinfo.name || userinfo.email,
    picture: userinfo.picture,
  };

  const sessionJwt = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(SESSION_SECRET);

  return { user, sessionJwt, redirectTo: pkce.redirectTo };
}

export async function verifySessionJwt(jwt: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(jwt, SESSION_SECRET, {
      algorithms: ['HS256'],
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

export function buildLogoutUrl(): string {
  return `${IDP_URL}/auth/logout?client_id=${CLIENT_ID}&post_logout_redirect_uri=${encodeURIComponent(FRONTEND_URL)}`;
}
