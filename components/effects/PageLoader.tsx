"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Branded first-paint loader: initials + a thin progress sweep,
 * then a smooth fade into the page. Never blocks content for long,
 * and collapses to a quick fade when reduced motion is preferred.
 */
export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), reduce ? 250 : 1100);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-canvas"
          aria-hidden="true"
        >
          <motion.p
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-display text-4xl font-bold tracking-wide gradient-text"
          >
            SWK
          </motion.p>
          <div className="h-0.5 w-40 overflow-hidden rounded-full bg-edge">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: reduce ? 0.1 : 0.9, ease: [0.4, 0, 0.2, 1] }}
              className="h-full w-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
