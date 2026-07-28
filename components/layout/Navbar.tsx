"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

import { useActiveSection } from "@/hooks/useActiveSection";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "resume", label: "Resume" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.id);

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: theme is only known on the client.
  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="focus-ring glass rounded-full p-2.5 text-ink transition hover:text-primary"
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

export function Navbar() {
  const active = useActiveSection([...SECTION_IDS]);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { lang, setLang, t } = useLanguage();

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        aria-label="Primary"
        className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 shadow-soft"
      >
        <Link href="#home" className="focus-ring rounded font-display text-lg font-bold">
          <span className="gradient-text">Said</span> Wali Khan
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <li key={s.id} className="relative">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "focus-ring group relative z-10 block rounded-full px-3.5 py-2 text-sm transition",
                  active === s.id ? "font-medium text-primary" : "text-ink-muted hover:text-ink"
                )}
              >
                {t(s.label)}
                {/* animated hover underline */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100"
                />
              </a>
              {/* sliding active indicator */}
              {active === s.id ? (
                <motion.span
                  layoutId="nav-active"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-primary/10"
                />
              ) : null}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
            className="focus-ring glass rounded-full px-3 py-2 text-xs font-semibold text-ink transition hover:text-primary"
          >
            {lang === "en" ? "عربي" : "EN"}
          </button>
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="focus-ring glass rounded-full p-2.5 lg:hidden"
          >
            {open ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-auto mt-2 max-w-6xl space-y-1 rounded-2xl p-3 shadow-soft lg:hidden"
          >
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "focus-ring block rounded-xl px-4 py-2.5 text-sm",
                    active === s.id ? "bg-primary/10 font-medium text-primary" : "text-ink-muted"
                  )}
                >
                  {t(s.label)}
                </a>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
