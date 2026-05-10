"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {useState, useEffect} from "react";

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
    Menu,
    X,
    ArrowLeft,
} from "lucide-react";

const menu = [
    {label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard},
    {label: "Products", href: "/admin/product-dashboard", icon: ShoppingBag},
    {label: "Categories", href: "/admin/categories-dashboard", icon: Tags},
    {label: "Users", href: "/admin/users-dashboard", icon: Users},
    {label: "Sellers", href: "/admin/sellers-dashboard", icon: UserCheck},
    {label: "Drivers", href: "/admin/driver-dashboard", icon: Truck},
    {label: "Delivery Track", href: "/admin/delivery-track-dashboard", icon: MapPin},
    {label: "Payments", href: "/admin/payment-dashboard", icon: CreditCard},
    {label: "Reviews", href: "/admin/review-dashboard", icon: Star},
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const {logout} = useAuth();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    return (
        <>
            {/* MOBILE TOP BAR */}
            <div
                className="md:hidden flex items-center justify-between px-4 py-3 border-b dark:border-gray-800 bg-white dark:bg-gray-950">
                <button onClick={() => setOpen(true)}>
                    <Menu size={22}/>
                </button>

                <span className="font-semibold">Admin Panel</span>
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
                    h-full md:h-screen w-64
                    flex flex-col justify-between
                    border-r
                    bg-white dark:bg-gray-950
                    text-gray-700 dark:text-gray-200

                    transform transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
            >
                {/* TOP */}
                <div className="flex flex-col h-full">

                    {/* HEADER */}
                    <div
                        className="px-6 py-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                        <span className="font-bold tracking-wide">
                            ADMIN PANEL
                        </span>

                        <button onClick={() => setOpen(false)} className="md:hidden">
                            <X size={20}/>
                        </button>
                    </div>

                    {/* MENU */}
                    <nav className="flex-1 overflow-y-auto mt-4 px-3 space-y-1">
                        {menu.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition

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
                                                ? "text-blue-600"
                                                : "text-gray-500"
                                        }
                                    />
                                    <span>{item.label}</span>

                                    {isActive && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"/>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* BOTTOM ACTIONS */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">

                        {/* BACK TO HOME */}
                        <button
                            onClick={() => {
                                setOpen(false);
                                router.push("/");
                            }}
                            className="
                                flex items-center gap-3 w-full
                                px-3 py-2.5 rounded-md
                                text-sm font-medium
                                text-gray-600 dark:text-gray-300
                                hover:bg-gray-100 dark:hover:bg-gray-900
                            "
                        >
                            <ArrowLeft size={18}/>
                            Back to Home
                        </button>

                        {/* LOGOUT */}
                        <button
                            onClick={logout}
                            className="
                                flex items-center gap-3 w-full
                                px-3 py-2.5 rounded-md
                                text-sm font-medium
                                text-red-500
                                hover:bg-red-50 dark:hover:bg-red-500/10
                            "
                        >
                            <LogOut size={18}/>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}