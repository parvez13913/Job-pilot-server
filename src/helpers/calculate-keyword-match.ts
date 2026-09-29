import { IParsedResumeData } from "../app/modules/analysis/analysis.interface";
import { normalizeText } from "./normalize-text";

const getTextTokens = (
  value: string,
): Set<string> => {
  return new Set(
    normalizeText(value)
      .split(" ")
      .filter(
        (word) => word.length > 2,
      ),
  );
};

export const calculateKeywordMatch = (
  jobKeywords: string[],
  resume: IParsedResumeData,
): number => {
  if (!jobKeywords.length) {
    return 100;
  }

  const resumeText = [
    resume.summary ?? "",

    ...resume.skills,

    ...resume.experience.flatMap(
      (item) => [
        item.role,
        ...item.responsibilities,
      ],
    ),

    ...resume.projects.flatMap(
      (project) => [
        project.name,
        project.description,
        ...project.technologies,
      ],
    ),
  ].join(" ");

  const resumeTokens =
    getTextTokens(resumeText);

  const matched = jobKeywords.filter(
    (keyword) =>
      resumeTokens.has(
        normalizeText(keyword),
      ),
  ).length;

  return Math.round(
    (matched / jobKeywords.length) *
      100,
  );
};