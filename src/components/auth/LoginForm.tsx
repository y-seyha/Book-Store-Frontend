"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {toast} from "sonner";
import Link from "next/link";


export default function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await login({ email, password })

            toast.success("Login successful", {
                description: `Welcome back, ${email}!`,
                action: {
                    label: "Continue",
                    onClick: () => console.log("User clicked Continue"),
                },
            })
        } catch (err: any) {
            toast.error("Login failed", {
                description: err?.message || "Check your credentials and try again.",
                action: {
                    label: "Retry",
                    onClick: () => console.log("Retry login"),
                },
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <Card className="w-full max-w-sm mx-auto shadow-lg space-y-5">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>
                    Sign in to your account and continue your journey
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-2">
                        Does not have an account?{" "}
                        <Link href="/signup" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </div>
                </form>
            </CardContent>


        </Card>
    );
}