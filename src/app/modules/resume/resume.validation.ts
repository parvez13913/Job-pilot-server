import { z } from "zod";

export const createResumeSchema = z.object({
  body: z.object({
    name: z.string({error: "Name is required"}),
  }),
});

export const updateResumeSchema = z.object({
  body: z.object({
    name: z.string({error: "Name is required"}),
  }),
});
