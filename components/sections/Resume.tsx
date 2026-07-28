"use client";

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import type { Profile } from "@/types";

export function Resume({ profile }: { profile: Profile }) {
  const { t } = useLanguage();
  return (
    <section id="resume" className="section-shell">
      <SectionHeading
        eyebrow="Resume"
        title="The one-pager"
        description="View it right here, or grab a copy to keep."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="glass mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-soft"
      >
        {/* Desktop: embedded PDF viewer. Mobile browsers can't render
            embedded PDFs, so phones get an open/download card instead. */}
        <iframe
          src={profile.resumeUrl}
          title={`${profile.name} resume`}
          className="hidden h-[70vh] w-full bg-white md:block"
        />
        <div className="flex flex-col items-center gap-6 px-6 py-12 text-center md:hidden">
          <FileText className="h-12 w-12 text-primary" aria-hidden="true" />
          <p className="text-sm text-ink-muted">
            {t("Tap below to view or save my resume as a PDF.")}
          </p>
          <ButtonLink href={profile.resumeUrl}>
            <FileText className="h-4 w-4" aria-hidden="true" /> {t("Open Resume")}
          </ButtonLink>
        </div>
        <div className="flex justify-center border-t border-edge p-5">
          <ButtonLink href={profile.resumeUrl} download>
            <Download className="h-4 w-4" aria-hidden="true" /> {t("Download Resume")}
          </ButtonLink>
        </div>
      </motion.div>
    </section>
  );
}
