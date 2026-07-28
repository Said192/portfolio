/**
 * Single source of truth for site content.
 *
 * Every config/*.json file is validated with Zod at build time, so a
 * malformed entry fails the build with a clear message instead of
 * silently rendering broken UI.
 */
import { z } from "zod";

import certificatesJson from "@/config/certificates.json";
import educationJson from "@/config/education.json";
import experienceJson from "@/config/experience.json";
import profileJson from "@/config/profile.json";
import projectsJson from "@/config/projects.json";
import seoJson from "@/config/seo.json";
import skillsJson from "@/config/skills.json";
import socialLinksJson from "@/config/social-links.json";

import type {
  Certificate,
  Education,
  Experience,
  Profile,
  Project,
  Seo,
  SkillGroup,
  SocialLink,
} from "@/types";

const statSchema = z.object({
  label: z.string().min(1),
  value: z.number(),
  suffix: z.string().optional(),
});

const profileSchema = z.object({
  name: z.string().min(1),
  titles: z.array(z.string().min(1)).min(1),
  tagline: z.string(),
  intro: z.string().min(1),
  bio: z.string().min(1),
  objectives: z.string(),
  interests: z.array(z.string()),
  location: z.string(),
  email: z.string().email(),
  phone: z.string(),
  avatar: z.string(),
  resumeUrl: z.string(),
  stats: z.array(statSchema),
});

const socialLinkSchema = z.object({
  id: z.enum(["github", "linkedin", "whatsapp", "email"]),
  label: z.string().min(1),
  url: z.string().min(1),
});

const skillGroupSchema = z.object({
  group: z.string().min(1),
  items: z.array(
    z.object({
      name: z.string().min(1),
      level: z.number().min(0).max(100),
    })
  ),
});

const caseStudySchema = z.object({
  problem: z.string().min(1),
  approach: z.string().min(1),
  architectureImage: z.string().optional(),
  results: z.array(z.string()),
});

const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  title: z.string().min(1),
  tagline: z.string(),
  description: z.string().min(1),
  cover: z.string().min(1),
  features: z.array(z.string()),
  tech: z.array(z.string()),
  github: z.string(),
  demo: z.string(),
  featured: z.boolean(),
  caseStudy: caseStudySchema.optional(),
});

const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  start: z.string(),
  end: z.string(),
  details: z.string(),
});

const experienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  start: z.string(),
  end: z.string(),
  highlights: z.array(z.string()),
});

const certificateSchema = z.object({
  title: z.string().min(1),
  issuer: z.string(),
  date: z.string(),
  image: z.string(),
  url: z.string().optional(),
});

const seoSchema = z.object({
  title: z.string().min(1),
  titleTemplate: z.string(),
  description: z.string().min(1),
  keywords: z.array(z.string()),
  siteName: z.string(),
  twitterHandle: z.string(),
  ogImage: z.string(),
  locale: z.string(),
});

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid content in config/${file}:\n${issues}`);
  }
  return result.data;
}

export const profile: Profile = parse(profileSchema, profileJson, "profile.json");
export const socialLinks: SocialLink[] = parse(
  z.array(socialLinkSchema),
  socialLinksJson,
  "social-links.json"
);
export const skills: SkillGroup[] = parse(z.array(skillGroupSchema), skillsJson, "skills.json");
export const projects: Project[] = parse(z.array(projectSchema), projectsJson, "projects.json");
export const education: Education[] = parse(
  z.array(educationSchema),
  educationJson,
  "education.json"
);
export const experience: Experience[] = parse(
  z.array(experienceSchema),
  experienceJson,
  "experience.json"
);
export const certificates: Certificate[] = parse(
  z.array(certificateSchema),
  certificatesJson,
  "certificates.json"
);
export const seo: Seo = parse(seoSchema, seoJson, "seo.json");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
