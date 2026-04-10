"use client";
import { Card, CardContent } from "@/components/ui/card";
import SocialLogin from "@/components/auth/SocialLogin";
import SignupForm from "@/components/auth/Signup";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted px-4">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col gap-8 p-8">
                    {/* Login form */}
                    <SignupForm />

                    {/* Social login buttons with extra padding */}
                    <div className="w-full flex items-center justify-center gap-4 px-2">
                        <SocialLogin />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}