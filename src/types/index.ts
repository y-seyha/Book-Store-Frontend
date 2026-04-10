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

export type Product = {
    id: number | string;
    name: string;
    description: string;
    price: string;
    stock: number;
    category?: { id: number; name: string };
    image_url?: string;
    images?: string[];
    user?: { first_name: string; last_name: string; email: string };
};


export interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onCancel: () => void;
    onConfirm: () => void;
    loading?: boolean;
}