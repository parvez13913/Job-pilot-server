import { IParsedResumeData } from "../app/modules/analysis/analysis.interface";
import { normalizeSkill } from "./normalize-text";

export const getResumeSkills = (resume: IParsedResumeData): string[] => {
  const skills = [
    ...resume.skills,

    ...resume.projects.flatMap((project) => project.technologies),
  ];

  return [...new Set(skills.filter(Boolean).map(normalizeSkill))];
};
