"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    User,
    LoginInput,
    RegisterInput, LoginResponse,
} from "@/types";
import { z } from "zod";
import {apiGet, apiPost, createBrowserApiClient} from "@/lib/api.helper";
import {loginInputSchema, loginResponseSchema, registerInputSchema, registerResponseSchema} from "@/types/schema";
import {usePathname, useRouter} from "next/navigation";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
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

    const logout = async () => {
        await apiPost<null, { message: string }>(client, "/auth/logout", null);
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const res = await apiGet<unknown>(client, "/auth/me");
            const parsed = z.object({ user: loginResponseSchema.shape.user }).parse({ user: res });
            setUser(parsed.user);
        } catch {
            setUser(null);
        }
    };

    const socialLogin = async (provider: "google" | "github" | "facebook"): Promise<void> => {
        window.location.href = `http://localhost:3000/auth/${provider}`;
        return Promise.resolve(); // satisfy TS
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