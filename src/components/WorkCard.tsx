import Image from "next/image";
import Link from "next/link";

export default function WorkCard({
  title,
  summary,
  image,
  href,
}: {
  title: string;
  summary: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition shadow-sm"
      aria-label={title}
    >
      <div className="relative aspect-[16/10] bg-neutral-900">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority={false}
        />
        {/* subtle overlay on hover for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-4">
        <div className="font-semibold text-white">{title}</div>
        <p className="mt-1 text-sm text-white/70 line-clamp-2">{summary}</p>
      </div>
    </Link>
  );
}