import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://overlymarketing.com"),
  alternates: { canonical: "https://overlymarketing.com" },
  title: {
    default: "Overly Marketing | Built to Convert",
    template: "Overly Marketing | %s",
  },
  description:
    "Strategy, Social Media, Web, and Design — crafted to convert. Overly Marketing builds brands that perform and drive measurable growth.",
  keywords: [
    "Overly Marketing",
    "digital marketing agency",
    "creative automation",
    "brand strategy",
    "social media marketing",
    "web design and development",
    "conversion optimization",
    "content strategy",
    "AI marketing tools",
    "data-driven campaigns"
  ],
  openGraph: {
    title: "Overly Marketing | Built to Convert",
    description:
      "Strategy, Social Media, Web, and Design — crafted to convert. Overly Marketing builds brands that perform and drive measurable growth.",
    url: "https://overlymarketing.com",
    siteName: "Overly Marketing",
    images: [
      {
        url: "/og-image.jpg",
        width: 1119,
        height: 630,
        alt: "Overly Marketing — Strategy, Web, and Design built to convert.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Overly Marketing | Built to Convert",
    description:
      "Strategy, Social Media, Web, and Design — crafted to convert. Overly Marketing leverages AI to build brands that perform and drive measurable growth.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: "/apple-touch-icon.png",
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0b1220" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  themeColor: "#0b1220",
  manifest: "/manifest.json",
};