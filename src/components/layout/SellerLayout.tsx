"use client";

import SellerSidebar from "@/components/common/SellerSidebar";

export default function SellerMainLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
            {/* SIDEBAR */}
            <SellerSidebar />

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
}