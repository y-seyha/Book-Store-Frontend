"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { apiPost, createBrowserApiClient } from "@/lib/api.helper";
import { toast } from "sonner";

interface EditProfileModalProps {
    user: User;
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, open, onClose, onSaved }) => {
    const client = createBrowserApiClient();
    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [phone, setPhone] = useState(user.phone || "");

    useEffect(() => {
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setPhone(user.phone || "");
    }, [user]);

    const saveChanges = async () => {
        try {
            // await apiPost(client, "/profile/update", { first_name: firstName, last_name: lastName, phone });
            toast.dismiss();
            toast.success("Coming soon", {
                position: "top-center",
                icon: "⏳",
                style: {
                    background: "#1f2937", // dark bg
                    color: "#fff",          // white text
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                },
                duration: 3000,
            });
            onSaved();
            onClose();
        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">First Name</label>
                        <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Last Name</label>
                        <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Phone</label>
                        <Input
                            value={phone || ""}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors" onClick={saveChanges}>
                        Save Changes
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};