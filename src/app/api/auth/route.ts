import { NextResponse } from "next/server";

// Pull secrets / config from env
const SITE_PASS = process.env.SITE_PASS || "supersecret123";
const COOKIE_NAME = process.env.SITE_COOKIE_NAME || "overly_access";
const COOKIE_VALUE = process.env.SITE_COOKIE_VALUE || "granted";

/**
 * Handle POST /api/auth
 * Form fields:
 *   password = string
 *   (optionally later: next = "/whatever")
 */
export async function POST(req: Request) {
  try {
    // Read form data from the request
    const formData = await req.formData();
    const password = formData.get("password")?.toString() || "";
    // Optional redirect target after success — not required yet, but future-proof
    const nextParam = formData.get("next")?.toString() || "/";

    // Hard fail if we don't even have a configured SITE_PASS
    if (!SITE_PASS) {
      // If there's no configured password, just bail to coming-soon with err
      return NextResponse.redirect(
        new URL("/coming-soon?err=1", req.url),
        302
      );
    }

    // If password doesn't match: bounce back with ?err=1 so UI can show error
    if (password !== SITE_PASS) {
      return NextResponse.redirect(
        new URL("/coming-soon?err=1", req.url),
        302
      );
    }

    // ✅ Auth OK: set cookie so middleware will let them through
    const res = NextResponse.redirect(new URL(nextParam || "/", req.url), 302);

    res.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      secure: true, // good for prod over https
      path: "/",
      // You can add maxAge if you want persistent auth (in seconds)
      // maxAge: 60 * 60 * 24, // 1 day
    });

        return res;
    } catch {
    // Generic fallback on any unexpected error
    return NextResponse.redirect(new URL("/coming-soon?err=1", req.url), 302);
  }
}