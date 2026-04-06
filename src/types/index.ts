import {z} from 'zod'

import {
    userSchema,
    loginInputSchema,
    loginResponseSchema,
    registerInputSchema,
    registerResponseSchema,
} from "./schema";
import React from "react";

export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;



export type socialProvider = {
    name: string;
    icon: React.ComponentType<any>;
    key: "google" | "github" | "facebook";
};