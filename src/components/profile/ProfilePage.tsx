"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiPost, createBrowserApiClient } from "@/lib/api.helper";

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const client = createBrowserApiClient();

    const [modalOpen, setModalOpen] = useState(false);
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [phone, setPhone] = useState(user?.phone || "");

    if (!user) return <p>Loading...</p>;

    const saveChanges = async () => {
        try {
            await apiPost(client, "/profile/update", { first_name: firstName, last_name: lastName, phone });
            setModalOpen(false);
            await refreshUser(); // refresh user data
        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
            <div className="flex flex-col items-center mb-4">
                <Avatar className="w-24 h-24 mb-2">
                    {user.avatar ? <AvatarImage src={user.avatar} /> : <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>}
                </Avatar>                <Button size="sm" onClick={() => setModalOpen(true)}>Edit Profile</Button>
            </div>

            <div className="space-y-2">
                <div><strong>Full Name:</strong> {`${user.firstName} ${user.lastName}`}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Phone:</strong> {user.phone || "-"}</div>
                <div><strong>Role:</strong> {user.role}</div>
                <div><strong>Verified:</strong> {user.is_verified ? "✅ Verified" : "❌ Not Verified"}</div>
            </div>

            {/* Edit Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-2">
                        <label>First Name</label>
                        <Input value={firstName} onChange={e => setFirstName(e.target.value)} />

                        <label>Last Name</label>
                        <Input value={lastName} onChange={e => setLastName(e.target.value)} />

                        <label>Phone</label>
                        <Input value={phone || ""} onChange={e => setPhone(e.target.value)} />
                    </div>

                    <DialogFooter>
                        <Button onClick={saveChanges}>Save Changes</Button>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}