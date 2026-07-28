"use client";

import { SocialIcons } from "@/components/layout/SocialIcons";
import { useLanguage } from "@/lib/i18n";
import { profile } from "@/lib/config";

const QUICK_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#resume", label: "Resume" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-bold">
            <span className="gradient-text">Said</span> Wali Khan
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-5">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="focus-ring rounded text-sm text-ink-muted transition hover:text-primary"
                >
                  {t(l.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <SocialIcons />
      </div>
    </footer>
  );
}
