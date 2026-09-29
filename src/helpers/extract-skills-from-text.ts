import { normalizeSkill, normalizeText } from "./normalize-text";

const COMMON_SKILLS = [
  "javascript",
  "typescript",
  "react",
  "next.js",
  "node.js",
  "express.js",
  "vue",
  "angular",
  "redux",
  "graphql",
  "rest",
  "postgresql",
  "mysql",
  "mongodb",
  "prisma",
  "sequelize",
  "redis",
  "docker",
  "aws",
  "git",
  "github",
  "tailwind",
  "html",
  "css",
  "figma",
  "jest",
  "cypress",
  "playwright",
  "python",
  "java",
  "c++",
];

export const extractSkillsFromText = (values: string[]): string[] => {
  const result: string[] = [];

  for (const value of values) {
    const normalized = normalizeText(value);

    for (const skill of COMMON_SKILLS) {
      if (normalized.includes(normalizeText(skill))) {
        result.push(normalizeSkill(skill));
      }
    }

    if (
      !normalized.includes("experience") &&
      !normalized.includes("year") &&
      normalized.split(" ").length <= 3
    ) {
      result.push(normalizeSkill(value));
    }
  }

  return [...new Set(result)];
};
