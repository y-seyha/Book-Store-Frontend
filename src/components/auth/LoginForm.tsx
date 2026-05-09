"use client";

import {useAuth} from "@/context/AuthContext";
import React, {useState} from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import Link from "next/link";
import {Eye, EyeOff} from "lucide-react";
import {loginInputSchema} from "@/types/schema";


export default function LoginForm() {
    const {login} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            email: email.trim().toLowerCase(),
            password,
        };

        const result = loginInputSchema.safeParse(data);

        if (!result.success) {
            toast.error(result.error.issues[0]?.message || "Invalid input");
            setLoading(false);
            return;
        }

        try {
            const user = await login(result.data);

            toast.success("Login successful", {
                description: `Welcome back ${user.firstName} ${user.lastName}!`,
            });

        } catch (err: any) {
            toast.error("Login failed", {
                description: "Invalid email or password",
            });
        } finally {
            setLoading(false);
        }
    };

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
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Password</Label>

                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />

                            <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || !email || !password}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-2 flex flex-col gap-1">
                        <div>
                            Don’t have an account?{" "}
                            <Link href="/auth/signup" className="text-blue-600 hover:underline">
                                Register
                            </Link>
                        </div>

                        <Link
                            href="/auth/forgot-password"
                            className="text-blue-600 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>


                </form>
            </CardContent>


        </Card>
    );
}