import { NextResponse } from "next/server";

/**
 * POST /api/auth
 * Expects a form POST with `password` (and optionally `next`).
 * If the password matches SITE_PASS, sets an HTTP-only cookie and redirects.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const pass = String(form.get("password") || "");
  const next = String(form.get("next") || "/");

  const expected = process.env.SITE_PASS || "";
  if (!expected) {
    return new NextResponse("Password not configured", { status: 500 });
  }
  if (pass !== expected) {
    // If you’d prefer to stay on the page with a query error, change to:
    // return NextResponse.redirect(new URL(`/coming-soon?err=1`, req.url));
    return new NextResponse("Invalid password", { status: 401 });
  }

  const cookieName = process.env.SITE_COOKIE_NAME || "overly_access";
  const cookieVal  = process.env.SITE_COOKIE_VALUE || "granted";

  // Redirect to the intended page if middleware sent ?next=...
  const redirectUrl = new URL(next || "/", req.url);

  const res = NextResponse.redirect(redirectUrl);
  // 12 hours; tweak as you like
  const maxAge = 60 * 60 * 12;

  res.headers.append(
    "Set-Cookie",
    `${cookieName}=${cookieVal}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; ${
      process.env.NODE_ENV === "development" ? "" : "Secure;"
    }`
  );

  return res;
}