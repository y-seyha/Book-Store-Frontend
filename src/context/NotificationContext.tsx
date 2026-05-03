"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import {
    apiGet,
    apiPatch,
    createBrowserApiClient,
} from "@/lib/api.helper";

type Notification = {
    id: string;
    type: "order" | "delivery" | "system";
    message: string;
    time: Date;
    read: boolean;
};

type NotificationContextType = {
    notifications: Notification[];
    unreadCount: number;
    refresh: () => Promise<void>;
    addNotification: (n: Notification) => void;
    clearNotifications: () => void;
    markAllAsRead: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
};

const client = createBrowserApiClient();

const NotificationContext =
    createContext<NotificationContextType | null>(null);

export default function NotificationProvider({
                                                 children,
                                                 userId,
                                             }: {
    children: React.ReactNode;
    userId?: string;
}) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const addNotification = useCallback((n: Notification) => {
        setNotifications((prev) => [n, ...prev]);
        setUnreadCount((prev) => prev + 1);
    }, []);

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };


    const refresh = useCallback(async () => {
        if (!userId) return;

        try {
            const [list, count] = await Promise.all([
                apiGet<any[]>(client, "/notifications"),
                apiGet<{ count: number }>(
                    client,
                    "/notifications/unread-count"
                ),
            ]);

            setNotifications(
                list.map((n) => ({
                    id: n.id,
                    type: n.type,
                    message: n.message,
                    time: new Date(n.created_at),
                    read: n.isRead,
                }))
            );

            setUnreadCount(count.count);
        } catch (err) {
            console.error("Failed to refresh notifications", err);
        }
    }, [userId]);

    const markAsRead = async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, read: true } : n
            )
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));

        try {
            await apiPatch(client, `/notifications/${id}/read`, null);
        } catch (err) {
            console.error("markAsRead failed:", err);
        }
    };

    const markAllAsRead = async () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );
        setUnreadCount(0);

        try {
            await apiPatch(client, `/notifications/mark-all-read`, null);
        } catch (err) {
            console.error("markAllAsRead failed:", err);
        }
    };

    useEffect(() => {
        if (!userId) {
            socket.disconnect();
            clearNotifications();
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("register", userId);

        const handle = (data: any, type: Notification["type"]) => {
            addNotification({
                id: crypto.randomUUID(),
                type,
                message: data.message,
                time: new Date(),
                read: false,
            });

            toast.success(data.message);
        };

        socket.on("order_created", (d) =>
            handle(d, "order")
        );

        socket.on("new_delivery", (d) =>
            handle(d, "delivery")
        );

        socket.on("delivery_success", (d) =>
            handle(d, "delivery")
        );

        socket.on("delivery_failed", (d) =>
            handle(d, "delivery")
        );

        return () => {
            socket.off("order_created");
            socket.off("new_delivery");
            socket.off("delivery_success");
            socket.off("delivery_failed");
        };
    }, [userId, addNotification]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                refresh,
                addNotification,
                clearNotifications,
                markAllAsRead,
                markAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx)
        throw new Error(
            "useNotifications must be used within provider"
        );
    return ctx;
}