import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "certificate"
  );
}

/**
 * Dev-only certificate upload. Saves the image to public/certificates/
 * and appends an entry to config/certificates.json so the gallery
 * updates instantly.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Uploads only work while running locally (npm run dev). In production, add the image to public/certificates/ and an entry to config/certificates.json, then redeploy.",
      },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("image");
  const title = String(formData.get("title") ?? "").trim();
  const issuer = String(formData.get("issuer") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();

  if (!title) {
    return NextResponse.json({ ok: false, error: "Please enter a certificate title." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No image file received." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Please upload a JPG, PNG, or WebP image." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Image is larger than 8 MB. Please use a smaller file." },
      { status: 400 }
    );
  }

  const dir = path.join(process.cwd(), "public", "certificates");
  await fs.mkdir(dir, { recursive: true });

  // Unique filename derived from the title
  const base = slugify(title);
  let filename = `${base}${ext}`;
  let counter = 2;
  while (
    await fs
      .access(path.join(dir, filename))
      .then(() => true)
      .catch(() => false)
  ) {
    filename = `${base}-${counter}${ext}`;
    counter += 1;
  }

  await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  // Append to the gallery config
  const configPath = path.join(process.cwd(), "config", "certificates.json");
  const list = JSON.parse(await fs.readFile(configPath, "utf8")) as unknown[];
  list.push({ title, issuer, date, image: `/certificates/${filename}` });
  await fs.writeFile(configPath, JSON.stringify(list, null, 2) + "\n", "utf8");

  return NextResponse.json({ ok: true });
}
