"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import NotificationProvider from "@/context/NotificationContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

function NotificationWrapper({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    return (
        <NotificationProvider userId={!loading ? user?.id : undefined}>
            {children}
            <Toaster position="bottom-right" />
        </NotificationProvider>
    );
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                <TooltipProvider>
                    <NotificationWrapper>
                        {children}
                    </NotificationWrapper>
                </TooltipProvider>
            </CartProvider>
        </AuthProvider>
    );
}