import { z } from "zod";

const signUpZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string({ error: "Email is required" }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must be at most 100 characters long"),
  }),
});

export const AuthValidation = {
  signUpZodSchema,
};
