import Section from "@/components/Section";
import SlideOver from "@/components/SlideOver";
import ContactForm from "@/components/ContactForm";
import { useState } from "react";

export default function ContactCTA() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <Section id="contact">
      <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl p-10 ring-1 ring-white/10 border border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(90,110,255,0.12),rgba(150,90,255,0.10),rgba(0,0,0,0))] opacity-70" />
        <h3 className="text-2xl md:text-3xl font-bold">Let’s make something overly effective.</h3>
        <p className="mt-3 max-w-xl text-white/70">
          Tell us where you want to win. We’ll build the system that gets you there.
        </p>
        <button
          onClick={() => setContactOpen(true)}
          className="mt-6 inline-flex rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 transition"
        >
          Start a project
        </button>
      </div>

      <SlideOver open={contactOpen} onClose={() => setContactOpen(false)} title="Start a project">
        <ContactForm />
      </SlideOver>
    </Section>
  );
}