import { z } from "zod";

export const signUpPostRequestSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50),

  lastName: z.string().trim().max(50).optional(),

  email: z.string().trim().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

export const loginPostRequestBodySchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters long."),
});