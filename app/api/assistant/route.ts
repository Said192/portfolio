import { NextResponse } from "next/server";
import { z } from "zod";

import { localAnswer, openAiAnswer } from "@/services/assistant";

const askSchema = z.object({
  question: z.string().min(1, "Question is required").max(1000),
});

/** Naive in-memory rate limit: 20 requests/minute per IP. */
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 20;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many questions. Please wait a moment." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = askSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { question } = parsed.data;
  const apiKey = process.env.OPENAI_API_KEY;

  // Local mode: grounded keyword answers with no key required.
  if (!apiKey) {
    return NextResponse.json({ ok: true, answer: localAnswer(question), mode: "local" });
  }

  try {
    const answer = await openAiAnswer(question, apiKey);
    return NextResponse.json({ ok: true, answer, mode: "ai" });
  } catch (error) {
    console.error("[assistant] OpenAI failed, using local fallback:", error);
    return NextResponse.json({ ok: true, answer: localAnswer(question), mode: "local" });
  }
}
