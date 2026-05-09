"use client";

import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";

export default function VerifySuccessClient() {
    const params = useSearchParams();
    const router = useRouter();

    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        setSuccess(params.get("success") === "true");
    }, [params]);

    useEffect(() => {
        let timeout1: NodeJS.Timeout;
        let timeout2: NodeJS.Timeout;

        if (success === null) return;

        if (success) {
            timeout1 = setTimeout(() => {
                toast.success("Email verified successfully");
            }, 100);

            timeout2 = setTimeout(() => {
                router.replace("/");
            }, 2000);
        } else {
            timeout1 = setTimeout(() => {
                router.replace("/auth/signin");
            }, 4000);
        }

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, [success, router]);

    if (success === null) {
        return null; // or loading UI
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted text-foreground">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-8 text-center">
                {success ? (
                    <State
                        icon={<Check/>}
                        title="Email verified"
                        desc="Redirecting..."
                    />
                ) : (
                    <State
                        icon={<X/>}
                        title="Verification failed"
                        desc="Redirecting..."
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

function Check() {
    return <span className="text-green-500 text-xl">✓</span>;
}

function X() {
    return <span className="text-red-500 text-xl">✕</span>;
}