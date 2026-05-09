"use client";

import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {apiPost, createBrowserApiClient} from "@/lib/api.helper";
import {authEvent} from "@/lib/socket";
import {toast} from "sonner";

const api = createBrowserApiClient();

type Status = "loading" | "success" | "error";

export default function OAuthSuccessPage() {
    const params = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState<Status>("loading");

    useEffect(() => {
        let mounted = true;

        const run = async () => {
            const accessToken = params.get("accessToken");
            const refreshToken = params.get("refreshToken");

            if (!accessToken || !refreshToken) {
                if (!mounted) return;

                setStatus("error");

                setTimeout(() => {
                    router.replace("/");
                }, 1200);

                return;
            }

            try {
                await apiPost(api, "/auth/set-cookie", {
                    accessToken,
                    refreshToken,
                });

                if (!mounted) return;

                authEvent.dispatchEvent(new Event("refresh"));

                setStatus("success");

                toast.success("Login successful 🎉");

                setTimeout(() => {
                    router.replace("/");
                }, 1200);

            } catch (err) {
                console.error("OAuth error:", err);

                if (!mounted) return;

                setStatus("error");

                toast.error("Authentication failed");

                setTimeout(() => {
                    router.replace("/");
                }, 5000);
            }
        };

        run();

        return () => {
            mounted = false;
        };
    }, [params, router]);

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted text-foreground">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-8 text-center">

                {status === "loading" && (
                    <State
                        icon={<Spinner/>}
                        title="Signing you in"
                        desc="Please wait while we complete authentication..."
                    />
                )}

                {status === "success" && (
                    <State
                        icon={<Check/>}
                        title="Login successful"
                        desc="Redirecting you to homepage..."
                    />
                )}

                {status === "error" && (
                    <State
                        icon={<X/>}
                        title="Authentication failed"
                        desc="Redirecting back..."
                    />
                )}

            </div>
        </div>
    );
}


function State({icon, title, desc}: any) {
    return (
        <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                {icon}
            </div>

            <h1 className="text-xl font-semibold">{title}</h1>

            <p className="text-sm text-muted-foreground mt-2">{desc}</p>
        </>
    );
}

function Spinner() {
    return (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"/>
    );
}

function Check() {
    return <span className="text-green-500 text-xl">✓</span>;
}

function X() {
    return <span className="text-red-500 text-xl">✕</span>;
}