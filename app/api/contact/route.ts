import { NextResponse } from "next/server";
import { z } from "zod";

import { sendContactEmail } from "@/services/email";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  // OPTIONAL database persistence, off by default. To enable, install
  // prisma + @prisma/client, run the migration in prisma/schema.prisma,
  // then uncomment:
  //
  // if (process.env.DATABASE_URL) {
  //   const { PrismaClient } = await import("@prisma/client");
  //   const prisma = new PrismaClient();
  //   await prisma.contactMessage.create({ data: parsed.data });
  // }

  const apiKey = process.env.RESEND_API_KEY;

  // Demo mode: no email key configured, so succeed gracefully so the
  // site remains fully functional without any environment setup.
  if (!apiKey) {
    console.info("[contact] demo mode: message received but no RESEND_API_KEY is set.");
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    await sendContactEmail(parsed.data, apiKey);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] send failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your message. Please try again." },
      { status: 502 }
    );
  }
}
