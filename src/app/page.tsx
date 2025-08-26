"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorkCard from "@/components/WorkCard";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Marquee from "@/components/Marquee";
import ProcessExperience from "@/components/ProcessExperience";
import CaseStudyScroller from "@/components/CaseStudyScroller";
import ContactCTA from "@/components/ContactCTA";
import Capabilities from "@/components/Capabilities";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header />
      <section id="top">
        <Hero />
      </section>
      <section id="process">
        <Marquee />
      </section>
      <section id="work">
        <ProcessExperience />
      </section>
      <section id="services">
        <Capabilities />
      </section>
      <section id="about">
        <CaseStudyScroller />
        <Testimonials />
      </section>
      <section id="contact">
        <ContactCTA />
      </section>
      <section className="py-12">
        <Container>
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold text-white">Recent work</h2>
            <a
              href="/work"
              className="text-sm text-neutral-400 hover:text-blue-400 transition"
            >
              View all
            </a>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <WorkCard
              title="Overly Sports"
              summary="Brand system + site + social engine. 1.2M monthly reach."
              image="/globe.svg"
              href="/work/overly-sports"
            />
            <WorkCard
              title="MAC Sports"
              summary="Identity + landing page focused on speed & mindset."
              image="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop"
              href="/work/mac-sports"
            />
          </div>
        </Container>
      </section>
      <Footer />
    </main>
  );
}