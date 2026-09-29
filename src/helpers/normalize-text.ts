const SKILL_ALIASES: Record<string, string> = {
  js: "javascript",
  "java script": "javascript",

  ts: "typescript",
  "type script": "typescript",

  reactjs: "react",
  "react.js": "react",

  nextjs: "next.js",
  "next js": "next.js",

  nodejs: "node.js",
  "node js": "node.js",

  expressjs: "express.js",
  "express js": "express.js",

  postgres: "postgresql",

  "rest api": "rest",

  "rest apis": "rest",

  "tailwind css": "tailwind",

  "redux toolkit": "redux",
};

export const normalizeText = (
  value: string,
): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ");
};

export const normalizeSkill = (
  value: string,
): string => {
  const normalized = normalizeText(value);

  return (
    SKILL_ALIASES[normalized] ??
    normalized
  );
};