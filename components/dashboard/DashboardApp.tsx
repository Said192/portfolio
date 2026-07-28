"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Braces,
  CheckCircle2,
  Cloud,
  FileJson2,
  FolderGit2,
  GraduationCap,
  Home,
  ImagePlus,
  LayoutDashboard,
  Loader2,
  RotateCcw,
  Save,
  Search,
  Share2,
  Sparkles,
  User,
  Wrench,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

type FileId =
  | "profile"
  | "projects"
  | "skills"
  | "education"
  | "experience"
  | "certificates"
  | "social-links"
  | "seo";

interface NavItem {
  id: FileId | "overview";
  label: string;
  icon: typeof User;
  hint?: string;
}

const NAV: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User, hint: "Name, bio, photo, stats" },
  { id: "projects", label: "Projects", icon: FolderGit2, hint: "Cards + detail pages" },
  { id: "skills", label: "Skills", icon: Wrench, hint: "Groups and levels" },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Sparkles },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "social-links", label: "Social links", icon: Share2 },
  { id: "seo", label: "SEO", icon: Search },
];

type Toast = { kind: "success" | "error"; text: string } | null;

function useToast(): [Toast, (t: Toast) => void] {
  const [toast, setToast] = useState<Toast>(null);
  const show = useCallback((t: Toast) => {
    setToast(t);
    if (t) setTimeout(() => setToast(null), 5000);
  }, []);
  return [toast, show];
}

/** Upload card for the profile picture (dev-only writes). */
function AvatarUploader({ onDone }: { onDone: (msg: Toast) => void }) {
  const [preview, setPreview] = useState<string>("/avatar.svg");
  const [busy, setBusy] = useState(false);

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    const form = new FormData();
    form.append("avatar", file);

    try {
      const res = await fetch("/api/admin/avatar", { method: "POST", body: form });
      const json = (await res.json()) as { ok: boolean; avatar?: string; error?: string };
      if (json.ok && json.avatar) {
        setPreview(`${json.avatar}?t=${Date.now()}`);
        onDone({ kind: "success", text: "Profile picture updated across the whole site." });
      } else {
        onDone({ kind: "error", text: json.error ?? "Upload failed." });
      }
    } catch {
      onDone({ kind: "error", text: "Upload failed. Please try again." });
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="glass flex flex-col items-center gap-4 rounded-2xl p-6 text-center sm:flex-row sm:text-left">
      {/* eslint-disable-next-line @next/next/no-img-element -- live preview of a just-uploaded file */}
      <img
        src={preview}
        alt="Current profile picture"
        className="h-24 w-24 rounded-full border-2 border-primary/40 object-cover"
      />
      <div className="flex-1">
        <h3 className="font-display font-semibold">Profile picture</h3>
        <p className="mt-1 text-sm text-ink-muted">
          JPG, PNG, or WebP up to 5 MB. A square image around 600×600 looks best. It saves to{" "}
          <code className="rounded bg-edge/60 px-1 py-0.5 text-xs">public/</code> and updates
          everywhere automatically.
        </p>
      </div>
      <label
        className={cn(
          "focus-ring inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-white shadow-glow transition hover:opacity-90",
          busy && "pointer-events-none opacity-60"
        )}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
        )}
        {busy ? "Uploading…" : "Upload photo"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onPick}
          className="sr-only"
          aria-label="Upload profile picture"
        />
      </label>
    </div>
  );
}

/** JSON editor for one config file with validation and pretty formatting. */
function ConfigEditor({ file, onToast }: { file: FileId; onToast: (t: Toast) => void }) {
  const [text, setText] = useState("");
  const [original, setOriginal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/admin/config?file=${file}`)
      .then((r) => r.json())
      .then((json: { ok: boolean; content?: unknown; readOnly?: boolean }) => {
        if (cancelled || !json.ok) return;
        const pretty = JSON.stringify(json.content, null, 2);
        setText(pretty);
        setOriginal(pretty);
        setReadOnly(!!json.readOnly);
        setJsonError(null);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [file]);

  function validate(value: string) {
    setText(value);
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  async function save() {
    if (jsonError) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/config?file=${file}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: text,
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setOriginal(text);
        onToast({ kind: "success", text: `Saved config/${file}.json — refresh the site to see it.` });
      } else {
        onToast({ kind: "error", text: json.error ?? "Save failed." });
      }
    } catch {
      onToast({ kind: "error", text: "Save failed. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  const dirty = text !== original;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-ink-muted">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {file === "profile" ? <AvatarUploader onDone={onToast} /> : null}

      {readOnly ? (
        <p className="glass flex items-start gap-2 rounded-xl px-4 py-3 text-sm text-ink-muted">
          <Cloud className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          This is a production deployment, so files are read-only here. Run the site locally with
          npm run dev to edit, then redeploy.
        </p>
      ) : null}

      <div className="glass overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-edge px-4 py-3">
          <p className="flex items-center gap-2 font-accent text-sm font-medium">
            <FileJson2 className="h-4 w-4 text-primary" aria-hidden="true" />
            config/{file}.json
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => validate(original)}
              disabled={!dirty}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-ink-muted transition hover:text-ink disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
            </button>
            <button
              onClick={() => {
                try {
                  validate(JSON.stringify(JSON.parse(text), null, 2));
                } catch {
                  /* keep as-is; error already shown */
                }
              }}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-ink-muted transition hover:text-ink"
            >
              <Braces className="h-3.5 w-3.5" aria-hidden="true" /> Format
            </button>
            <button
              onClick={() => void save()}
              disabled={!dirty || !!jsonError || saving || readOnly}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-medium text-white shadow-glow transition disabled:opacity-40"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Save
            </button>
          </div>
        </div>

        <label htmlFor={`editor-${file}`} className="sr-only">
          Edit config/{file}.json
        </label>
        <textarea
          id={`editor-${file}`}
          value={text}
          onChange={(e) => validate(e.target.value)}
          spellCheck={false}
          rows={22}
          className="focus-ring w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed"
        />
      </div>

      {jsonError ? (
        <p className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> {jsonError}
        </p>
      ) : null}
    </div>
  );
}

interface OverviewProps {
  counts: { projects: number; skills: number; certificates: number; social: number };
  onNavigate: (id: FileId) => void;
}

function Overview({ counts, onNavigate }: OverviewProps) {
  const cards = [
    { id: "projects" as const, label: "Projects", value: counts.projects, icon: FolderGit2 },
    { id: "skills" as const, label: "Skills listed", value: counts.skills, icon: Wrench },
    { id: "certificates" as const, label: "Certificates", value: counts.certificates, icon: Award },
    { id: "social-links" as const, label: "Social links", value: counts.social, icon: Share2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onNavigate(c.id)}
            className="focus-ring glass group rounded-2xl p-5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-primary/50"
          >
            <c.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-3xl font-bold gradient-text">{c.value}</p>
            <p className="mt-1 text-sm text-ink-muted">{c.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">How this dashboard works</h2>
        <ul className="mt-4 space-y-3 text-sm text-ink-muted">
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            Pick a section on the left to edit its content. Changes save straight into the
            config/*.json files, and the site picks them up automatically.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            Upload your profile picture from the Profile tab. It replaces the placeholder
            everywhere: hero, and anywhere else the avatar is shown.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            Editing works while running locally (npm run dev). On Vercel the filesystem is
            read-only, so commit your changes and redeploy to publish them.
          </li>
        </ul>
      </div>
    </div>
  );
}

export function DashboardApp() {
  const [active, setActive] = useState<NavItem["id"]>("overview");
  const [toast, showToast] = useToast();
  const [counts, setCounts] = useState({ projects: 0, skills: 0, certificates: 0, social: 0 });

  useEffect(() => {
    async function load() {
      const files: FileId[] = ["projects", "skills", "certificates", "social-links"];
      const results = await Promise.all(
        files.map((f) =>
          fetch(`/api/admin/config?file=${f}`)
            .then((r) => r.json() as Promise<{ ok: boolean; content?: unknown }>)
            .catch(() => ({ ok: false }) as { ok: boolean; content?: unknown })
        )
      );

      const [projects, skills, certificates, social] = results.map((r) =>
        r.ok && Array.isArray(r.content) ? r.content : []
      );

      setCounts({
        projects: projects.length,
        skills: (skills as { items?: unknown[] }[]).reduce(
          (n, g) => n + (g.items?.length ?? 0),
          0
        ),
        certificates: certificates.length,
        social: social.length,
      });
    }
    void load();
  }, []);

  const activeItem = useMemo(() => NAV.find((n) => n.id === active), [active]);

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 pb-16 pt-8 lg:grid-cols-[240px,1fr] lg:px-8">
      {/* Sidebar */}
      <aside className="glass h-fit rounded-2xl p-3 lg:sticky lg:top-8">
        <Link
          href="/"
          className="focus-ring mb-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink-muted transition hover:text-primary"
        >
          <Home className="h-4 w-4" aria-hidden="true" /> Back to site
        </Link>
        <p className="px-3 pb-2 pt-1 font-accent text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted">
          Content
        </p>
        <nav aria-label="Dashboard sections">
          <ul className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {NAV.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActive(item.id)}
                  aria-current={active === item.id ? "page" : undefined}
                  className={cn(
                    "focus-ring flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition",
                    active === item.id
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main panel */}
      <main>
        <header className="mb-6">
          <p className="font-accent text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold">
            {activeItem?.label ?? "Overview"}
          </h1>
          {activeItem?.hint ? <p className="mt-1 text-sm text-ink-muted">{activeItem.hint}</p> : null}
        </header>

        {active === "overview" ? (
          <Overview counts={counts} onNavigate={setActive} />
        ) : (
          <ConfigEditor file={active as FileId} onToast={showToast} />
        )}

        <div aria-live="polite">
          <AnimatePresence>
            {toast ? (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm shadow-glow",
                  toast.kind === "success"
                    ? "bg-emerald-600 text-white"
                    : "bg-red-600 text-white"
                )}
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
      </main>
    </div>
  );
}
