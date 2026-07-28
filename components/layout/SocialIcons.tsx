import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";

import { socialLinks } from "@/lib/config";
import type { SocialLink } from "@/types";

function Icon({ id }: { id: SocialLink["id"] }) {
  switch (id) {
    case "github":
      return <FaGithub className="h-4 w-4" aria-hidden="true" />;
    case "linkedin":
      return <FaLinkedinIn className="h-4 w-4" aria-hidden="true" />;
    case "whatsapp":
      return <FaWhatsapp className="h-4 w-4" aria-hidden="true" />;
    case "email":
      return <Mail className="h-4 w-4" aria-hidden="true" />;
  }
}

export function SocialIcons() {
  return (
    <ul className="flex items-center gap-3">
      {socialLinks.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="focus-ring glass flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-all duration-300 will-change-transform hover:-translate-y-1 hover:rotate-6 hover:scale-110 hover:border-primary/60 hover:text-primary hover:shadow-glow"
          >
            <Icon id={s.id} />
          </a>
        </li>
      ))}
    </ul>
  );
}
