import { tailoredResumeSchema } from "./tailored-resume.validation";

type ParsedResume = {
  personalInfo: {
    name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
  };
  summary: string | null;
  skills: string[];
  experience: {
    company: string;
    role: string;
    startDate: string | null;
    endDate: string | null;
    responsibilities: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string | null;
    startDate: string | null;
    endDate: string | null;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
  }[];
  certifications: string[];
};

type ParsedJob = {
  jobTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number | null;
  responsibilities: string[];
  qualifications: string[];
  keywords: string[];
};

type JobAnalysis = {
  matchScore: number;
  matchedSkills: unknown;
  missingSkills: unknown;
  experienceGaps: unknown;
  keywords: unknown;
  recommendations: unknown;
};

const normalize = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const containsKeyword = (text: string, keyword: string): boolean => {
  return normalize(text).includes(normalize(keyword));
};

const scoreText = (text: string, keywords: string[]): number => {
  if (!keywords.length) {
    return 0;
  }

  return keywords.reduce(
    (score, keyword) => score + (containsKeyword(text, keyword) ? 1 : 0),
    0,
  );
};

const uniqueStrings = (values: string[]): string[] => {
  return [...new Set(values)];
};

export const createTailoredResumeHelper = (
  resume: ParsedResume,
  job: ParsedJob,
  _analysis: JobAnalysis,
) => {
  const jobKeywords = uniqueStrings([
    ...job.requiredSkills,
    ...job.preferredSkills,
    ...job.keywords,
  ]);

  const normalizedJobSkills = jobKeywords.map(normalize);

  const sortedSkills = [...resume.skills].sort((a, b) => {
    const aIndex = normalizedJobSkills.indexOf(normalize(a));

    const bIndex = normalizedJobSkills.indexOf(normalize(b));

    const aMatched = aIndex !== -1;
    const bMatched = bIndex !== -1;

    if (aMatched && !bMatched) {
      return -1;
    }

    if (!aMatched && bMatched) {
      return 1;
    }

    if (aMatched && bMatched) {
      return aIndex - bIndex;
    }

    return 0;
  });

  const sortedExperience = resume.experience.map((experience) => {
    const sortedResponsibilities = [...experience.responsibilities].sort(
      (a, b) => {
        const aScore = scoreText(a, jobKeywords);

        const bScore = scoreText(b, jobKeywords);

        return bScore - aScore;
      },
    );

    return {
      ...experience,
      responsibilities: sortedResponsibilities,
    };
  });

  sortedExperience.sort((a, b) => {
    const aText = [a.role, a.company, ...a.responsibilities].join(" ");

    const bText = [b.role, b.company, ...b.responsibilities].join(" ");

    return scoreText(bText, jobKeywords) - scoreText(aText, jobKeywords);
  });

  const sortedProjects = [...resume.projects].sort((a, b) => {
    const aText = [a.name, a.description, ...a.technologies].join(" ");

    const bText = [b.name, b.description, ...b.technologies].join(" ");

    return scoreText(bText, jobKeywords) - scoreText(aText, jobKeywords);
  });

  let summary = resume.summary;

  if (!summary) {
    const relevantSkills = sortedSkills.slice(0, 5);

    if (relevantSkills.length > 0) {
      summary = `${job.jobTitle} candidate with experience in ${relevantSkills.join(", ")}.`;
    }
  }

  const result = {
    personalInfo: {
      ...resume.personalInfo,
    },

    summary,

    skills: sortedSkills,

    experience: sortedExperience,

    education: [...resume.education],

    projects: sortedProjects,

    certifications: [...resume.certifications],
  };

  return tailoredResumeSchema.parse(result);
};
