"use client";



import AdminSidebar from "@/components/common/AdminSideBar";

export default function AdminMainLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* SIDEBAR */}
            <AdminSidebar />

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
}