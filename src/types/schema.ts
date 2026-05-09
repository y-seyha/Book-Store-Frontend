import {z} from "zod";

export const userSchema = z
    .object({
        id: z.string(),
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        role: z.enum(["customer", "admin", "seller"]).optional(),
        phone: z.string().nullable().optional(),
        avatar: z.string().nullable().optional(),
        is_verified: z.boolean().optional(),
    })
    .passthrough()
    .transform((user) => ({
        ...user,
        firstName: (user as any).first_name ?? (user as any).firstName ?? "",
        lastName: (user as any).last_name ?? (user as any).lastName ?? "",
        avatar: (user as any).avatar_url ?? (user as any).avatar ?? null,
        is_verified: (user as any).is_verified ?? false,
    }));

export const loginInputSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email format")
        .max(255, "Email is too long"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password is too long")
});

export const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: userSchema,
});

export const registerInputSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .email("Invalid email format")
        .max(255, "Email is too long"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password is too long")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/[a-z]/, "Must include at least one lowercase letter")
        .regex(/[0-9]/, "Must include at least one number"),

    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(50, "First name is too long")
        .regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in first name"),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(50, "Last name is too long")
        .regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in last name"),
});
export const registerResponseSchema = z.object({
    message: z.string(),
    user: userSchema,
});