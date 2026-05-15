import { jwtVerify, SignJWT } from 'jose';

import { BadRequestError } from '../lib/errors.js';
import { consumePkceSession, createPkceSession } from '../lib/oidc.js';

const IDP_URL = process.env.KLEIS_IDP_URL!;
const CLIENT_ID = process.env.KLEIS_CLIENT_ID!;
const CLIENT_SECRET = process.env.KLEIS_CLIENT_SECRET!;
const APP_URL = process.env.PUBLIC_APP_URL!;
const FRONTEND_URL = process.env.PUBLIC_FRONTEND_URL!;
const SESSION_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);
const SESSION_DURATION = 7 * 24 * 60 * 60;

export interface SessionUser {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

export function buildLogoutUrl(): string {
  return `${IDP_URL}/auth/logout?client_id=${CLIENT_ID}&post_logout_redirect_uri=${encodeURIComponent(FRONTEND_URL)}`;
}

export async function completeAuth(
  code: string,
  state: string,
): Promise<{ redirectTo: string; sessionJwt: string; user: SessionUser }> {
  const pkce = await consumePkceSession(state);
  if (!pkce) throw new BadRequestError('Invalid or expired state parameter');

  const tokenRes = await fetch(`${IDP_URL}/token`, {
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      code_verifier: pkce.codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: `${APP_URL}/api/auth/callback`,
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
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
    email: userinfo.email,
    name: userinfo.given_name
      ? `${userinfo.given_name} ${userinfo.family_name || ''}`.trim()
      : userinfo.name || userinfo.email,
    picture: userinfo.picture,
    sub: userinfo.sub,
  };

  const sessionJwt = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(SESSION_SECRET);

  return { redirectTo: pkce.redirectTo, sessionJwt, user };
}

export async function initiateLogin(
  redirectTo: string,
): Promise<{ authorizeUrl: string; state: string }> {
  const { codeChallenge, state } = await createPkceSession(redirectTo);
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    redirect_uri: `${APP_URL}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    state,
  });

  return { authorizeUrl: `${IDP_URL}/authorize?${params.toString()}`, state };
}

export async function verifySessionJwt(jwt: string): Promise<null | SessionUser> {
  try {
    const { payload } = await jwtVerify(jwt, SESSION_SECRET, {
      algorithms: ['HS256'],
    });
    return {
      email: payload.email as string,
      name: payload.name as string,
      picture: payload.picture as string | undefined,
      sub: payload.sub as string,
    };
  } catch {
    return null;
  }
}
