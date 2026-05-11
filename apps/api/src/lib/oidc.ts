import crypto from "crypto";

interface PkceSession {
  codeVerifier: string;
  redirectTo: string;
  expiresAt: number;
}

const sessions = new Map<string, PkceSession>();

setInterval(() => {
  const now = Date.now();
  for (const [key, s] of sessions) {
    if (s.expiresAt < now) sessions.delete(key);
  }
}, 10 * 60 * 1000);

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

export function generateState(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function createPkceSession(
  redirectTo: string,
): { state: string; codeVerifier: string; codeChallenge: string } {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();

  sessions.set(state, {
    codeVerifier,
    redirectTo,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  return { state, codeVerifier, codeChallenge };
}

export function consumePkceSession(
  state: string,
): { codeVerifier: string; redirectTo: string } | null {
  const session = sessions.get(state);
  if (!session) return null;
  sessions.delete(state);
  return { codeVerifier: session.codeVerifier, redirectTo: session.redirectTo };
}
