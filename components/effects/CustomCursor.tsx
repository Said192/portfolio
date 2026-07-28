"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Modern cursor: a small dot glued to the pointer plus a larger
 * spring-lagged follower ring that grows over interactive elements.
 * Renders only on fine-pointer devices (never on touch) and honors
 * prefers-reduced-motion. The native cursor stays visible so
 * usability is never harmed.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const followerX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 });
  const followerY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      setHoveringInteractive(
        !!target?.closest("a, button, [role='button'], label, input, textarea, select")
      );
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* dot */}
      <motion.div
        aria-hidden="true"
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[80] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
      />
      {/* follower ring */}
      <motion.div
        aria-hidden="true"
        style={{ x: followerX, y: followerY }}
        animate={{
          scale: hoveringInteractive ? 2 : 1,
          opacity: hoveringInteractive ? 0.45 : 0.7,
        }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none fixed left-0 top-0 z-[80] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60"
      />
    </>
  );
}
