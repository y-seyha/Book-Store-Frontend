"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";

import {motion, AnimatePresence} from "framer-motion";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {toast} from "sonner";

import {createBrowserApiClient} from "@/lib/api.helper";

import {
    Eye,
    EyeOff,
    Lock,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    AlertTriangle,
} from "lucide-react";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const client = useMemo(() => createBrowserApiClient(), []);

    const [token, setToken] = useState<string | null>(null);

    const [ready, setReady] = useState(false);
    const [invalidToken, setInvalidToken] = useState(false);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const t = searchParams.get("token");

        if (!t) {
            setInvalidToken(true);
        } else {
            setToken(t);
        }

        setReady(true);
    }, [searchParams]);

    const passwordsMatch =
        password.length > 0 &&
        confirm.length > 0 &&
        password === confirm;

    const passwordStrength =
        password.length >= 12
            ? "Strong"
            : password.length >= 8
                ? "Medium"
                : password.length > 0
                    ? "Weak"
                    : "";

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error(
                "Password must contain at least 6 characters"
            );
            return;
        }

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await client.post("/auth/reset-password", {
                token,
                newPassword: password,
            });

            setSuccess(true);

            toast.success(
                "Password reset successfully. Please sign in with your new password."
            );
        } catch (err) {
            toast.error(
                // err?.response?.data?.message ||
                "Password reset failed"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!ready) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/40 via-background to-muted/30">

                <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2
                        size={22}
                        className="animate-spin"
                    />

                    <span>Loading reset page...</span>
                </div>

            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/40 via-background to-muted/30 px-4 py-10">

            <AnimatePresence mode="wait">

                {/* SUCCESS STATE */}
                {success ? (

                    <motion.div
                        key="success"
                        initial={{opacity: 0, y: 15}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -15}}
                        transition={{duration: 0.25}}
                        className="w-full max-w-md"
                    >

                        <Card className="rounded-3xl border shadow-xl backdrop-blur-sm bg-background/95">

                            <CardContent className="px-8 py-10 text-center space-y-6">

                                <div
                                    className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                                    <CheckCircle2
                                        size={38}
                                        className="text-green-600"
                                    />
                                </div>

                                <div className="space-y-3">

                                    <h2 className="text-3xl font-bold tracking-tight">
                                        Password updated
                                    </h2>

                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Your password has been reset successfully.
                                        You can now sign in using your new password.
                                    </p>

                                </div>

                                <Button
                                    className="w-full h-11 rounded-xl"
                                    onClick={() =>
                                        router.push("/auth/signin")
                                    }
                                >
                                    Continue to sign in
                                </Button>

                            </CardContent>

                        </Card>

                    </motion.div>

                ) : invalidToken ? (

                    /* INVALID TOKEN STATE */
                    <motion.div
                        key="invalid"
                        initial={{opacity: 0, y: 15}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -15}}
                        transition={{duration: 0.25}}
                        className="w-full max-w-md"
                    >

                        <Card className="rounded-3xl border shadow-xl backdrop-blur-sm bg-background/95">

                            <CardContent className="px-8 py-10 text-center space-y-6">

                                <div
                                    className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center shadow-sm">
                                    <AlertTriangle
                                        size={38}
                                        className="text-red-600"
                                    />
                                </div>

                                <div className="space-y-3">

                                    <h2 className="text-3xl font-bold tracking-tight">
                                        Invalid reset link
                                    </h2>

                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        This password reset link is invalid,
                                        missing, or has expired.
                                    </p>

                                </div>

                                <Button
                                    className="w-full h-11 rounded-xl"
                                    onClick={() =>
                                        router.push("/auth/forgot-password")
                                    }
                                >
                                    Request new reset link
                                </Button>

                            </CardContent>

                        </Card>

                    </motion.div>

                ) : (

                    /* MAIN FORM */
                    <motion.div
                        key="form"
                        initial={{opacity: 0, y: 15}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -15}}
                        transition={{duration: 0.25}}
                        className="w-full max-w-md"
                    >

                        <Card className="rounded-3xl border shadow-xl backdrop-blur-sm bg-background/95">

                            <CardHeader className="space-y-4 text-center px-8 pt-8">

                                <div
                                    className="mx-auto w-18 h-18 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">

                                    <ShieldCheck
                                        size={34}
                                        className="text-blue-600"
                                    />

                                </div>

                                <div className="space-y-2">

                                    <CardTitle className="text-3xl font-bold tracking-tight">
                                        Reset password
                                    </CardTitle>

                                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                                        Create a new secure password for your account.
                                    </CardDescription>

                                </div>

                            </CardHeader>

                            <CardContent className="px-8 pb-8">

                                <form
                                    onSubmit={handleReset}
                                    className="space-y-5"
                                >

                                    {/* NEW PASSWORD */}
                                    <div className="space-y-2">

                                        <label className="text-sm font-medium text-muted-foreground">
                                            New password
                                        </label>

                                        <div className="relative">

                                            <Lock
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            />

                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                                className="h-12 pl-10 pr-10 rounded-xl"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword((p) => !p)
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={18}/>
                                                ) : (
                                                    <Eye size={18}/>
                                                )}
                                            </button>

                                        </div>

                                        {/* Password Strength */}
                                        {password && (
                                            <div className="flex items-center justify-between text-xs">

                                                <span className="text-muted-foreground">
                                                    Minimum 6 characters
                                                </span>

                                                <span
                                                    className={
                                                        passwordStrength === "Strong"
                                                            ? "text-green-600"
                                                            : passwordStrength === "Medium"
                                                                ? "text-yellow-600"
                                                                : "text-red-500"
                                                    }
                                                >
                                                    {passwordStrength}
                                                </span>

                                            </div>
                                        )}

                                    </div>

                                    {/* CONFIRM PASSWORD */}
                                    <div className="space-y-2">

                                        <label className="text-sm font-medium text-muted-foreground">
                                            Confirm password
                                        </label>

                                        <div className="relative">

                                            <Lock
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            />

                                            <Input
                                                type={
                                                    showConfirm
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={confirm}
                                                onChange={(e) =>
                                                    setConfirm(e.target.value)
                                                }
                                                placeholder="Re-enter password"
                                                autoComplete="new-password"
                                                className="h-12 pl-10 pr-10 rounded-xl"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirm((p) => !p)
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showConfirm ? (
                                                    <EyeOff size={18}/>
                                                ) : (
                                                    <Eye size={18}/>
                                                )}
                                            </button>

                                        </div>

                                        {/* Match Status */}
                                        {confirm.length > 0 && (
                                            <p
                                                className={`text-xs ${
                                                    passwordsMatch
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {passwordsMatch
                                                    ? "Passwords match"
                                                    : "Passwords do not match"}
                                            </p>
                                        )}

                                    </div>

                                    {/* SUBMIT BUTTON */}
                                    <Button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !password ||
                                            !confirm
                                        }
                                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
                                    >

                                        {loading ? (

                                            <span className="flex items-center gap-2">
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                Resetting password...
                                            </span>

                                        ) : (
                                            "Reset password"
                                        )}

                                    </Button>

                                </form>

                                {/* FOOTER */}
                                <div className="pt-6 space-y-4">

                                    <p className="text-xs text-center leading-relaxed text-muted-foreground">
                                        Use a strong password that you don’t use elsewhere.
                                    </p>

                                    <Link
                                        href="/auth/signin"
                                        className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Back to sign in
                                    </Link>

                                </div>

                            </CardContent>

                        </Card>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>
    );
}