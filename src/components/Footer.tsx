"use client";

import Link from "next/link";

const IG_URL = "https://instagram.com/overlymarketing";   // ← replace later
const FB_URL = "https://www.facebook.com/profile.php?id=61582904635184";       // ← replace later

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-black/60">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        {/* Top: brand + quick nav + social */}
        <div className="grid gap-8 md:grid-cols-3 md:items-start">
          {/* Brand block */}
          <div className="space-y-2">
            <p className="text-sm tracking-[0.25em] text-white/50">OVERLY MARKETING</p>
            <p className="text-white/70">
              Creative partners for brands that want to move.
            </p>
            <nav aria-label="Footer" className="mt-4 flex gap-6 text-sm">
              <Link href="#marquee" className="text-white/50 hover:text-white transition">Work</Link>
              <Link href="#capabilities" className="text-white/50 hover:text-white transition">Services</Link>
              <Link href="#about" className="text-white/50 hover:text-white transition">About</Link>
              <Link href="#contact" className="text-white/50 hover:text-white transition">Contact</Link>
            </nav>
          </div>

          {/* Empty middle column to balance layout */}
          <div className="hidden md:block" />

          {/* Social + email column */}
          <div className="flex flex-col items-start md:items-end gap-4 md:col-start-3">
            <div className="flex items-center gap-4">
              <SocialLink href={IG_URL} label="Instagram">
                {/* Instagram icon (inline, monochrome) */}
                <svg viewBox="0 0 24 24" className="h-5 w-5 transform -translate-y-[1px]" aria-hidden="true">
                  <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Zm4.75-.75a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5Z"/>
                </svg>
              </SocialLink>

              <SocialLink href={FB_URL} label="Facebook">
                {/* Facebook icon (inline, monochrome) */}
                <svg viewBox="0 0 24 24" className="h-5 w-5 transform -translate-y-[2px]" aria-hidden="true">
                  <path fill="currentColor" d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V12H8v3h2v7h3v-7h2.2l.8-3H13v-2.5c0-.28.22-.5.5-.5Z"/>
                </svg>
              </SocialLink>
            </div>

            <Link
              href="mailto:contact@overlymarketing.com"
              className="inline-flex items-center gap-2 text-white/70 text-sm hover:text-white hover:underline transition"
            >
              contact@overlymarketing.com
            </Link>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Overly Marketing Group. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 ring-1 ring-white/15 hover:text-white hover:ring-white/30 transition"
    >
      {children}
    </Link>
  );
}