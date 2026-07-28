import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Github } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { getProject, projects } from "@/lib/config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: [{ url: project.cover }],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="section-shell pt-36">
      <Link
        href="/#projects"
        className="focus-ring inline-flex items-center gap-2 rounded text-sm text-ink-muted transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to all projects
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr,0.85fr]">
        <div>
          <p className="font-accent text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Project
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold">{project.title}</h1>
          <p className="mt-2 font-accent text-lg text-ink-muted">{project.tagline}</p>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl shadow-soft">
            <Image
              src={project.cover}
              alt={`${project.title} cover`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          </div>

          <h2 className="mt-10 font-display text-xl font-semibold">Overview</h2>
          <p className="mt-3 leading-relaxed text-ink-muted">{project.description}</p>

          <h2 className="mt-10 font-display text-xl font-semibold">Key features</h2>
          <ul className="mt-4 space-y-3">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-ink-muted">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Case study — rendered only when the project defines one in
              config/projects.json → caseStudy */}
          {project.caseStudy ? (
            <div className="mt-14 space-y-10 border-t border-edge pt-10">
              <p className="font-accent text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Case study
              </p>

              <div>
                <h2 className="font-display text-xl font-semibold">The problem</h2>
                <p className="mt-3 leading-relaxed text-ink-muted">{project.caseStudy.problem}</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold">The approach</h2>
                <p className="mt-3 leading-relaxed text-ink-muted">{project.caseStudy.approach}</p>
              </div>

              {project.caseStudy.architectureImage ? (
                <div>
                  <h2 className="font-display text-xl font-semibold">Architecture</h2>
                  <div className="relative mt-4 aspect-[1200/560] overflow-hidden rounded-2xl border border-edge shadow-soft">
                    <Image
                      src={project.caseStudy.architectureImage}
                      alt={`${project.title} architecture diagram`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <h2 className="font-display text-xl font-semibold">Results</h2>
                <ul className="mt-4 space-y-3">
                  {project.caseStudy.results.map((result) => (
                    <li key={result} className="flex items-start gap-3 text-ink-muted">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6 lg:pt-24">
          <GlassCard>
            <h2 className="font-display font-semibold">Technology</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t}>
                  <Badge>{t}</Badge>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="space-y-3">
            <h2 className="font-display font-semibold">Links</h2>
            {project.github ? (
              <ButtonLink href={project.github} variant="ghost" className="w-full">
                <Github className="h-4 w-4" aria-hidden="true" /> View on GitHub
              </ButtonLink>
            ) : null}
            {project.demo ? (
              <ButtonLink href={project.demo} className="w-full">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> Live Demo
              </ButtonLink>
            ) : (
              <p className="text-center text-xs text-ink-muted">
                Live demo coming soon. Add the URL in config/projects.json.
              </p>
            )}
          </GlassCard>
        </aside>
      </div>
    </main>
  );
}
