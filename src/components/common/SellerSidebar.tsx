
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

import {
    LayoutDashboard,
    ShoppingBag,
    Tags,
    LogOut,
    Menu,
    X,
} from "lucide-react";

const menu = [
    {
        label: "Dashboard",
        href: "/seller/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "My Products",
        href: "/seller/product-dashboard",
        icon: ShoppingBag,
    },
    {
        label: "Categories",
        href: "/seller/categories-dashboard",
        icon: Tags,
    },
];

export default function SellerSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const [open, setOpen] = useState(false);

    // Prevent background scroll when sidebar is open (mobile)
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    return (
        <>
            {/* MOBILE TOP BAR */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b dark:border-gray-800">
                <button onClick={() => setOpen(true)}>
                    <Menu size={22} />
                </button>

                <span className="font-semibold">
                    Seller Panel
                </span>
            </div>

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
fixed md:static top-0 left-0 z-50
h-screen w-64 flex flex-col justify-between
border-r
bg-white dark:bg-gray-950
text-gray-700 dark:text-gray-200

transform transition-transform duration-300 ease-in-out

${open ? "translate-x-0" : "-translate-x-full"}
md:translate-x-0
    `}
            >
                {/* TOP */}
                <div>
                    {/* HEADER */}
                    <div className="px-6 py-5 font-bold text-lg border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                        <span className="tracking-wide">
                            SELLER PANEL
                        </span>

                        {/* CLOSE BUTTON (mobile) */}
                        <button
                            onClick={() => setOpen(false)}
                            className="md:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* MENU */}
                    <nav className="mt-4 px-3 space-y-1">
                        {menu.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
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

                                    {/* active dot */}
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
        </>
    );
}
