"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Camera, ChevronDown, FileText, Loader2 } from "lucide-react";

import { ParticlesBackground } from "@/components/effects/ParticlesBackground";
import { SocialIcons } from "@/components/layout/SocialIcons";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useLanguage } from "@/lib/i18n";
import type { Profile } from "@/types";

/**
 * Bold statement hero: role badge, accent headline, intro, two CTAs,
 * and the photo rising out of a glowing circle.
 *
 * A small camera button sits on the photo while running locally
 * (npm run dev) so you can change your picture anytime; visitors on
 * the live site never see it. For the photo to overflow the circle
 * like the reference design, upload a transparent-background PNG
 * (remove.bg makes one in seconds).
 */

/** Local-only picture changer. Hidden automatically in production. */
function PhotoUploadButton() {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  // Next.js inlines NODE_ENV at build time, so this whole button
  // disappears from the production bundle.
  if (process.env.NODE_ENV === "production") return null;

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setNote(null);
    const form = new FormData();
    form.append("avatar", file);

    try {
      const res = await fetch("/api/admin/avatar", { method: "POST", body: form });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        // profile.json now points at the new image; reload to show it.
        window.location.reload();
      } else {
        setNote(json.error ?? "Upload failed.");
      }
    } catch {
      setNote("Upload failed. Please try again.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-2">
      {note ? (
        <p className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white shadow-soft">{note}</p>
      ) : null}
      <label
        className="focus-ring flex cursor-pointer items-center gap-2 rounded-full bg-surface/90 px-4 py-2.5 text-xs font-semibold text-ink shadow-soft backdrop-blur transition hover:text-primary"
        title="Change profile picture (visible only while running locally)"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Camera className="h-4 w-4" aria-hidden="true" />
        )}
        {busy ? "Uploading…" : "Change photo"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onPick}
          className="sr-only"
          aria-label="Upload a new profile picture"
        />
      </label>
    </div>
  );
}

export function Hero({ profile }: { profile: Profile }) {
  const typed = useTypingEffect(profile.titles);
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-canvas"
    >
      {/* Ambient accent glow + particle field */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(55%_45%_at_80%_20%,rgb(var(--color-primary)/0.12),transparent),radial-gradient(45%_40%_at_10%_85%,rgb(var(--color-accent)/0.08),transparent)]"
      />
      <ParticlesBackground />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-28 sm:px-8 lg:gap-14 lg:pt-32 lg:grid-cols-[1.05fr,0.95fr]">
        {/* ── Left: copy, staggered entrance ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.14, delayChildren: 0.9 } },
          }}
        >
          <motion.span
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-canvas"
          >
            {typed || profile.titles[0]}
          </motion.span>

          <motion.h1
            variants={{ hidden: { opacity: 0, x: -36 }, show: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-3xl font-bold leading-tight sm:text-5xl"
          >
            I design, build, and ship intelligent software{" "}
            <span className="gradient-text">end-to-end</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.7 }}
            className="mt-6 max-w-xl leading-relaxed text-ink-muted"
          >
            {/* This text comes straight from config/profile.json → "intro".
                Edit it there (or in /dashboard → Profile) to change it. */}
            {t(profile.intro)}
          </motion.p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <motion.a
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              href="#projects"
              className="focus-ring inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-canvas shadow-glow transition hover:-translate-y-0.5 hover:opacity-90 active:scale-95"
            >
              <FileText className="h-4 w-4" aria-hidden="true" /> {t("View My Portfolio")}
            </motion.a>
            <motion.a
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              href={profile.resumeUrl}
              download
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-ink-muted/50 px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-primary hover:text-primary active:scale-95"
            >
              <Briefcase className="h-4 w-4" aria-hidden="true" /> {t("Download Resume")}
            </motion.a>
          </div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <SocialIcons />
          </motion.div>
        </motion.div>

        {/* ── Right: floating round frame, rotating gradient ring ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto order-first lg:order-none"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* soft glow behind the frame */}
            <div
              aria-hidden="true"
              className="absolute -inset-8 rounded-full bg-gradient-to-tr from-primary/30 to-accent/25 blur-2xl"
            />
            {/* rotating animated gradient border */}
            <motion.div
              aria-hidden="true"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1.5 rounded-full bg-[conic-gradient(from_0deg,rgb(var(--color-primary)),transparent_30%,rgb(var(--color-accent)),transparent_70%,rgb(var(--color-primary)))]"
            />
            {/* rotating dashed decorative ring */}
            <motion.div
              aria-hidden="true"
              animate={reduce ? undefined : { rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 rounded-full border border-dashed border-primary/30"
            />
            {/* orbiting accent dots */}
            <motion.div
              aria-hidden="true"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6"
            >
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-glow" />
              <span className="absolute bottom-6 right-3 h-1.5 w-1.5 rounded-full bg-accent" />
            </motion.div>
            {/* round frame */}
            <div className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-canvas shadow-glow sm:h-64 sm:w-64 lg:h-80 lg:w-80 xl:h-96 xl:w-96">
              <Image
                src={profile.avatar}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(max-width: 1280px) 320px, 384px"
                priority
                className="object-cover"
              />
            </div>
          </motion.div>
          <PhotoUploadButton />
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="focus-ring absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full p-2 text-ink-muted transition hover:text-primary motion-safe:animate-bounce"
      >
        <ChevronDown className="h-6 w-6" aria-hidden="true" />
      </a>
    </section>
  );
}
