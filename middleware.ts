import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = process.env.SITE_COOKIE_NAME || "overly_access";
const COOKIE_VAL  = process.env.SITE_COOKIE_VALUE || "granted";

// Paths that anyone can visit
const PUBLIC_PATHS = new Set([
  "/coming-soon",
  "/api/auth",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next.js internals & any file-like request (assets with a dot)
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Allow any public path
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  // Check cookie
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
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
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|coming-soon|api/auth).*)",
  ],
};