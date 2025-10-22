export default function Head() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://overly.vercel.app";

  return (
    <>
      {/* Primary meta */}
      <title>Overly — Strategy, Design & Web Built to Convert</title>
      <meta
        name="description"
        content="Overly crafts strategy, design, and digital experiences built to convert — from brand identity to full-scale websites."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:title" content="Overly — Strategy, Design & Web Built to Convert" />
      <meta
        property="og:description"
        content="A creative and digital agency focused on clarity, conversion, and craft."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:site_name" content="Overly" />
      <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Overly — Strategy, Design & Web Built to Convert" />
      <meta
        name="twitter:description"
        content="Creative strategy, branding, and web — built to convert."
      />
      <meta name="twitter:image" content={`${baseUrl}/og-image.jpg`} />
    </>
  );
}