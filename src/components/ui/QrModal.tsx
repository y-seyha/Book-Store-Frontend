"use client";

import { Button } from "@/components/ui/button";

type Props = {
    open: boolean;
    onClose: () => void;
    qrImage: string | null;
    title?: string;
    size?: number;
};

export default function QrModal({
                                    open,
                                    onClose,
                                    qrImage,
                                    title,
                                    size = 220,
                                }: Props) {
    if (!open || !qrImage) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div
                className="
                    bg-white dark:bg-[#0f0f0f]
                    border border-gray-200 dark:border-gray-800
                    p-5 rounded-xl shadow-lg
                    w-[320px]
                "
            >
                {/* Title */}
                <h3 className="mb-3 font-semibold text-center text-gray-900 dark:text-gray-100">
                    {title || "QR Code"}
                </h3>

                {/* QR Image */}
                <div className="flex justify-center">
                    <img
                        src={qrImage}
                        alt="QR Code"
                        style={{
                            width: size,
                            height: size,
                        }}
                        className="rounded-md bg-white p-2"
                    />
                </div>

                {/* Footer */}
                <div className="flex justify-center mt-4">
                    <Button
                        onClick={onClose}
                        className="w-full dark:bg-white dark:text-black"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}