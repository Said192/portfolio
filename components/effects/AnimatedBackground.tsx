"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Very subtle ambient background: three large blurred accent orbs
 * drifting on slow loops. transform/opacity only (GPU-friendly),
 * static when reduced motion is preferred.
 */
export function AnimatedBackground() {
  const reduce = useReducedMotion();

  const orbs = [
    {
      className:
        "left-[-10%] top-[-10%] h-[36rem] w-[36rem] bg-primary/10",
      animate: { x: [0, 60, 0], y: [0, 40, 0] },
      duration: 26,
    },
    {
      className:
        "right-[-12%] top-[30%] h-[30rem] w-[30rem] bg-accent/10",
      animate: { x: [0, -50, 0], y: [0, 60, 0] },
      duration: 32,
    },
    {
      className:
        "bottom-[-14%] left-[25%] h-[32rem] w-[32rem] bg-primary/[0.07]",
      animate: { x: [0, 40, 0], y: [0, -50, 0] },
      duration: 38,
    },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={reduce ? undefined : orb.animate}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute rounded-full blur-3xl ${orb.className}`}
        />
      ))}
    </div>
  );
}
