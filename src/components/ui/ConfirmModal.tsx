"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {ConfirmModalProps} from "@/types"; // using your UI system dialog



export default function ConfirmModal({isOpen, title = "Are you sure?", description = "This action cannot be undone.", confirmText = "Confirm", cancelText = "Cancel", onCancel, onConfirm, loading = false,}: ConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="py-2 text-sm text-gray-600">{description}</div>

                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}