import { calculateExperienceYears } from "../../../helpers/calculate-experience-years";
import { calculateKeywordMatch } from "../../../helpers/calculate-keyword-match";
import { extractSkillsFromText } from "../../../helpers/extract-skills-from-text";
import { getResumeSkills } from "../../../helpers/get-resume-skills";
import { IParsedJobData, IParsedResumeData } from "./analysis.interface";

export const analyzeResumeAgainstJob = (
  resume: IParsedResumeData,
  job: IParsedJobData,
) => {
  const resumeSkills =
    getResumeSkills(resume);

  const requiredSkills =
    extractSkillsFromText(
      job.requiredSkills,
    );

  const preferredSkills =
    extractSkillsFromText(
      job.preferredSkills,
    );

  const matchedRequiredSkills =
    requiredSkills.filter((skill) =>
      resumeSkills.includes(skill),
    );

  const missingRequiredSkills =
    requiredSkills.filter(
      (skill) =>
        !resumeSkills.includes(skill),
    );

  const matchedPreferredSkills =
    preferredSkills.filter((skill) =>
      resumeSkills.includes(skill),
    );

  const missingPreferredSkills =
    preferredSkills.filter(
      (skill) =>
        !resumeSkills.includes(skill),
    );

  const matchedSkills = [
    ...matchedRequiredSkills,
    ...matchedPreferredSkills,
  ];

  const missingSkills = [
    ...missingRequiredSkills.map(
      (skill) => ({
        skill,
        importance:
          "required" as const,
        reason:
          "This required skill is not supported by the parsed resume.",
      }),
    ),

    ...missingPreferredSkills.map(
      (skill) => ({
        skill,
        importance:
          "preferred" as const,
        reason:
          "This preferred skill is not supported by the parsed resume.",
      }),
    ),
  ];

  const requiredScore =
    requiredSkills.length > 0
      ? (matchedRequiredSkills.length /
          requiredSkills.length) *
        60
      : 60;

  const preferredScore =
    preferredSkills.length > 0
      ? (matchedPreferredSkills.length /
          preferredSkills.length) *
        15
      : 15;

  const candidateYears =
    calculateExperienceYears(
      resume,
    );

  let experienceScore = 15;

  const experienceGaps: string[] = [];

  if (
    job.experienceYears !== null
  ) {
    if (
      candidateYears <
      job.experienceYears
    ) {
      experienceScore =
        Math.round(
          (candidateYears /
            job.experienceYears) *
            15,
        );

      experienceGaps.push(
        `The job requires ${job.experienceYears}+ years of experience, while the parsed resume shows approximately ${candidateYears} years.`,
      );
    }
  }


  const keywordScore =
    (calculateKeywordMatch(
      job.keywords,
      resume,
    ) /
      100) *
    10;

  const matchScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        requiredScore +
          preferredScore +
          experienceScore +
          keywordScore,
      ),
    ),
  );

  const recommendations: {
    section: string;
    recommendation: string;
  }[] = [];

  if (missingRequiredSkills.length) {
    recommendations.push({
      section: "Skills",
      recommendation:
        `Review these missing required skills: ${missingRequiredSkills.join(", ")}. Only add them to your resume if you genuinely have experience with them.`,
    });
  }

  if (missingPreferredSkills.length) {
    recommendations.push({
      section: "Skills",
      recommendation:
        `The job also prefers: ${missingPreferredSkills.join(", ")}.`,
    });
  }

  if (experienceGaps.length) {
    recommendations.push({
      section: "Experience",
      recommendation:
        "Highlight your most relevant professional experience and measurable achievements.",
    });
  }

  if (matchedRequiredSkills.length) {
    recommendations.push({
      section: "Experience",
      recommendation:
        `Highlight your experience with ${matchedRequiredSkills.join(", ")} because these skills are directly required by the job.`,
    });
  }

  return {
    matchScore,

    matchedSkills: matchedSkills.map(
      (skill) => ({
        skill,
        evidence:
          "Found in the candidate's parsed skills or project technologies.",
      }),
    ),

    missingSkills,

    experienceGaps,

    keywords: job.keywords,

    recommendations,
  };
};