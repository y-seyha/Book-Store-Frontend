"use client";

import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { socialProvider } from "@/types";

const providers: socialProvider[] = [
    { name: "Google", icon: FaGoogle, key: "google" },
    { name: "GitHub", icon: FaGithub, key: "github" },
    { name: "Facebook", icon: FaFacebook, key: "facebook" },
];

export default function SocialLogin() {
    const { socialLogin } = useAuth();

    return (
        <div className="w-full flex flex-col sm:flex-row gap-3">
            {providers.map(({ name, icon: Icon, key }) => (
                <Button
                    key={key}
                    variant="outline"
                    aria-label={`Sign in with ${name}`}
                    className="flex items-center justify-center gap-2 w-full transition-transform hover:scale-105 focus:scale-105"
                    onClick={() => socialLogin(key)}
                >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1 text-center">Sign in with {name}</span>
                </Button>
            ))}
        </div>
    );
}