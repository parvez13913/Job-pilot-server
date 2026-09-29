import { z } from "zod";

export const createAnalysisSchema = z.object({
  resumeId: z.string({ error: "Resume ID is required" }),
  jobId: z.string({ error: "Job ID is required" }),
});

export const analysisResultSchema = z.object({
  matchScore: z.number().min(0).max(100),

  matchedSkills: z.array(
    z.object({
      skill: z.string(),
      evidence: z.string(),
    }),
  ),

  missingSkills: z.array(
    z.object({
      skill: z.string(),
      importance: z.enum(["required", "preferred"]),
      reason: z.string(),
    }),
  ),

  experienceGaps: z.array(z.string()),

  keywords: z.array(z.string()),

  recommendations: z.array(
    z.object({
      section: z.string(),
      recommendation: z.string(),
    }),
  ),
});
