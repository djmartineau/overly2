"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import CookieBanner from "@/components/CookieBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MetaPixel from "@/components/MetaPixel";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { metadata as appMetadata } from "./metadata";

const MusicPlayer  = dynamic(() => import("@/components/MusicPlayer"),  { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  const resolvedTitle =
    typeof appMetadata.title === "string"
      ? appMetadata.title
      : "Overly Marketing Group | Marketing Built to Convert";

  const handleSkipToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        {/* Basic SEO */}
        <title>
          {resolvedTitle}
        </title>
        <meta name="robots" content="index, follow" />
        <meta
          name="description"
          content={
            appMetadata.description ??
            "Strategy and design for web, social media, and ads - built to convert"
          }
        />
        <link rel="canonical" href="https://overlymarketing.com" />

        {/* Structured data for richer search results */}
        <script
          type="application/ld+json"
          // Using dangerouslySetInnerHTML so this renders as raw JSON for crawlers
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Overly Marketing",
              url: "https://overlymarketing.com",
              logo: "https://overlymarketing.com/Overly.svg",
              description:
                "Social Media, Web, and Design services focused on performance and conversion.",
            }),
          }}
        />
        <link rel="preload" as="image" href="/Overly.svg" />
        <link
          rel="preload"
          as="font"
          href="/_next/static/media/geist-sans-latin-var.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <meta name="apple-mobile-web-app-title" content="Overly Marketing" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Recommended favicon links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {/* Optional: Safari pinned tab */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0b0f19" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-100 min-h-screen relative`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TV8NMW4G"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TV8NMW4G');`}
        </Script>
        {/* End Google Tag Manager */}
        <a
          href="#contact"
          onClick={handleSkipToContact}
          suppressHydrationWarning
          className="sr-only focus:not-sr-only absolute top-4 left-4 z-[10000] rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Skip to contact
        </a>
        {/* SVG filters for liquid glass effects (available globally) */}
        <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
          {/* Stronger liquid glass (blur + turbulence + displacement) */}
          <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="3" seed="3" result="noise" />
            <feDisplacementMap in="blur" in2="noise" scale="32" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Wavy displacement (more pronounced ripple) */}
          <filter id="wavy" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="4" seed="7" result="turb" />
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="40" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Glass ripple (specular highlights for curved glass feel) */}
          <filter id="glass-ripple" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="gb" />
            <feSpecularLighting in="gb" surfaceScale="6" specularConstant="1" specularExponent="20" lightingColor="#ffffff" result="spec">
              <fePointLight x="-4000" y="-8000" z="20000" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" operator="in" result="lit" />
            <feBlend in="SourceGraphic" in2="lit" mode="screen" />
          </filter>
        </svg>

        <Header />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          className="will-change-transform"
        >
          {children}
        </motion.div>
        <MusicPlayer />

        <CookieBanner />

        <style jsx global>{`
          @keyframes splash-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(720deg); }
          }
        `}</style>

        {/* Analytics / performance */}
        <MetaPixel />
        <SpeedInsights />
      </body>
    </html>
  );
}