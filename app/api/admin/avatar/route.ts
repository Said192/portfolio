import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Dev-only avatar upload. Saves the image to public/ and points
 * config/profile.json → avatar at the new file.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Uploads only work while running locally (npm run dev). In production, add your photo to public/ in the repo and redeploy.",
      },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("avatar");

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
      { ok: false, error: "Image is larger than 5 MB. Please use a smaller file." },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `avatar${ext}`;
  await fs.writeFile(path.join(process.cwd(), "public", filename), bytes);

  // Point profile.json at the new image.
  const profilePath = path.join(process.cwd(), "config", "profile.json");
  const profile = JSON.parse(await fs.readFile(profilePath, "utf8")) as { avatar: string };
  profile.avatar = `/${filename}`;
  await fs.writeFile(profilePath, JSON.stringify(profile, null, 2) + "\n", "utf8");

  return NextResponse.json({ ok: true, avatar: `/${filename}` });
}
