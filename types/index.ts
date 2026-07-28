/** Shared domain types for JSON-driven content (config/*.json). */

export interface ProfileStat {
  label: string;
  value: number;
  suffix?: string;
}

export interface Profile {
  name: string;
  titles: string[];
  tagline: string;
  intro: string;
  bio: string;
  objectives: string;
  interests: string[];
  location: string;
  email: string;
  phone: string;
  avatar: string;
  resumeUrl: string;
  stats: ProfileStat[];
}

export interface SocialLink {
  id: "github" | "linkedin" | "whatsapp" | "email";
  label: string;
  url: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0–100, drives the progress bar
}

export interface SkillGroup {
  group: string;
  items: SkillItem[];
}

export interface CaseStudy {
  problem: string;
  approach: string;
  architectureImage?: string;
  results: string[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  features: string[];
  tech: string[];
  github: string;
  demo: string;
  featured: boolean;
  caseStudy?: CaseStudy;
}

export interface Education {
  degree: string;
  institution: string;
  start: string;
  end: string;
  details: string;
}

export interface Experience {
  role: string;
  company: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  url?: string;
}

export interface Seo {
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  siteName: string;
  twitterHandle: string;
  ogImage: string;
  locale: string;
}
