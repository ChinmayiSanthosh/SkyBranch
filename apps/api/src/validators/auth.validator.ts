import {z} from "zod"

export const credentialsSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8,"Password must be at least 8 characters").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(72),
});