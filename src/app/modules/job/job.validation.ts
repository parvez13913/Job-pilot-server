import { z } from "zod";

export const createJobSchema = z.object({
  body: z.object({
    title: z.string({ error: "Job title is required" }),

    company: z.string({ error: "Company name is required" }),

    description: z.string({ error: "Job description is required" }),
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string({ error: "Job title is required" }).min(2).optional(),

    company: z.string({ error: "Company name is required" }).optional(),

    description: z.string({ error: "Job description is required" }).optional(),
  }),
});
