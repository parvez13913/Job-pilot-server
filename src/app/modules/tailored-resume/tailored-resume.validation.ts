import { z } from "zod";

export const createTailoredResumeSchema = z.object({
  resumeId: z.string({ error: "Resume ID is required" }),

  jobId: z.string({ error: "Job ID is required" }),

  analysisId: z.string({ error: "Analysis ID is required" }),
});

export const tailoredResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    location: z.string().nullable(),
  }),

  summary: z.string().nullable(),

  skills: z.array(z.string()),

  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      responsibilities: z.array(z.string()),
    }),
  ),

  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
    }),
  ),

  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
    }),
  ),

  certifications: z.array(z.string()),
});
