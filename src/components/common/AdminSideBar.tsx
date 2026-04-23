"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
    LayoutDashboard,
    ShoppingBag,
    Tags,
    Users,
    UserCheck,
    Truck,
    MapPin,
    CreditCard,
    Star,
    LogOut,
} from "lucide-react";

const menu = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Products",
        href: "/admin/product-dashboard",
        icon: ShoppingBag,
    },
    {
        label: "Categories",
        href: "/admin/categories-dashboard",
        icon: Tags,
    },
    {
        label: "Users",
        href: "/admin/users-dashboard",
        icon: Users,
    },
    {
        label: "Sellers",
        href: "/admin/sellers-dashboard",
        icon: UserCheck,
    },
    {
        label: "Drivers",
        href: "/admin/driver-dashboard",
        icon: Truck,
    },
    {
        label: "Delivery Track",
        href: "/admin/delivery-track-dashboard",
        icon: MapPin,
    },
    {
        label: "Payments",
        href: "/admin/payment-dashboard",
        icon: CreditCard,
    },
    {
        label: "Reviews",
        href: "/admin/review-dashboard",
        icon: Star,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside
            className="
                h-screen w-64 flex flex-col justify-between
                border-r
                bg-white dark:bg-gray-950
                text-gray-700 dark:text-gray-200
            "
        >
            {/* TOP */}
            <div>
                {/* HEADER */}
                <div className="px-6 py-5 font-bold text-lg border-b border-gray-200 dark:border-gray-800">
                    <span className="tracking-wide">
                        ADMIN PANEL
                    </span>
                </div>

                {/* MENU */}
                <nav className="mt-4 px-3 space-y-1">
                    {menu.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3
                                    px-3 py-2.5 rounded-md
                                    text-sm font-medium
                                    transition-all duration-200

                                    ${
                                    isActive
                                        ? "bg-gray-100 dark:bg-gray-900 text-blue-600 dark:text-blue-400"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-900"
                                }
                                `}
                            >
                                <Icon
                                    size={18}
                                    className={
                                        isActive
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-500 dark:text-gray-400"
                                    }
                                />

                                <span>{item.label}</span>

                                {/* active indicator line */}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* BOTTOM */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={logout}
                    className="
                        flex items-center gap-3 w-full
                        px-3 py-2.5 rounded-md
                        text-sm font-medium
                        text-red-500
                        hover:bg-red-50 dark:hover:bg-red-500/10
                        transition
                    "
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}