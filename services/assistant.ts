/**
 * AI assistant service.
 *
 * Two modes:
 *  1. OpenAI-powered — used when OPENAI_API_KEY is set.
 *  2. Local keyword fallback — always available, grounded in the same
 *     JSON knowledge base, so the widget works with no key at all.
 */
import { education, experience, profile, projects, skills, socialLinks } from "@/lib/config";

/** Serialize the JSON knowledge base into a compact grounding context. */
export function buildKnowledgeBase(): string {
  const skillsText = skills
    .map((g) => `${g.group}: ${g.items.map((i) => i.name).join(", ")}`)
    .join("\n");

  const projectsText = projects
    .map(
      (p) =>
        `- ${p.title} (${p.tagline}): ${p.description} Tech: ${p.tech.join(", ")}. GitHub: ${p.github || "n/a"}`
    )
    .join("\n");

  const educationText = education
    .map((e) => `- ${e.degree}, ${e.institution} (${e.start}–${e.end}). ${e.details}`)
    .join("\n");

  const experienceText = experience
    .map((e) => `- ${e.role} at ${e.company} (${e.start}–${e.end}): ${e.highlights.join(" ")}`)
    .join("\n");

  const contactText = socialLinks.map((s) => `${s.label}: ${s.url}`).join(" · ");

  return [
    `Name: ${profile.name}`,
    `Roles: ${profile.titles.join(", ")}`,
    `About: ${profile.intro} ${profile.bio}`,
    `Objectives: ${profile.objectives}`,
    `Skills:\n${skillsText}`,
    `Projects:\n${projectsText}`,
    `Education:\n${educationText}`,
    `Experience:\n${experienceText}`,
    `Contact: email ${profile.email}, phone ${profile.phone}. ${contactText}`,
  ].join("\n\n");
}

/** Rule-based fallback so the assistant works without any API key. */
export function localAnswer(question: string): string {
  const q = question.toLowerCase();

  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("who is", "who's", "about", "introduce", "yourself", "bio")) {
    return `${profile.name} is a ${profile.titles.join(", ")}. ${profile.intro} ${profile.bio}`;
  }

  // Specific project questions first, then the general project list.
  for (const p of projects) {
    if (q.includes(p.slug.replace(/-/g, " ")) || q.includes(p.title.toLowerCase())) {
      return `${p.title} (${p.tagline}): ${p.description} Built with ${p.tech.join(", ")}.${p.github ? ` Code: ${p.github}` : ""}`;
    }
  }

  if (has("project", "built", "portfolio", "work")) {
    const list = projects.map((p) => `• ${p.title}: ${p.tagline}`).join("\n");
    return `Said has completed these featured projects:\n${list}\nAsk me about any of them for details!`;
  }

  if (has("language", "skill", "stack", "technolog", "framework", "know")) {
    const list = skills.map((g) => `${g.group}: ${g.items.map((i) => i.name).join(", ")}`).join("\n");
    return `Here are Said's skills:\n${list}`;
  }

  if (has("contact", "email", "reach", "hire", "phone", "whatsapp", "linkedin", "github")) {
    const links = socialLinks.map((s) => `${s.label}: ${s.url}`).join("\n");
    return `You can reach Said at ${profile.email} or ${profile.phone}.\n${links}`;
  }

  if (has("education", "study", "degree", "university")) {
    return education.map((e) => `${e.degree}, ${e.institution} (${e.start} to ${e.end}). ${e.details}`).join("\n");
  }

  if (has("experience", "intern", "eziline", "job")) {
    return experience
      .map((e) => `${e.role} at ${e.company} (${e.start}–${e.end}):\n${e.highlights.map((h) => `• ${h}`).join("\n")}`)
      .join("\n\n");
  }

  if (has("resume", "cv")) {
    return `You can view or download Said's resume from the Resume section of this site (${profile.resumeUrl}).`;
  }

  const projectNames = projects.map((p) => p.title).join(", ");
  return `I can tell you about ${profile.name}: his projects (${projectNames}), skills, education, experience, or how to contact him. What would you like to know?`;
}

/** OpenAI-powered answer, used only when a key is configured. */
export async function openAiAnswer(question: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content:
            "You are the friendly portfolio assistant for Said Wali Khan. Answer questions about him using ONLY the knowledge base below. Be concise and helpful. If asked something outside the knowledge base, say you only answer questions about Said.\n\n" +
            buildKnowledgeBase(),
        },
        { role: "user", content: question },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  return data.choices?.[0]?.message?.content?.trim() || localAnswer(question);
}
