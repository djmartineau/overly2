export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/40 py-8 text-sm text-neutral-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Overly</span>
        <a href="mailto:contact@overlymarketing.com" className="hover:text-black transition">contact@overlymarketing.com</a>
      </div>
    </footer>
  );
}
