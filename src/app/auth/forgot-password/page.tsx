"use client";

import {useMemo, useState} from "react";
import Link from "next/link";
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
    Mail,
    Loader2,
    CheckCircle2,
    ArrowLeft,
} from "lucide-react";

export default function ForgotPasswordPage() {
    const client = useMemo(() => createBrowserApiClient(), []);

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || loading) return;

        setLoading(true);

        try {
            await client.post("/auth/forgot-password", {
                email,
            });

            setSubmitted(true);

            toast.success(
                "Password reset instructions sent successfully!"
            );
        } catch (error) {
            toast.error(
                // error?.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleTryAnother = () => {
        setSubmitted(false);
        setEmail("");
    };

    const openMailProvider = () => {
        const domain = email.split("@")[1]?.toLowerCase();

        if (domain?.includes("gmail")) {
            window.open("https://mail.google.com", "_blank");
            return;
        }

        if (
            domain?.includes("outlook") ||
            domain?.includes("hotmail") ||
            domain?.includes("live")
        ) {
            window.open("https://outlook.live.com", "_blank");
            return;
        }

        if (domain?.includes("yahoo")) {
            window.open("https://mail.yahoo.com", "_blank");
            return;
        }

        window.open("https://mail.google.com", "_blank");
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/40 via-background to-muted/30 px-4">

            <AnimatePresence mode="wait">

                {submitted ? (

                    <motion.div
                        key="success"
                        initial={{opacity: 0, y: 15}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -15}}
                        transition={{duration: 0.25}}
                        className="w-full max-w-md"
                    >

                        <Card
                            className="rounded-3xl border border-border/50 shadow-xl backdrop-blur-sm bg-background/95">

                            <CardContent className="px-8 py-10 text-center space-y-6">

                                {/* Success Icon */}
                                <div
                                    className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                                    <CheckCircle2
                                        size={38}
                                        className="text-green-600"
                                    />
                                </div>

                                {/* Text */}
                                <div className="space-y-3">

                                    <h2 className="text-3xl font-bold tracking-tight">
                                        Check your email
                                    </h2>

                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        We sent password reset instructions to:
                                    </p>

                                    <div className="bg-muted rounded-xl px-4 py-3 break-all text-sm font-medium">
                                        {email}
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        The reset link may take a minute to arrive.
                                        Be sure to check your spam folder.
                                    </p>

                                </div>

                                {/* Actions */}
                                <div className="space-y-3 pt-2">

                                    <Button
                                        className="w-full h-11 text-sm font-medium"
                                        onClick={openMailProvider}
                                    >
                                        Open Email
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="w-full h-11 text-sm"
                                        onClick={handleTryAnother}
                                    >
                                        <ArrowLeft size={16}/>
                                        Try another email
                                    </Button>

                                </div>

                            </CardContent>

                        </Card>

                    </motion.div>

                ) : (

                    <motion.div
                        key="form"
                        initial={{opacity: 0, y: 15}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -15}}
                        transition={{duration: 0.25}}
                        className="w-full max-w-md"
                    >

                        <Card
                            className="rounded-3xl border border-border/50 shadow-xl backdrop-blur-sm bg-background/95">

                            <CardHeader className="space-y-3 text-center px-8 pt-8">

                                <div
                                    className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                                    <Mail
                                        size={30}
                                        className="text-blue-600"
                                    />
                                </div>

                                <div className="space-y-2">

                                    <CardTitle className="text-3xl font-bold tracking-tight">
                                        Forgot password
                                    </CardTitle>

                                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                                        Enter your email and we’ll send you a secure
                                        password reset link.
                                    </CardDescription>

                                </div>

                            </CardHeader>

                            <CardContent className="px-8 pb-8">

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >

                                    {/* Email Field */}
                                    <div className="space-y-5">

                                        <label className="text-sm font-medium text-muted-foreground">
                                            Email address
                                        </label>

                                        <div className="relative ">

                                            <Mail
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground mb-5"
                                            />

                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                required
                                                autoComplete="email"
                                                className="h-12 pl-10 rounded-xl"
                                            />

                                        </div>

                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={!email || loading}
                                        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
                                    >

                                        {loading ? (

                                            <span className="flex items-center gap-2">
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                Sending reset link...
                                            </span>

                                        ) : (
                                            "Send reset link"
                                        )}

                                    </Button>

                                </form>

                                {/* Footer */}
                                <div className="pt-6 space-y-4">

                                    <p className="text-xs text-center leading-relaxed text-muted-foreground">
                                        If an account exists with this email,
                                        you’ll receive password reset instructions.
                                    </p>

                                    <Link
                                        href="/auth/signin"
                                        className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Back to login
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