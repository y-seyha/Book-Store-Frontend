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
import { RegisterInput } from "@/types";
import Link from "next/link";

export default function SignupForm() {
    const { register } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                email,
                password,
                firstName,
                lastName,
            };

            console.log("Register request payload:", data);
            await register(data);

            toast.success("Account created!", {
                description: `Welcome, ${firstName}! You can now log in.`,
                action: {
                    label: "Continue",
                    onClick: () => console.log("User clicked Continue"),
                },
            });

            // Optionally reset form
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
        } catch (err: any) {
            toast.error("Signup failed", {
                description: err?.message || "Please check your inputs and try again.",
                action: {
                    label: "Retry",
                    onClick: () => console.log("Retry signup"),
                },
            });
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
                    <div className="flex flex-col gap-2">
                        <Label>First Name</Label>
                        <Input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Last Name</Label>
                        <Input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter your last name"
                            required
                        />
                    </div>

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
                        {loading ? "Creating account..." : "Sign Up"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-2">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-blue-600 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}