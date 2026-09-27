import { IParsedResume } from "./ai.interface";

const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "MongoDB",
  "Prisma",
  "GraphQL",
  "Redux",
  "Redux Toolkit",
  "Tailwind CSS",
  "Git",
  "Docker",
  "AWS",
  "Python",
  "Java",
  "C++",
  "HTML",
  "CSS",
];

export const parseResumeLocally = (rawText: string): IParsedResume => {
  const text = rawText.trim();

  const email =
    text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;

  const phone = text.match(/(?:\+?880|0)?1[3-9]\d{8}/)?.[0] ?? null;

  const skills = COMMON_SKILLS.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase()),
  );

  const firstLines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const possibleName = firstLines.length > 0 ? firstLines[0] : null;

  return {
    personalInfo: {
      name: possibleName,
      email,
      phone,
      location: null,
    },

    summary: null,

    skills,

    experience: [],

    education: [],

    projects: [],

    certifications: [],
  };
};
