"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import MainLayout from "@/components/layout/MainLayout";

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    if (!user)
        return (
            <p className="text-center mt-20 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Loading...
            </p>
        );

    return (
        <MainLayout>
            <div className="mt-20 flex justify-center items-start w-full p-6 bg-gray-50 dark:bg-[#121212]  transition-colors duration-300">
                <div className="w-full max-w-5xl transition-colors duration-300">
                    <ProfileInfo user={user} onEditClick={() => setModalOpen(true)} />
                </div>
            </div>

            <EditProfileModal
                user={user}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={() => refreshUser()}
                // className="dark:bg-[#121212] dark:text-gray-200 transition-colors duration-300"
            />
        </MainLayout>
    );
}