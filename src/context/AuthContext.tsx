"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    User,
    LoginInput,
    RegisterInput, LoginResponse,
} from "@/types";
import { z } from "zod";
import {apiGet, apiPost, createBrowserApiClient} from "@/lib/api.helper";
import {
    loginInputSchema,
    loginResponseSchema,
    registerInputSchema,
    registerResponseSchema,
    userSchema
} from "@/types/schema";
import {usePathname, useRouter} from "next/navigation";
import {toast} from "sonner";
import {API_BASE_URL} from "@/lib/constant";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () =>Promise<void>;
    refreshUser: () => Promise<void>;
    socialLogin: (provider: "google" | "github" | "facebook") => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()
    const router = useRouter();
    const client = createBrowserApiClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const login = params.get("login");

        if (login === "success") {
            toast.success("Login successful 🎉");
            router.replace("/"); // clean URL
        }

        refreshUser().finally(() => setLoading(false));
    }, []);


    const login = async (data: LoginInput) => {
        loginInputSchema.parse(data);
        const res = await apiPost<LoginInput, unknown>(client, "/auth/login", data);
        const parsed = loginResponseSchema.parse(res);
        setUser(parsed.user);


        if (pathname !== "/") {
            router.push("/");
        }
    };

    const register = async (data: RegisterInput) => {
        registerInputSchema.parse(data);
        const res = await apiPost<RegisterInput, unknown>(client, "/auth/register", data);
        const parsed = registerResponseSchema.parse(res);
        setUser(parsed.user);

        router.push("/");
    };

    const logout = async (): Promise<void> => {
        try {
            await apiPost(client, '/auth/logout', null, { withCredentials: true });
            setUser(null);
            toast.success('Logout Successfully');
            window.location.href = '/auth/signin'; // force reload
        } catch (err) {
            console.error('Logout failed:', err);
            toast.error('Failed to logout');
        }
    };

    const refreshUser = async () => {
        try {
            const res = await apiGet<{ user: unknown }>(client, "/auth/me");
            console.log("API /auth/me response:", res);

            console.log("API /auth/me raw:", res);

            // Use the schema to parse and transform the API response
            const parsedUser = userSchema.parse(res.user);

            setUser(parsedUser);
            console.log("Parsed user:", parsedUser);
        } catch (err) {
            console.error("refreshUser error:", err);
            setUser(null);
        }
    };

    const socialLogin = async (provider: "google" | "github" | "facebook") => {
        toast.loading(`Redirecting to ${provider}...`);
        window.location.href = `${API_BASE_URL}/auth/${provider}`;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, socialLogin }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};