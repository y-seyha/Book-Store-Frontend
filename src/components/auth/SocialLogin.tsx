"use client";


import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";

export default function SocialLogin() {
    const { socialLogin } = useAuth();

    return (
        <div className="flex gap-2">
            <Button
                onClick={() => socialLogin("google")}
                className="flex items-center gap-2"
            >
                <FaGoogle /> Google
            </Button>
            <Button
                onClick={() => socialLogin("github")}
                className="flex items-center gap-2"
            >
                <FaGithub /> GitHub
            </Button>
            <Button
                onClick={() => socialLogin("facebook")}
                className="flex items-center gap-2"
            >
                <FaFacebook /> Facebook
            </Button>
        </div>
    );
}