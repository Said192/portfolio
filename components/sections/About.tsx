"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, FolderGit2, GraduationCap } from "lucide-react";

import { Counter } from "@/components/effects/Counter";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import type { Education, Experience, Profile } from "@/types";

interface AboutProps {
  profile: Profile;
  education: Education[];
  experience: Experience[];
}

export function About({ profile, education, experience }: AboutProps) {
  const { t } = useLanguage();
  // Vertical journey timeline: Education → Internship → Projects → Achievements
  const timeline = [
    ...education.map((e) => ({
      icon: GraduationCap,
      title: e.degree,
      subtitle: `${e.institution} · ${e.start} – ${e.end}`,
      body: e.details,
    })),
    ...experience.map((e) => ({
      icon: Briefcase,
      title: `${e.role} at ${e.company}`,
      subtitle: `${e.start} – ${e.end}`,
      body: e.highlights.map((h) => h).join(" "),
    })),
    {
      icon: FolderGit2,
      title: "Projects",
      subtitle: "Agentic AI · RAG · Computer Vision",
      body: "Shipped end-to-end AI products including JobPilot, XJMU AI Consultant, and AI Species Explorer.",
    },
    {
      icon: Award,
      title: "Achievements",
      subtitle: "Continuous learning",
      body: "Trained and evaluated ML/DL models on real project work and keep expanding into generative and agentic AI.",
    },
  ];

  return (
    <section id="about" className="section-shell">
      <SectionHeading eyebrow="About me" title="Engineering intelligence, end to end" />

      <div className="grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          <p className="text-ink-muted">{t(profile.bio)}</p>
          <p className="text-ink-muted">{t(profile.objectives)}</p>

          <ul className="flex flex-wrap gap-2 pt-1" aria-label="Interests">
            {profile.interests.map((interest) => (
              <li
                key={interest}
                className="glass rounded-full px-4 py-1.5 text-sm text-ink-muted"
              >
                {t(interest)}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {profile.stats.map((stat) => (
              <GlassCard key={stat.label} className="text-center">
                <Counter value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-sm text-ink-muted">{t(stat.label)}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        <ol className="relative space-y-8 border-l-2 border-primary/20 pl-8" aria-label="Journey">
          {timeline.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative"
            >
              <span className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-glow">
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <GlassCard>
                <h3 className="font-display font-semibold">{t(item.title)}</h3>
                <p className="mt-1 font-accent text-sm text-primary">{t(item.subtitle)}</p>
                <p className="mt-2 text-sm text-ink-muted">{t(item.body)}</p>
              </GlassCard>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
