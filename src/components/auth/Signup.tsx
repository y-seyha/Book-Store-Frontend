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
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import {registerInputSchema} from "@/types/schema";
import {z} from 'zod';

export default function SignupForm() {
    const { register } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                email: email.trim().toLowerCase(),
                password,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            };

            registerInputSchema.parse(data);

            const user = await register(data);

            toast.success("Account created!", {
                description: `Welcome ${user.firstName} ${user.lastName}!`,
            });

            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
        }catch (err: any) {
            console.error("Signup error:", err);

            if (err instanceof z.ZodError) {
                toast.error(err.issues[0].message);
                return;
            }

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message;

            if (message?.toLowerCase().includes("email")) {
                toast.error("Email already exists", {
                    description: "Try logging in instead.",
                });
                return;
            }

            toast.error(message || "Signup failed");

        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm mx-auto shadow-lg space-y-5">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>
                    Fill in the details below to get started
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* First Name */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            type="text"
                            autoComplete="given-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            type="text"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>

                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className="pr-10"
                                required
                            />

                            <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !email || !password || !firstName || !lastName}
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </Button>

                    {/* Redirect */}
                    <div className="text-center text-sm text-muted-foreground mt-2">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="text-blue-600 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}