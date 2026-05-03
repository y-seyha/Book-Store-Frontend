"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {
    Bell,
    Menu,
    X,
    ShoppingCart,
    ChevronDown, Package, Truck, CheckCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/common/ModeToggle";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useNotifications} from "@/context/NotificationContext";

type NavItem = {
    label: string;
    href?: string;
    dropdown?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    {
        label: "Categories",
        dropdown: [
            { label: "Fiction", href: "/products/category/1" },
            { label: "Non-Fiction", href: "/products/category/2" },
            { label: "Children & Young Adult", href: "/products/category/3" },
            { label: "Science & Technology", href: "/products/category/4" },
            { label: "Art & Literature", href: "/products/category/5" },
        ],
    },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
    const { cart } = useCart();
    const { user, logout, loading } = useAuth();
    const {
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
        refresh,
    } = useNotifications();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);


    const isActive = (href: string) => pathname === href;
    const isCategoryActive = pathname.startsWith("/products/category");


    useEffect(() => {
        if (user) {
            refresh();
        }
    }, [user, refresh]);

    if (loading) return null;



    return (
        <nav className="fixed top-4 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between bg-white dark:bg-black rounded-xl shadow-md px-6 py-6">

                    {/* LEFT */}
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logoBook.png"
                                alt="Logo"
                                width={60}
                                height={60}
                            />
                        </Link>

                        {/* Desktop */}
                        <div className="hidden md:flex items-center gap-5">
                            {navItems.map((item, index) =>
                                item.dropdown ? (
                                    <DropdownMenu key={index}>
                                        <DropdownMenuTrigger
                                            className={`flex items-center gap-1 hover:text-blue-500 transition ${
                                                isCategoryActive
                                                    ? "border-b-2 border-blue-500 pb-1"
                                                    : ""
                                            }`}
                                        >
                                            {item.label}
                                            <ChevronDown className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            className="
                                                animate-in fade-in-0 zoom-in-95
                                                data-[state=closed]:animate-out
                                                data-[state=closed]:fade-out-0
                                                data-[state=closed]:zoom-out-95
                                                duration-150
                                            "
                                        >
                                            {item.dropdown.map((sub, i) => (
                                                <DropdownMenuItem key={i} asChild>
                                                    <Link
                                                        href={sub.href}
                                                        className={`block w-full ${
                                                            pathname === sub.href
                                                                ? "text-blue-500 font-semibold"
                                                                : "hover:text-blue-500"
                                                        }`}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link
                                        key={index}
                                        href={item.href!}
                                        className={`hover:text-blue-500 transition ${
                                            isActive(item.href!)
                                                ? "border-b-2 border-blue-500 pb-1"
                                                : ""
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3 relative">
                        <ModeToggle />

                        {/* Cart */}
                        <Link href="/cart" className="relative">
                            <Button variant="ghost" size="icon">
                                <ShoppingCart className="w-5 h-5" />
                            </Button>
                            {cart && cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <>
                                <DropdownMenu
                                    open={open}
                                    onOpenChange={setOpen}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="relative"
                                            onClick={refresh}
                                        >
                                            <Bell className="h-5 w-5" />

                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold bg-red-500 text-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
        </span>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        className="w-80 p-0 overflow-hidden rounded-xl border shadow-lg"
                                    >
                                        {/* HEADER */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 dark:bg-gray-900">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold">Notifications</p>
                                                {unreadCount > 0 && (
                                                    <span className="text-xs text-red-500 font-medium">
                        {unreadCount} new
                    </span>
                                                )}
                                            </div>

                                            {/* MARK ALL READ */}
                                            {unreadCount > 0 && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={markAllAsRead}
                                                >
                                                    <CheckCheck className="w-3 h-3 mr-1" />
                                                    Mark all
                                                </Button>
                                            )}
                                        </div>

                                        {/* BODY */}
                                        <ScrollArea className="h-72">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-sm text-center text-gray-500">
                                                    No notifications yet
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    {notifications.map((n) => (
                                                        <Link
                                                            key={n.id}
                                                            href="#"
                                                            onClick={() => markAsRead(n.id)}
                                                            className={`flex gap-3 px-4 py-3 transition ${
                                                                !n.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                                                            }`}
                                                        >
                                                            {/* ICON */}
                                                            <div className="mt-0.5">
                                                                {n.type === "order" ? (
                                                                    <Package className="w-4 h-4 text-blue-500" />
                                                                ) : (
                                                                    <Truck className="w-4 h-4 text-green-500" />
                                                                )}
                                                            </div>

                                                            {/* CONTENT */}
                                                            <div className="flex-1">
                                                                <p className="text-sm leading-snug">
                                                                    {n.message}
                                                                </p>

                                                                <div className="flex items-center justify-between mt-1">
                                                                    <p className="text-xs text-gray-400">
                                                                        {new Date(n.time).toLocaleTimeString()}
                                                                    </p>

                                                                    {!n.read && (
                                                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">Profile</Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        className="
                                            animate-in fade-in-0 zoom-in-95
                                            data-[state=closed]:animate-out
                                            data-[state=closed]:fade-out-0
                                            data-[state=closed]:zoom-out-95
                                            duration-150
                                        "
                                    >
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile">My Profile</Link>
                                        </DropdownMenuItem>

                                        {user?.role === "seller" && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/seller/dashboard">My Dashboard</Link>
                                            </DropdownMenuItem>
                                        )}

                                        {user?.role === "admin" && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/dashboard">Admin Dashboard</Link>
                                            </DropdownMenuItem>
                                        )}

                                        {user?.role === "customer" && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/become-seller">Become a Seller</Link>
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuItem asChild>
                                            <Link href="/orders">Orders</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/wishlist">Wishlist</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={logout}>
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        (window.location.href = "/auth/signup")
                                    }
                                >
                                    Register
                                </Button>
                                <Button
                                    onClick={() =>
                                        (window.location.href = "/auth/signin")
                                    }
                                >
                                    Login
                                </Button>
                            </>
                        )}

                        {/* Mobile toggle */}
                        <button
                            className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                            onClick={() =>
                                setMobileMenuOpen(!mobileMenuOpen)
                            }
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE */}
            {mobileMenuOpen && (
                <div className="md:hidden px-6 mt-2 space-y-2 bg-white dark:bg-black rounded-xl shadow-md">
                    {navItems.map((item, index) =>
                        item.dropdown ? (
                            <DropdownMenu key={index}>
                                <DropdownMenuTrigger className="flex items-center justify-between w-full hover:text-blue-500">
                                    {item.label}
                                    <ChevronDown className="w-4 h-4" />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    className="
                                        animate-in fade-in-0 zoom-in-95
                                        data-[state=closed]:animate-out
                                        data-[state=closed]:fade-out-0
                                        data-[state=closed]:zoom-out-95
                                        duration-150
                                    "
                                >
                                    {item.dropdown.map((sub, i) => (
                                        <DropdownMenuItem key={i} asChild>
                                            <Link
                                                href={sub.href}
                                                className={`block w-full ${
                                                    pathname === sub.href
                                                        ? "text-blue-500 font-semibold"
                                                        : ""
                                                }`}
                                            >
                                                {sub.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                key={index}
                                href={item.href!}
                                className={`block py-2 hover:text-blue-500 ${
                                    isActive(item.href!)
                                        ? "text-blue-500 font-semibold"
                                        : ""
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    )}

                </div>
            )}
        </nav>
    );
}