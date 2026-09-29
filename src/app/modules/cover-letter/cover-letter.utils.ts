import { z } from "zod";
import { parsedJobSchema, parsedResumeSchema } from "../ai/ai.validation";
import { CoverLetterLength, CoverLetterTone } from "./cover-letter.interface";

type ParsedResume = z.infer<typeof parsedResumeSchema>;
type ParsedJob = z.infer<typeof parsedJobSchema>;

interface IGenerateCoverLetterOptions {
  tone: CoverLetterTone;
  length: CoverLetterLength;
}

const normalizeText = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getMatchedSkills = (resume: ParsedResume, job: ParsedJob): string[] => {
  const resumeSkills = resume.skills || [];

  const jobSkills = [
    ...(job.requiredSkills || []),
    ...(job.preferredSkills || []),
    ...(job.keywords || []),
  ];

  return resumeSkills.filter((resumeSkill) => {
    const normalizedResumeSkill = normalizeText(resumeSkill);

    return jobSkills.some((jobSkill) => {
      const normalizedJobSkill = normalizeText(jobSkill);

      return (
        normalizedResumeSkill === normalizedJobSkill ||
        normalizedResumeSkill.includes(normalizedJobSkill) ||
        normalizedJobSkill.includes(normalizedResumeSkill)
      );
    });
  });
};

const getRelevantExperience = (
  resume: ParsedResume,
): ParsedResume["experience"] => {
  return (resume.experience || []).slice(0, 2);
};

const getRelevantProjects = (
  resume: ParsedResume,
  job: ParsedJob,
): ParsedResume["projects"] => {
  const jobKeywords = [
    ...(job.requiredSkills || []),
    ...(job.preferredSkills || []),
    ...(job.keywords || []),
  ].map(normalizeText);

  const projects = resume.projects || [];

  const scoredProjects = projects.map((project) => {
    const text = normalizeText(
      `${project.name} ${project.description} ${project.technologies.join(" ")}`,
    );

    const score = jobKeywords.reduce((count, keyword) => {
      return text.includes(keyword) ? count + 1 : count;
    }, 0);

    return {
      project,
      score,
    };
  });

  return scoredProjects
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.project);
};

const getToneText = (tone: CoverLetterTone): string => {
  switch (tone) {
    case "confident":
      return "I am confident that my experience and technical background would allow me to contribute effectively to your team.";

    case "enthusiastic":
      return "I am excited about the opportunity to contribute my skills and experience to your team.";

    case "professional":
    default:
      return "I believe my technical background and practical experience make me a strong candidate for this opportunity.";
  }
};

const buildSkillsSentence = (skills: string[]): string => {
  if (!skills.length) {
    return "";
  }

  const selectedSkills = skills.slice(0, 6);

  if (selectedSkills.length === 1) {
    return `My experience includes ${selectedSkills[0]}.`;
  }

  if (selectedSkills.length === 2) {
    return `My experience includes ${selectedSkills[0]} and ${selectedSkills[1]}.`;
  }

  const lastSkill = selectedSkills[selectedSkills.length - 1];

  return `My experience includes ${selectedSkills
    .slice(0, -1)
    .join(", ")}, and ${lastSkill}.`;
};

const buildExperienceParagraph = (
  experience: ParsedResume["experience"],
): string => {
  if (!experience.length) {
    return "";
  }

  const firstExperience = experience[0];

  const firstResponsibility =
    firstExperience.responsibilities?.[0] ||
    "contributing to software development projects";

  return `In my role as ${firstExperience.role} at ${firstExperience.company}, I have worked on practical software development tasks, including ${firstResponsibility.toLowerCase()}.`;
};

const buildProjectsParagraph = (projects: ParsedResume["projects"]): string => {
  if (!projects.length) {
    return "";
  }

  const projectNames = projects.map((project) => project.name);

  if (projectNames.length === 1) {
    return `I have also worked on projects such as ${projectNames[0]}, where I applied my technical skills to build practical solutions.`;
  }

  return `I have also worked on projects such as ${projectNames.join(
    " and ",
  )}, applying my technical skills to build practical and user-focused solutions.`;
};

const generateCoverLetter = (
  resume: ParsedResume,
  job: ParsedJob,
  options: IGenerateCoverLetterOptions,
): string => {
  const matchedSkills = getMatchedSkills(resume, job);

  const relevantExperience = getRelevantExperience(resume);

  const relevantProjects = getRelevantProjects(resume, job);

  const name = resume.personalInfo?.name || "Applicant";

  const companyName = job.jobTitle
    ? `the ${job.jobTitle} position`
    : "this position";

  const greeting = "Dear Hiring Manager,";

  const opening = `I am writing to express my interest in ${companyName}. ${getToneText(
    options.tone,
  )}`;

  const skillsSentence = buildSkillsSentence(matchedSkills);

  const experienceParagraph = buildExperienceParagraph(relevantExperience);

  const projectsParagraph = buildProjectsParagraph(relevantProjects);

  const closing =
    "I would welcome the opportunity to discuss how my experience and skills can contribute to your team. Thank you for considering my application.";

  const signature = `Sincerely,\n${name}`;

  const sections: string[] = [greeting, opening];

  if (skillsSentence) {
    sections.push(skillsSentence);
  }

  if (experienceParagraph) {
    sections.push(experienceParagraph);
  }

  if (projectsParagraph) {
    sections.push(projectsParagraph);
  }

  sections.push(closing);
  sections.push(signature);

  let result = sections.join("\n\n");

  if (options.length === "short") {
    result = [
      greeting,
      opening,
      skillsSentence || experienceParagraph || "",
      closing,
      signature,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (options.length === "long") {
    const qualificationText = job.qualifications?.length
      ? `The role's qualifications also align with my background and my interest in continuing to grow as a software professional.`
      : "";

    result = [
      greeting,
      opening,
      skillsSentence,
      experienceParagraph,
      projectsParagraph,
      qualificationText,
      closing,
      signature,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return result.trim();
};

export const createCoverLetterHelper = (
  resumeData: unknown,
  jobData: unknown,
  options: IGenerateCoverLetterOptions,
): string => {
  const parsedResume = parsedResumeSchema.parse(resumeData);
  const parsedJob = parsedJobSchema.parse(jobData);

  return generateCoverLetter(parsedResume, parsedJob, options);
};
