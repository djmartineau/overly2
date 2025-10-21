"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Hero3 from "@/components/Hero3";
import WorkCard from "@/components/WorkCard";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Marquee from "@/components/Marquee";
import ProcessExperience from "@/components/ProcessExperience";
import CaseStudyScroller from "@/components/CaseStudyScroller";
import ContactCTA from "@/components/ContactCTA";
import Capabilities from "@/components/Capabilities";
import Testimonials from "@/components/Testimonials";
import ProcessSection from "@/components/ProcessSection";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0 } },
};


export default function Home() {
  return (
    <motion.main
      className="min-h-screen bg-neutral-950 text-neutral-100"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.section id="top" variants={itemVariants} transition={{ delay: 0.0 }}>
        <Hero3 />
      </motion.section>
      <motion.section id="marquee" variants={itemVariants} transition={{ delay: 0.4 }}>
        <Marquee />
      </motion.section>
      <motion.section id="process" variants={itemVariants} transition={{ delay: 0.6 }}>
        <ProcessSection />
      </motion.section>
      <motion.section id="strategy" variants={itemVariants} transition={{ delay: 0.9 }}>
        <ProcessExperience />
      </motion.section>
      <motion.section id="services" variants={itemVariants} transition={{ delay: 1.2 }}>
        <Capabilities />
      </motion.section>
      <motion.section id="about" variants={itemVariants} transition={{ delay: 1.5 }}>
        <CaseStudyScroller />
        <Testimonials />
      </motion.section>
      <motion.section id="contact" variants={itemVariants} transition={{ delay: 1.8 }}>
        <ContactCTA />
      </motion.section>
      <motion.section className="py-12" variants={itemVariants} transition={{ delay: 2.1 }}>
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
      </motion.section>
      <Footer />
    </motion.main>
  );
}