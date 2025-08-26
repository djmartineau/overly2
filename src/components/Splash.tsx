'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  show: boolean;
  onDone: () => void;
};

// Tunables
const SPIN_DURATION = 3000; // ms total for two spins
const SLIDE_DURATION = 800; // ms for the slide-up curtain reveal

export default function Splash({ show, onDone }: Props) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!show) return;
    setClosing(false);

    // After the spin completes, start sliding the whole overlay up
    const t1 = setTimeout(() => setClosing(true), SPIN_DURATION);
    // After the slide completes, signal completion
    const t2 = setTimeout(() => onDone(), SPIN_DURATION + SLIDE_DURATION + 20);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[1000] grid place-items-center pointer-events-none"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: SLIDE_DURATION / 1000, ease: [0.22, 1, 0.36, 1] } }}
          // When we trigger closing, drive the exit animation by switching key
          key={closing ? 'closing' : 'open'}
        >
          {/* Black curtain background */}
          <div className="absolute inset-0 bg-black" />

          {/* Center spinning disc (two full rotations) */}
          <div className="relative z-10 h-20 w-20 rounded-full bg-white overflow-hidden grid place-items-center">
            <motion.img
              src="/Overly.svg"
              alt="Overly"
              className="h-full w-full object-contain select-none"
              draggable={false}
              initial={{ rotate: 0 }}
              animate={{ rotate: 720 }}
              transition={{ duration: SPIN_DURATION / 1000, ease: 'linear' }}
            />
          </div>

          {/* Bottom progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-neutral-800/60">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: SPIN_DURATION / 1000, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}