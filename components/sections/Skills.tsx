"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import type { SkillGroup } from "@/types";

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <li>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span>{name}</span>
        <span className="text-ink-muted">{level}%</span>
      </div>
      <div
        role="meter"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} proficiency`}
        className="h-2 overflow-hidden rounded-full bg-edge"
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        />
      </div>
    </li>
  );
}

export function Skills({ skills }: { skills: SkillGroup[] }) {
  const { t } = useLanguage();
  return (
    <section id="skills" className="section-shell">
      <SectionHeading
        eyebrow="Skills"
        title="Tools I build with"
        description="From model training to production UIs, grouped by where they fit in the stack."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, gi) => (
          <motion.div
            key={group.group}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
          >
            <GlassCard className="h-full transition-all duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.01] hover:shadow-glow">
              <h3 className="mb-5 font-display text-lg font-semibold gradient-text">
                {t(group.group)}
              </h3>
              <ul className="space-y-4">
                {group.items.map((item, i) => (
                  <SkillBar key={item.name} name={item.name} level={item.level} delay={i * 0.05} />
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
