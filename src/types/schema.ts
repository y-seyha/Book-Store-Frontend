import { z } from "zod";

export const userSchema = z
    .object({
        id: z.string(),
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        role: z.enum(["customer"]).optional(),
        phone: z.string().nullable().optional(),
        avatar: z.string().nullable().optional(),
    })
    .transform((user) => ({
        ...user,
        firstName: (user as any).first_name ?? (user as any).firstName ?? "",
        lastName: (user as any).last_name ?? (user as any).lastName ?? "",
        avatar: (user as any).avatar_url ?? (user as any).avatar ?? null,
    }));

export const loginInputSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: userSchema,
});

export const registerInputSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
});

export const registerResponseSchema = z.object({
    message: z.string(),
    user: userSchema,
});