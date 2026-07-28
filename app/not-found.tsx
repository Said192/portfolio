import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-display text-7xl font-bold gradient-text">404</p>
      <h1 className="font-display text-2xl font-semibold">This page doesn&apos;t exist</h1>
      <p className="max-w-md text-ink-muted">
        The page you&apos;re looking for was moved, removed, or never existed.
      </p>
      <Link
        href="/"
        className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  );
}
