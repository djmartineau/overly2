export default function Head() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://overlymarketing.com";

  return (
    <>
      {/* Primary meta */}
      <title>Overly — Strategy and Design for Web and Social Media - Built to Convert</title>
      <meta
        name="description"
        content="Overly crafts strategy, design, and digital experiences built to convert — from brand identity to full-scale websites."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:title" content="Overly — Strategy and Design for Web, Social Media, and Ads - Built to Convert" />
      <meta
        property="og:description"
        content="A creative and digital marketing agency focused on clarity, conversion, and craft."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:site_name" content="Overly" />
      <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Overly — Strategy and Design for Web, Social Media, and Ads - Built to Convert" />
      <meta
        name="twitter:description"
        content="Creative strategy, branding, and web — built to convert."
      />
      <meta name="twitter:image" content={`${baseUrl}/og-image.jpg`} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Overly Marketing",
            "url": "https://overlymarketing.com",
            "logo": "https://overlymarketing.com/overly.svg",
            "sameAs": [
              "https://www.instagram.com/overlymarketing",
              "https://www.linkedin.com/company/overlymarketing",
              "https://www.facebook.com/overlymarketing"
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Overly Marketing",
            "url": "https://overlymarketing.com",
            "publisher": {
              "@type": "Organization",
              "name": "Overly Marketing",
              "logo": {
                "@type": "ImageObject",
                "url": "https://overlymarketing.com/overly.svg"
              }
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://overlymarketing.com/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />
    </>
  );
}