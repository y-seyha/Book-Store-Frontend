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

export type DeliveryStatus =
    | "preparing"
    | "picked_up"
    | "on_the_way"
    | "delivered"
    | "cancelled";

export type Payment = {
    id: number;
    status: "pending" | "success" | "failed";
    method: "cod" | "aba" | "card" | string;
    paid_at?: string;
};

export type DriverProfile = {
    vehicle_type: string;
    plate_number?: string;
    user: {
        first_name: string;
        last_name: string;
        phone: string;
    };
};

export type DeliveryTracking = {
    id: number;
    status: DeliveryStatus;
    driverProfile?: DriverProfile;
};

export type OrderStatus =
    | "pending"
    | "paid"
    | "shipped"
    | "completed"
    | "cancelled";

export type Order = {
    id: number;
    status: OrderStatus;
    total_price: number;

    created_at: string;
    updated_at?: string;

    shipping_name?: string;
    shipping_phone?: string;
    shipping_address?: string;
    shipping_city?: string;

    payments?: Payment[];
    tracking?: DeliveryTracking;

    items: {
        id: number;
        quantity: number;
        product: {
            name: string;
            price: number;
        };
    }[];
};