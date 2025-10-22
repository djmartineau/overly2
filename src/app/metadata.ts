import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overly — Built to Convert",
  description: "Social Media, Web, and Design. Make your marketing OVERLY effective.",
  openGraph: {
    title: "Overly — Built to Convert",
    description: "Make your marketing OVERLY effective. Social Media, Web, and Design that drive results.",
    url: "https://overlymarketing.com",
    siteName: "Overly Marketing",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Overly Marketing— Built to Convert",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};