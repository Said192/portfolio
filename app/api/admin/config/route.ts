import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

/**
 * Dev-only content API for the /dashboard editor.
 *
 * Writes are only possible while running locally (`npm run dev`) because
 * production hosts like Vercel have a read-only filesystem. In production
 * this API returns a clear message instead of failing silently.
 */
const ALLOWED_FILES = [
  "profile",
  "projects",
  "skills",
  "education",
  "experience",
  "certificates",
  "social-links",
  "seo",
] as const;

type ConfigFile = (typeof ALLOWED_FILES)[number];

function isAllowed(file: string | null): file is ConfigFile {
  return !!file && (ALLOWED_FILES as readonly string[]).includes(file);
}

function configPath(file: ConfigFile): string {
  return path.join(process.cwd(), "config", `${file}.json`);
}

const readOnly = process.env.NODE_ENV === "production";

export async function GET(request: Request) {
  const file = new URL(request.url).searchParams.get("file");
  if (!isAllowed(file)) {
    return NextResponse.json({ ok: false, error: "Unknown config file." }, { status: 400 });
  }

  const raw = await fs.readFile(configPath(file), "utf8");
  return NextResponse.json({ ok: true, file, content: JSON.parse(raw), readOnly });
}

export async function PUT(request: Request) {
  if (readOnly) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Editing is only available while running locally (npm run dev). Edit config/*.json in your repo and redeploy to publish changes.",
      },
      { status: 403 }
    );
  }

  const file = new URL(request.url).searchParams.get("file");
  if (!isAllowed(file)) {
    return NextResponse.json({ ok: false, error: "Unknown config file." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  await fs.writeFile(configPath(file), JSON.stringify(body, null, 2) + "\n", "utf8");
  return NextResponse.json({ ok: true });
}
