"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import type { Education, Experience } from "@/types";

interface EducationSectionProps {
  education: Education[];
  experience: Experience[];
}

export function EducationSection({ education, experience }: EducationSectionProps) {
  const { t } = useLanguage();
  return (
    <section id="education" className="section-shell">
      <SectionHeading eyebrow="Education & experience" title="Where I learned the craft" />

      <div className="mx-auto max-w-3xl">
        <ol className="relative space-y-10 border-l-2 border-primary/20 pl-8">
          {education.map((e) => (
            <motion.li
              key={e.degree}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45 }}
              className="relative"
            >
              <span className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-glow">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
              </span>
              <GlassCard>
                <p className="font-accent text-sm text-primary">
                  {e.start} – {e.end}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">{t(e.degree)}</h3>
                <p className="text-sm text-ink-muted">{t(e.institution)}</p>
                <p className="mt-3 text-sm text-ink-muted">{t(e.details)}</p>
              </GlassCard>
            </motion.li>
          ))}

          {experience.map((e) => (
            <motion.li
              key={`${e.role}-${e.company}`}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative"
            >
              <span className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-glow">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
              </span>
              <GlassCard>
                <p className="font-accent text-sm text-primary">
                  {e.start} – {e.end}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">{t(e.role)}</h3>
                <p className="text-sm text-ink-muted">{e.company}</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-ink-muted">
                  {e.highlights.map((h) => (
                    <li key={h}>{t(h)}</li>
                  ))}
                </ul>
              </GlassCard>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
