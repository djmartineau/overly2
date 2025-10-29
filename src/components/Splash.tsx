'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPIN_DURATION = 3_000; // ms
const SLIDE_DURATION = 800; // ms

export default function Splash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setLeaving(true), SPIN_DURATION);
    const finish = setTimeout(() => onDone(), SPIN_DURATION + SLIDE_DURATION + 100);
    return () => {
      clearTimeout(delay);
      clearTimeout(finish);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[20000] grid place-items-center bg-black relative"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 1,
            y: '-100%',
            transition: { duration: SLIDE_DURATION / 1000, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <div className="relative h-20 w-20 rounded-full bg-white grid place-items-center overflow-hidden">
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