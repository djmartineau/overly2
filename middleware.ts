import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = process.env.SITE_COOKIE_NAME || "overly_access";
const COOKIE_VAL  = process.env.SITE_COOKIE_VALUE || "granted";

// Paths that anyone can visit
const PUBLIC_PATHS = new Set([
  "/coming-soon",
  "/api/auth",
  "/favicon.ico",
]);

export function middleware(req: NextRequest) {
  console.log("🧱 Middleware active on:", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;

  // Allow Next.js internals & static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/public") ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|webp|svg|mp4|webm|txt|json)$/)
  ) {
    return NextResponse.next();
  }

  // Allow any public path
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  // Check cookie
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  console.log("🧱 cookie:", cookie);
  if (cookie !== COOKIE_VAL) {
    const url = req.nextUrl.clone();
    url.pathname = "/coming-soon";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Optional: limit where middleware runs
export const config = {
  matcher: ["/:path*"], // run on all routes, safe since we skip static files inside
};