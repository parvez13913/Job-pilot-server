import { z } from "zod";

export const createCoverLetterSchema = z.object({
  resumeId: z.string({ error: "Resume ID is required" }),

  jobId: z.string({ error: "Job ID is required" }),

  tone: z
    .enum(["professional", "confident", "enthusiastic"])
    .default("professional"),

  length: z.enum(["short", "medium", "long"]).default("medium"),
});

export const updateCoverLetterSchema = z.object({
  content: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(10000, "Cover letter cannot exceed 10000 characters"),
});

export type CreateCoverLetterInput = z.infer<typeof createCoverLetterSchema>;

export type UpdateCoverLetterInput = z.infer<typeof updateCoverLetterSchema>;
