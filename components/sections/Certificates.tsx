"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ImagePlus, Loader2, Plus, X } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Certificate } from "@/types";

/**
 * Local-only certificate uploader. Next.js inlines NODE_ENV at build
 * time, so this button and form are removed from the production
 * bundle entirely; visitors never see them.
 */
function AddCertificateButton() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  if (process.env.NODE_ENV === "production") return null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/certificate", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        // certificates.json now includes the new entry; reload to show it.
        window.location.reload();
      } else {
        setError(json.error ?? "Upload failed.");
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const inputClasses =
    "focus-ring w-full rounded-xl border border-edge bg-surface/70 px-4 py-2.5 text-sm placeholder:text-ink-muted/70";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-canvas shadow-glow transition hover:-translate-y-0.5"
        title="Add a certificate (visible only while running locally)"
      >
        <Plus className="h-4 w-4" aria-hidden="true" /> Add certificate
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !busy && setOpen(false)}
            className="fixed inset-0 z-[65] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Add a new certificate"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-md rounded-2xl p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">New certificate</h3>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="focus-ring rounded-full p-1.5 text-ink-muted hover:text-ink"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label htmlFor="cert-title" className="mb-1.5 block text-sm font-medium">
                    Title
                  </label>
                  <input
                    id="cert-title"
                    name="title"
                    required
                    placeholder="e.g. Deep Learning Specialization"
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cert-issuer" className="mb-1.5 block text-sm font-medium">
                      Issuer
                    </label>
                    <input
                      id="cert-issuer"
                      name="issuer"
                      placeholder="e.g. Coursera"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="cert-date" className="mb-1.5 block text-sm font-medium">
                      Date
                    </label>
                    <input
                      id="cert-date"
                      name="date"
                      placeholder="e.g. May 2026"
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <span className="mb-1.5 block text-sm font-medium">Certificate image</span>
                  <label className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-edge px-4 py-6 text-sm text-ink-muted transition hover:border-primary hover:text-primary">
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />
                    {fileName ?? "Choose a JPG, PNG, or WebP (max 8 MB)"}
                    <input
                      type="file"
                      name="image"
                      required
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFileName(e.target.files?.[0]?.name ?? null)
                      }
                    />
                  </label>
                </div>

                {error ? (
                  <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={busy}
                  className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-canvas shadow-glow transition disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Uploading…
                    </>
                  ) : (
                    "Save certificate"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function Certificates({ certificates }: { certificates: Certificate[] }) {
  const [selected, setSelected] = useState<Certificate | null>(null);

  // Close the lightbox with Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="certificates" className="section-shell">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading eyebrow="Certificates" title="Proof of learning" />
        <AddCertificateButton />
      </div>

      {certificates.length === 0 ? (
        <GlassCard className="mx-auto max-w-xl py-14 text-center">
          <Award className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
          <h3 className="mt-4 font-display text-lg font-semibold">Certificates coming soon</h3>
          <p className="mt-2 text-sm text-ink-muted">
            New certifications are on the way. Add entries to{" "}
            <code className="rounded bg-edge/60 px-1.5 py-0.5 text-xs">config/certificates.json</code>{" "}
            and they&apos;ll appear here automatically.
          </p>
        </GlassCard>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <motion.li
              key={cert.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <button
                onClick={() => setSelected(cert)}
                className="focus-ring glass group block w-full overflow-hidden rounded-2xl text-left shadow-soft transition hover:-translate-y-1"
                aria-label={`Preview certificate: ${cert.title}`}
              >
                <div className="relative aspect-[4/3] bg-white">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold">{cert.title}</h3>
                  <p className="text-sm text-ink-muted">
                    {[cert.issuer, cert.date].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[65] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`Certificate preview: ${selected.title}`}
          >
            <motion.div
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close preview"
                className="focus-ring absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="relative aspect-[4/3]">
                <Image src={selected.image} alt={selected.title} fill className="object-contain p-3" />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
