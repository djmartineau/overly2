import Section from "@/components/Section";

export default function ContactCTA() {
  return (
    <Section id="contact">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-fuchsia-500/10 to-transparent p-10 ring-1 ring-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_200px_at_80%_20%,rgba(99,102,241,.25),transparent)]" />
        <h3 className="text-2xl md:text-3xl font-bold">Let’s make something overly effective.</h3>
        <p className="mt-3 max-w-xl text-white/70">
          Tell us where you want to win. We’ll build the system that gets you there.
        </p>
        <a
          href="mailto:contact@overlymarketing.com"
          className="mt-6 inline-flex rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 transition"
        >
          Start a project
        </a>
      </div>
    </Section>
  );
}