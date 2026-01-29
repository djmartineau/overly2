"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Hero3 from "@/components/Hero3";
import Footer from "@/components/Footer";
import ProcessExperience from "@/components/ProcessExperience";
import ContactCTA from "@/components/ContactCTA";
import Capabilities from "@/components/Capabilities";
import ProcessSection from "@/components/ProcessSection";
import About from "@/components/About";
import PlatformsSection from "@/components/PlatformsSection";
import SocialDistributionSection from "@/components/SocialDistributionSection";

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
      {/* Hero section: stays at the top while the rest of the site scrolls over it */}
      <motion.section
        id="top"
        variants={itemVariants}
        transition={{ delay: 0.0 }}
        className="relative min-h-screen"
      >
        <div className="sticky top-0 h-screen">
          <Hero3 />
        </div>
      </motion.section>

      {/* Marquee temporarily disabled */}
      <motion.section id="about" variants={itemVariants} transition={{ delay: 0.4 }}>
        <About />
      </motion.section>
      <motion.section id="process" variants={itemVariants} transition={{ delay: 0.6 }}>
        <ProcessSection />
      </motion.section>
      <motion.section id="platforms" variants={itemVariants} transition={{ delay: 0.75 }}>
        <PlatformsSection />
      </motion.section>
      <motion.section id="capabilities" variants={itemVariants} transition={{ delay: 0.9 }}>
        <Capabilities />
      </motion.section>
      <motion.section id="social-network" variants={itemVariants} transition={{ delay: 1.05 }}>
        <SocialDistributionSection />
      </motion.section>
      <motion.section
        id="strategy"
        variants={itemVariants}
        transition={{ delay: 1.2 }}
        className="-mt-8"
      >
        <ProcessExperience />
      </motion.section>
      <motion.section id="contact" variants={itemVariants} transition={{ delay: 1.8 }}>
        <ContactCTA />
      </motion.section>
      <Footer />
    </motion.main>
  );
}