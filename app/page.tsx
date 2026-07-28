import { About } from "@/components/sections/About";
import { Certificates } from "@/components/sections/Certificates";
import { Contact } from "@/components/sections/Contact";
import { EducationSection } from "@/components/sections/EducationSection";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Resume } from "@/components/sections/Resume";
import { Skills } from "@/components/sections/Skills";
import {
  certificates,
  education,
  experience,
  profile,
  projects,
  skills,
} from "@/lib/config";

export default function HomePage() {
  return (
    <main>
      <Hero profile={profile} />
      <About profile={profile} education={education} experience={experience} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <EducationSection education={education} experience={experience} />
      <Resume profile={profile} />
      <Certificates certificates={certificates} />
      <Contact profile={profile} />
    </main>
  );
}
