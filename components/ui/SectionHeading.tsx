"use client";

import { motion } from "framer-motion";

import { useLanguage } from "@/lib/i18n";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-14 max-w-2xl"
    >
      <p className="mb-3 font-accent text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        {t(eyebrow)}
      </p>
      <h2 className="font-display text-3xl font-bold sm:text-4xl">{t(title)}</h2>
      {description ? <p className="mt-4 text-ink-muted">{t(description)}</p> : null}
    </motion.div>
  );
}
