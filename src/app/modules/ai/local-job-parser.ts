import { IParsedJob } from "./ai.interface";

const COMMON_TECHNOLOGIES = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "NestJS",
  "Vue.js",
  "Angular",
  "Redux",
  "Redux Toolkit",
  "React Query",
  "TanStack Query",
  "REST API",
  "GraphQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Prisma",
  "Sequelize",
  "Redis",
  "Docker",
  "AWS",
  "Git",
  "GitHub",
  "Tailwind CSS",
  "Bootstrap",
  "HTML",
  "CSS",
  "Figma",
  "Jest",
  "Cypress",
  "Playwright",
  "Python",
  "Java",
  "C++",
  "PHP",
  "Laravel",
];

const findSkills = (text: string): string[] => {
  const lowerText = text.toLowerCase();

  return COMMON_TECHNOLOGIES.filter((skill) =>
    lowerText.includes(skill.toLowerCase()),
  );
};

const findExperienceYears = (text: string): number | null => {
  const patterns = [
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience/i,
    /experience\s*(?:of)?\s*(\d+)\+?\s*(?:years?|yrs?)/i,
    /minimum\s*(?:of)?\s*(\d+)\+?\s*(?:years?|yrs?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return null;
};

const extractSection = (text: string, sectionNames: string[]): string[] => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const startIndex = lines.findIndex((line) =>
    sectionNames.some((section) =>
      line.toLowerCase().includes(section.toLowerCase()),
    ),
  );

  if (startIndex === -1) {
    return [];
  }

  const result: string[] = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const currentLine = lines[i];

    // Stop when another obvious heading appears
    if (
      /^(requirements?|qualifications?|responsibilities?|preferred|skills?|education|experience|benefits?|about us|what you.?ll do)/i.test(
        currentLine,
      )
    ) {
      break;
    }

    result.push(currentLine.replace(/^[-•*]\s*/, "").trim());
  }

  return result;
};

export const parseJobLocally = (
  jobTitle: string,
  jobDescription: string,
): IParsedJob => {
  const text = jobDescription.trim();

  const allSkills = findSkills(text);

  const experienceYears = findExperienceYears(text);

  const requiredSkills = extractSection(text, [
    "requirements",
    "required skills",
    "required qualifications",
    "must have",
  ]).filter(Boolean);

  const preferredSkills = extractSection(text, [
    "preferred skills",
    "preferred qualifications",
    "nice to have",
    "good to have",
  ]).filter(Boolean);

  const responsibilities = extractSection(text, [
    "responsibilities",
    "what you'll do",
    "what you will do",
    "key responsibilities",
    "duties",
  ]).filter(Boolean);

  const qualifications = extractSection(text, [
    "qualifications",
    "requirements",
    "education",
  ]).filter(Boolean);

  return {
    jobTitle,

    requiredSkills: requiredSkills.length > 0 ? requiredSkills : allSkills,

    preferredSkills,

    experienceYears,

    responsibilities,

    qualifications,

    keywords: allSkills,
  };
};
