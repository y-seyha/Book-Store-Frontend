"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Bell,
    Menu,
    X,
    ShoppingCart,
    ChevronDown,
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
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    const isActive = (href: string) => pathname === href;
    const isCategoryActive = pathname.startsWith("/products/category");

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
                                width={60}  // adjust size as needed
                                height={60} // adjust size as needed
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
                                <Button variant="ghost" size="icon">
                                    <Bell className="h-5 w-5" />
                                </Button>

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