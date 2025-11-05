export const metadata = {
  title: "Privacy Policy | Overly Marketing",
  description:
    "Learn how Overly Marketing collects, uses, and protects your information. We respect your privacy and only use data to improve your experience.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Privacy Policy</h1>

      <p className="text-neutral-400 max-w-3xl mb-4">
        At Overly Marketing, we value your privacy. This policy explains how we collect and use your
        personal information when you visit our website or engage with our services.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-2">1. Information We Collect</h2>
      <p className="text-neutral-400 max-w-3xl mb-4">
        We may collect information that you provide directly—such as your name, email, or business
        details—when you fill out a contact form or request a proposal. We may also collect
        anonymous data to understand how our site is used.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-2">2. How We Use Your Information</h2>
      <p className="text-neutral-400 max-w-3xl mb-4">
        We use collected data to improve our website, communicate with clients, and deliver
        marketing or design services. We never sell personal information to third parties.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-2">3. Cookies</h2>
      <p className="text-neutral-400 max-w-3xl mb-4">
        Our website uses cookies for basic functionality and analytics. You can disable cookies in
        your browser settings at any time.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-2">4. Contact</h2>
      <p className="text-neutral-400 max-w-3xl mb-4">
        If you have questions about this Privacy Policy, please contact us at{" "}
        <a href="mailto:contact@overlymarketing.com" className="text-blue-400 underline">
          contact@overlymarketing.com
        </a>
        .
      </p>

      <p className="text-neutral-500 mt-10 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}