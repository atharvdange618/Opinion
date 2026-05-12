import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || "opinion_session";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const APP_URL = process.env.PUBLIC_APP_URL || "http://localhost:3000";

const publicRoutes = ["/", "/poll", "/privacy", "/terms"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isStaticAsset = /\.[^/]+$/.test(pathname);

  if (isStaticAsset) return NextResponse.next();

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isPublic) return NextResponse.next();

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    const url = new URL(`${API_URL}/api/auth/login`);
    url.searchParams.set("redirect", `${APP_URL}${pathname}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
