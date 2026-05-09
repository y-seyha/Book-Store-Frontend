"use client";

import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {
    User,
    LoginInput,
    RegisterInput,
} from "@/types";
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
import {authEvent} from "@/lib/socket";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (data: LoginInput) => Promise<User>;
    register: (data: RegisterInput) => Promise<User>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    socialLogin: (provider: "google" | "github" | "facebook") => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const pathname = usePathname()
    const router = useRouter();
    const client = React.useMemo(() => createBrowserApiClient(), []);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (data: LoginInput): Promise<User> => {
        loginInputSchema.parse(data);
        const res = await apiPost<LoginInput, unknown>(client, "/auth/login", data);
        const parsed = loginResponseSchema.parse(res);
        setUser(parsed.user);


        if (pathname !== "/") {
            router.push("/");
        }

        return parsed.user;
    };

    const register = async (data: RegisterInput): Promise<User> => {
        try {
            const validData = registerInputSchema.parse(data);
            const res = await apiPost<RegisterInput, unknown>(
                client,
                "/auth/register",
                validData
            );

            const parsed = registerResponseSchema.parse(res);

            setUser(parsed.user);
            return parsed.user;

        } catch (err) {
            console.error("Register error:", err);
            throw err;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await apiPost(client, '/auth/logout', null, {withCredentials: true});
            setUser(null);
            toast.success('Logout Successfully');
            window.location.href = '/auth/signin';
        } catch (err) {
            console.error('Logout failed:', err);
            toast.error('Failed to logout');
        }
    };

    const refreshUser = React.useCallback(async () => {
        try {
            const res = await apiGet<{ user: unknown }>(client, "/auth/me");
            const parsedUser = userSchema.parse(res.user);
            setUser(parsedUser);
        } catch (err) {
            console.error("refreshUser error:", err);
            setUser(null);
        }
    }, [client]);

    const socialLogin = async (provider: "google" | "github" | "facebook") => {
        toast.loading(`Redirecting to ${provider}...`);
        window.location.href = `${API_BASE_URL}/auth/${provider}`;
    };

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const login = params.get("login");

                if (login === "success") {
                    toast.success("Login successful");
                    router.replace("/");
                }

                await refreshUser();
            } finally {
                if (mounted) setLoading(false);
            }
        };

        void init();

        return () => {
            mounted = false;
        };
    }, [router, refreshUser]);

    useEffect(() => {
        const handler = () => {
            void refreshUser(); // ignore promise safely
        };

        authEvent.addEventListener("refresh", handler);

        return () => {
            authEvent.removeEventListener("refresh", handler);
        };
    }, [refreshUser]);

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout, refreshUser, socialLogin}}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};