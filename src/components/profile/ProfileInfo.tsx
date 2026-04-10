"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import FloatingInput from "@/components/ui/FloatingInput";

interface ProfileInfoProps {
    user: User;
    onEditClick: (field: string) => void;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, onEditClick }) => {
    const [editableValues, setEditableValues] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        role: "",
        verified: "",
    });

    useEffect(() => {
        if (!user) return;
        setEditableValues({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
            email: user.email || "",
            role: user.role || "",
            verified: user.is_verified ? "Verified" : "Not Verified",
        });
    }, [user]);

    const handleChange = (field: keyof typeof editableValues, val: string) => {
        setEditableValues((prev) => ({ ...prev, [field]: val }));
    };

    return (
        <div className="mb-20 flex flex-col w-full max-w-5xl mx-auto space-y-8 transition-colors duration-300">
            {/* Avatar */}
            <div className="flex flex-col items-center">
                <Avatar className="w-28 h-28 mb-2">
                    {user.avatar ? (
                        <AvatarImage src={user.avatar} />
                    ) : (
                        <AvatarFallback className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                            {user.firstName?.[0] || "U"}
                        </AvatarFallback>
                    )}
                </Avatar>
                <Button
                    size="sm"
                    onClick={() => onEditClick("avatar")}
                    className="dark:bg-gray-800 dark:text-gray-100"
                >
                    Edit Info
                </Button>
            </div>

            {/* Profile Fields Grid */}
            <div className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-md shadow-sm p-6 transition-colors duration-300">
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <FloatingInput
                        label="First Name"
                        value={editableValues.firstName}
                        onChange={(val) => handleChange("firstName", val)}
                        className="dark:bg-[#121212] dark:text-gray-200 dark:border-gray-600"
                    />
                    <FloatingInput
                        label="Last Name"
                        value={editableValues.lastName}
                        onChange={(val) => handleChange("lastName", val)}
                        className="dark:bg-[#121212] dark:text-gray-200 dark:border-gray-600"
                    />
                    <FloatingInput
                        label="Phone"
                        value={editableValues.phone}
                        onChange={(val) => handleChange("phone", val)}
                        className="dark:bg-[#121212] dark:text-gray-200 dark:border-gray-600"
                    />
                    <FloatingInput
                        label="Email"
                        value={editableValues.email}
                        onChange={(val) => handleChange("email", val)}
                        className="dark:bg-[#121212] dark:text-gray-200 dark:border-gray-600"
                    />
                    <FloatingInput
                        label="Role"
                        value={editableValues.role}
                        onChange={() => {}}
                        className="opacity-70 cursor-not-allowed dark:bg-[#1a1a1a] dark:text-gray-400 dark:border-gray-600"
                    />
                    <FloatingInput
                        label="Verified"
                        value={editableValues.verified}
                        onChange={() => {}}
                        className="opacity-70 cursor-not-allowed dark:bg-[#1a1a1a] dark:text-gray-400 dark:border-gray-600"
                    />
                </div>
            </div>
        </div>
    );
};