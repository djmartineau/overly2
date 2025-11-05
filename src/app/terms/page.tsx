export const metadata = {
  title: "Terms of Service | Overly Marketing",
  description:
    "The terms and conditions for using Overly Marketing's website and engaging our services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-24">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Terms of Service</h1>

      <p className="text-neutral-400 max-w-3xl mb-4">
        Welcome to Overly Marketing. By using this website, you agree to comply with and be bound by
        the following terms and conditions. If you disagree with any part of these terms, please do
        not use our website.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-2">1. Use of Site</h2>
      <p className="text-neutral-400 max-w-3xl mb-4">
        This site and its content are owned by Overly Marketing. You may not copy, reproduce, or
        redistribute any materials without permission.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-2">2. Services</h2>
      <p className="text-neutral-400 max-w-3xl mb-4">
        All services provided are subject to separate agreements or contracts. Prices, timelines,
        and deliverables may vary depending on project scope.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-2">3. Limitation of Liability</h2>
      <p className="text-neutral-400 max-w-3xl mb-4">
        Overly Marketing will not be liable for any indirect, incidental, or consequential damages
        arising from the use of our website or services.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-2">4. Updates</h2>
      <p className="text-neutral-400 max-w-3xl mb-4">
        We may update these terms occasionally. By continuing to use this site, you agree to the
        updated terms as they are published.
      </p>

      <p className="text-neutral-500 mt-10 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}