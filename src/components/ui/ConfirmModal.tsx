"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmModalProps } from "@/types";

export default function ConfirmModal({
                                         isOpen,
                                         title = "Are you sure?",
                                         description = "This action cannot be undone.",
                                         confirmText = "Confirm",
                                         cancelText = "Cancel",
                                         onCancel,
                                         onConfirm,
                                         loading = false,
                                     }: ConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent
                className="
          max-w-sm
          rounded-xl
          bg-white dark:bg-zinc-900
          border border-gray-200 dark:border-zinc-800
          shadow-lg
        "
            >
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2 text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                        className="
              border-gray-300 dark:border-zinc-700
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-zinc-800
            "
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                        className="min-w-[100px]"
                    >
                        {loading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}