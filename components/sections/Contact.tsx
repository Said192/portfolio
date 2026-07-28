"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, MapPin, Phone, XCircle } from "lucide-react";

import { SocialIcons } from "@/components/layout/SocialIcons";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/types";

type Toast = { kind: "success" | "error"; text: string } | null;

const inputClasses =
  "focus-ring w-full rounded-xl border border-edge bg-surface/70 px-4 py-3 text-sm placeholder:text-ink-muted/70 transition-all duration-300 focus:-translate-y-0.5 focus:border-primary/60 focus:shadow-glow";

export function Contact({ profile }: { profile: Profile }) {
  const { t } = useLanguage();
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setSending(true);
    setToast(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (json.ok) {
        setToast({ kind: "success", text: "Message sent! I'll get back to you soon." });
        form.reset();
      } else {
        setToast({ kind: "error", text: json.error ?? "Couldn't send your message." });
      }
    } catch {
      setToast({ kind: "error", text: "Network error. Please try again." });
    } finally {
      setSending(false);
      setTimeout(() => setToast(null), 6000);
    }
  }

  return (
    <section id="contact" className="section-shell">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something"
        description="Have a project, an internship lead, or just a question about AI? My inbox is open."
      />

      <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-6">
          <GlassCard>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href={`mailto:${profile.email}`} className="focus-ring rounded hover:text-primary">
                  {profile.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="focus-ring rounded hover:text-primary">
                  {profile.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{profile.location}</span>
              </li>
            </ul>
            <div className="mt-6">
              <SocialIcons />
            </div>
          </GlassCard>

          {/* Map placeholder — swap the src for a Google Maps embed URL. */}
          <div className="glass flex aspect-[16/10] items-center justify-center rounded-2xl">
            <div className="text-center text-sm text-ink-muted">
              <MapPin className="mx-auto mb-2 h-6 w-6 text-primary" aria-hidden="true" />
              <p>{profile.location}</p>
              <p className="mt-1 text-xs">Map embed placeholder</p>
            </div>
          </div>
        </div>

        <GlassCard>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  {t("Name")}
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  placeholder="Your name"
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  {t("Email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
                {t("Subject")}
              </label>
              <input
                id="subject"
                name="subject"
                required
                minLength={3}
                placeholder="What's this about?"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                {t("Message")}
              </label>
              <textarea
                id="message"
                name="message"
                required
                minLength={10}
                rows={5}
                placeholder="Tell me about your project…"
                className={inputClasses}
              />
            </div>

            <Button type="submit" disabled={sending} className="w-full disabled:opacity-60">
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
                </>
              ) : (
                t("Send message")
              )}
            </Button>
          </form>

          <div aria-live="polite">
            <AnimatePresence>
              {toast ? (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                    toast.kind === "success"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}
                >
                  {toast.kind === "success" ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                  )}
                  {toast.text}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
