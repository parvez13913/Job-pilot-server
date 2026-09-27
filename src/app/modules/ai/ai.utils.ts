import config from "../../../config";
import { gemini } from "../../../config/gemini";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const err = error as {
    status?: number;
    code?: number;
  };

  return (
    err.status === 503 ||
    err.code === 503 ||
    err.status === 429 ||
    err.code === 429
  );
};

export const generateWithGemini = async ({
  prompt,
  responseSchema,
}: {
  prompt: string;
  responseSchema: unknown;
}) => {
  const models = [config.gemini.model, config.gemini.fallbackModel].filter(
    Boolean,
  );

  let lastError: unknown;

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(`Trying Gemini model: ${model}, attempt: ${attempt + 1}`);

        const response = await gemini.models.generateContent({
          model,

          contents: prompt,

          config: {
            responseMimeType: "application/json",
            responseSchema,
          },
        });

        return response;
      } catch (error) {
        lastError = error;

        if (!isRetryableError(error)) {
          throw error;
        }

        const delay = 1000 * 2 ** attempt;

        console.log(`Gemini ${model} unavailable. Retrying in ${delay}ms...`);

        await sleep(delay);
      }
    }
  }

  throw lastError;
};

export const normalizeStringArray = (
  value: unknown,
): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string",
  );
};

export const normalizeNumber = (
  value: unknown,
): number | null => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
};

export const normalizeParsedResume = (
  data: unknown,
) => {
  const raw =
    data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : {};

  const personalInfo =
    raw.personalInfo &&
    typeof raw.personalInfo === "object"
      ? (raw.personalInfo as Record<string, unknown>)
      : {};

  const experience = Array.isArray(raw.experience)
    ? raw.experience.map((item) => {
        const experienceItem =
          item && typeof item === "object"
            ? (item as Record<string, unknown>)
            : {};

        return {
          company:
            typeof experienceItem.company === "string"
              ? experienceItem.company
              : "",

          role:
            typeof experienceItem.role === "string"
              ? experienceItem.role
              : "",

          startDate:
            typeof experienceItem.startDate === "string"
              ? experienceItem.startDate
              : null,

          endDate:
            typeof experienceItem.endDate === "string"
              ? experienceItem.endDate
              : null,

          responsibilities: normalizeStringArray(
            experienceItem.responsibilities,
          ),
        };
      })
    : [];

  const education = Array.isArray(raw.education)
    ? raw.education.map((item) => {
        const educationItem =
          item && typeof item === "object"
            ? (item as Record<string, unknown>)
            : {};

        return {
          institution:
            typeof educationItem.institution === "string"
              ? educationItem.institution
              : "",

          degree:
            typeof educationItem.degree === "string"
              ? educationItem.degree
              : "",

          field:
            typeof educationItem.field === "string"
              ? educationItem.field
              : null,

          startDate:
            typeof educationItem.startDate === "string"
              ? educationItem.startDate
              : null,

          endDate:
            typeof educationItem.endDate === "string"
              ? educationItem.endDate
              : null,
        };
      })
    : [];

  const projects = Array.isArray(raw.projects)
    ? raw.projects.map((item) => {
        const project =
          item && typeof item === "object"
            ? (item as Record<string, unknown>)
            : {};

        return {
          name:
            typeof project.name === "string"
              ? project.name
              : "",

          description:
            typeof project.description === "string"
              ? project.description
              : "",

          technologies: normalizeStringArray(
            project.technologies,
          ),
        };
      })
    : [];

  return {
    personalInfo: {
      name:
        typeof personalInfo.name === "string"
          ? personalInfo.name
          : null,

      email:
        typeof personalInfo.email === "string"
          ? personalInfo.email
          : null,

      phone:
        typeof personalInfo.phone === "string"
          ? personalInfo.phone
          : null,

      location:
        typeof personalInfo.location === "string"
          ? personalInfo.location
          : null,
    },

    summary:
      typeof raw.summary === "string"
        ? raw.summary
        : null,

    skills: normalizeStringArray(raw.skills),

    experience,

    education,

    projects,

    certifications: normalizeStringArray(
      raw.certifications,
    ),
  };
};

export const normalizeParsedJob = (
  data: unknown,
) => {
  const raw =
    data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : {};

  return {
    jobTitle:
      typeof raw.jobTitle === "string"
        ? raw.jobTitle
        : "",

    requiredSkills: normalizeStringArray(
      raw.requiredSkills,
    ),

    preferredSkills: normalizeStringArray(
      raw.preferredSkills,
    ),

    experienceYears: normalizeNumber(
      raw.experienceYears,
    ),

    responsibilities: normalizeStringArray(
      raw.responsibilities,
    ),

    qualifications: normalizeStringArray(
      raw.qualifications,
    ),

    keywords: normalizeStringArray(
      raw.keywords,
    ),
  };
};
