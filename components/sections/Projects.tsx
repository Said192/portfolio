"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import type { Project } from "@/types";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage();
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass group flex flex-col overflow-hidden rounded-2xl shadow-soft transition-all duration-300 will-change-transform hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-glow"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="focus-ring relative block aspect-[16/9] overflow-hidden"
        aria-label={`View details of ${project.title}`}
      >
        <Image
          src={project.cover}
          alt={`${project.title} cover`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-display text-xl font-semibold">
            <Link href={`/projects/${project.slug}`} className="focus-ring rounded hover:text-primary">
              {project.title}
            </Link>
          </h3>
          <p className="mt-1 font-accent text-sm text-primary">{t(project.tagline)}</p>
        </div>

        <p className="line-clamp-3 text-sm text-ink-muted">{t(project.description)}</p>

        <ul className="flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech.map((t, ti) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: 0.15 + ti * 0.05 }}
              className="transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Badge>{t}</Badge>
            </motion.li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-4 pt-2 text-sm font-medium transition-transform duration-300 group-hover:-translate-y-0.5">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded text-ink-muted transition hover:text-primary"
            >
              <Github className="h-4 w-4" aria-hidden="true" /> GitHub
            </a>
          ) : null}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded text-ink-muted transition hover:text-primary"
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> {t("Live Demo")}
            </a>
          ) : null}
          <Link
            href={`/projects/${project.slug}`}
            className="focus-ring ml-auto inline-flex items-center gap-1 rounded text-primary"
          >
            {t("Details")} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section-shell">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="AI products taken from idea to working software, each with its own detail page."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
