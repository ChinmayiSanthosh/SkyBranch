import {z} from "zod"

export const credentialsSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8,"Password must be at least 8 characters").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});