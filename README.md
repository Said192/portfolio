# Said Wali Khan — Portfolio

A premium, production-ready personal portfolio built with **Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS, and Framer Motion** — featuring an integrated AI assistant, fully JSON-driven content, and complete SEO.

## ✨ Features

- **Single-page scroll experience** — Hero, About, Skills, Projects, Education, Resume, Certificates, Contact — plus dedicated project-detail routes (`/projects/[slug]`)
- **AI chat assistant** — floating widget grounded in the JSON knowledge base; OpenAI-powered when a key is set, local keyword mode otherwise
- **JSON-driven content** — edit files in `config/` and the whole site updates; Zod validates every file at build time
- **Dark / light mode** — persisted, respects system preference, single token source in `globals.css`
- **Motion done right** — Framer Motion entrances, typing effect, animated counters, scroll-fill skill bars, particles, scroll progress bar, cursor glow — all with `prefers-reduced-motion` fallbacks
- **Contact form** — validated client + server, Resend email delivery, graceful demo mode with no key, optional Prisma persistence (off by default)
- **SEO** — Metadata API driven by `config/seo.json`, Open Graph + Twitter cards, JSON-LD Person, `sitemap.xml`, `robots.txt`, canonical URLs
- **Accessibility** — semantic HTML, keyboard navigation, visible focus rings, ARIA labels, WCAG-AA-minded contrast in both themes

## 📸 Screenshots

> Add screenshots here after your first deploy — e.g. `docs/hero.png`, `docs/projects.png`.

## 🚀 Getting started

Requires **Node.js 20+**.

```bash
npm install
npm run dev        # http://localhost:3000
```

That's it — the site runs fully with **zero environment variables**. Email and the AI assistant degrade gracefully to demo/local modes.

Other scripts:

```bash
npm run build      # production build (also validates all config JSON)
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint
npm run format     # Prettier
```

## 🎛 Content dashboard

Run the site locally and open **http://localhost:3000/dashboard** for a modern admin panel:

- **Overview** with live counts of your projects, skills, certificates, and links
- **Profile picture upload** (JPG/PNG/WebP, up to 5 MB) that saves to `public/` and updates the whole site
- **Editors for every config file** with JSON validation, one-click formatting, reset, and save

Editing works while running locally (`npm run dev`). Production hosts like Vercel have a read-only filesystem, so the dashboard switches to read-only there; commit your local changes and redeploy to publish. The page is excluded from search engines (`noindex`).

## ✏️ Editing your content

All content lives in `config/` — no component edits needed:

| File | Drives |
|---|---|
| `profile.json` | Name, titles, bio, stats, contact info, resume path |
| `projects.json` | Project cards + detail pages (add an object → new page appears) |
| `skills.json` | Skill groups and progress-bar levels |
| `education.json` / `experience.json` | Timelines |
| `certificates.json` | Certificate gallery (empty ⇒ "coming soon" card) |
| `social-links.json` | Social icons everywhere |
| `seo.json` | Titles, description, keywords, OG image |

Malformed JSON **fails the build with a clear message** (see `lib/config.ts`).

### Swap in your real assets

- **Photo:** upload it from `/dashboard` → Profile, or manually save it as e.g. `public/avatar.jpg` and set `profile.json → avatar` to `/avatar.jpg`
- **Resume:** replace `public/resume.pdf`
- **Project covers:** replace the SVGs in `public/projects/` (or use `.png`/`.jpg` and update `cover` in `projects.json`)
- **Certificates:** drop images in `public/certificates/` and add entries to `certificates.json`

## 🔐 Environment variables

Copy `.env.example` → `.env.local`. Every variable is optional-safe:

| Variable | Purpose | Without it |
|---|---|---|
| `RESEND_API_KEY` | Contact-form email via Resend | API returns a graceful demo success |
| `CONTACT_TO_EMAIL` | Delivery address | Falls back to default |
| `OPENAI_API_KEY` | AI-powered assistant answers | Local keyword mode (still grounded in your JSON) |
| `DATABASE_URL` | Optional message persistence | Persistence stays off |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL / sitemap / OG | Defaults to `http://localhost:3000` |

### Email providers

**Resend (default):** create a key at resend.com, set `RESEND_API_KEY`. Until you verify a domain, Resend only delivers from `onboarding@resend.dev` to your own account email.

**EmailJS (fallback):** if you prefer a client-side provider, install `@emailjs/browser` and call `emailjs.send(...)` from `components/sections/Contact.tsx` with your public key instead of posting to `/api/contact`. Resend is recommended since it keeps credentials server-side.

### Enabling the database (optional)

The site never requires a database. To persist contact messages:

```bash
npm i prisma @prisma/client
npx prisma migrate dev --name init   # requires DATABASE_URL in .env
```

Then uncomment the marked Prisma block in `app/api/contact/route.ts`.

## ☁️ Deploying to Vercel

1. Push this repo to GitHub.
2. In [vercel.com](https://vercel.com) → **New Project** → import the repo. Vercel auto-detects Next.js; no config changes needed.
3. Add environment variables (Project → Settings → Environment Variables). At minimum set `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://saidwalikhan.vercel.app`).
4. Deploy. `sitemap.xml` and `robots.txt` are generated automatically at the root.

## 🗂 Project structure

```
app/               routes, API handlers, sitemap, robots, layout
components/
  ui/              Button, Badge, GlassCard, SectionHeading
  sections/        Hero, About, Skills, Projects, Education, Resume, Certificates, Contact
  layout/          Navbar, Footer, SocialIcons
  effects/         Particles, ScrollProgress, CursorGlow, PageLoader, Counter, BackToTop
  assistant/       AssistantWidget
  providers/       ThemeProvider
config/            all editable JSON content
hooks/             useActiveSection, useTypingEffect
lib/               config loader (Zod-validated), utils
services/          assistant (OpenAI + local modes), email (Resend)
types/             shared TypeScript interfaces
public/            images, resume, favicon, OG image
prisma/            optional schema (DB off by default)
```

## 🧰 Notes

- Icons use **lucide-react** for UI and **react-icons** for brand marks (GitHub/LinkedIn/WhatsApp).
- Fonts (**Space Grotesk / Poppins / Inter**) load via `next/font` — self-hosted, zero layout shift.
- The map in Contact is a styled placeholder; swap it for a Google Maps `<iframe>` embed when ready.
