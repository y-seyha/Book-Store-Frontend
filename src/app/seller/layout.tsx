import SellerSidebar from "@/components/common/SellerSidebar";

export default function SellerMainLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
            <SellerSidebar/>

            <main className="
                flex-1
                overflow-y-auto
                p-4 sm:p-6
                w-full
            ">
                {children}
            </main>
        </div>
    );
}