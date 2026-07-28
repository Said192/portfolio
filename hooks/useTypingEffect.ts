"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Cycles through phrases with a type / pause / delete rhythm. */
export function useTypingEffect(phrases: string[], typeMs = 70, pauseMs = 1600): string {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) {
      setText(phrases[index % phrases.length] ?? "");
      const timer = setTimeout(() => setIndex((i) => (i + 1) % phrases.length), pauseMs * 2);
      return () => clearTimeout(timer);
    }

    const current = phrases[index % phrases.length] ?? "";

    if (!deleting && text === current) {
      const timer = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(timer);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }

    const timer = setTimeout(
      () => setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)),
      deleting ? typeMs / 2 : typeMs
    );
    return () => clearTimeout(timer);
  }, [text, deleting, index, phrases, typeMs, pauseMs, reduce]);

  return text;
}
