"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/common/ModeToggle"

type NavItem = {
    label: string
    href?: string
    dropdown?: { label: string; href: string }[]
}

const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    {
        label: "Categories",
        dropdown: [
            { label: "Phones", href: "/categories/phones" },
            { label: "Laptops", href: "/categories/laptops" },
            { label: "Accessories", href: "/categories/accessories" },
            { label: "Smart Home", href: "/categories/smart-home" },
        ],
    },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
]

export default function Navbar() {
    const [isLogin, setIsLogin] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="border-b bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* LEFT: Logo */}
                <div className="flex items-center gap-6">
                    <Link href="/Frontend/bookstore-frontend/public" className="text-xl font-bold">
                        Logo
                    </Link>
                </div>

                {/* DESKTOP NAV ITEMS */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item, index) =>
                        item.dropdown ? (
                            <DropdownMenu key={index}>
                                <DropdownMenuTrigger className="hover:text-blue-500">
                                    {item.label}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {item.dropdown.map((sub, i) => (
                                        <DropdownMenuItem key={i} asChild>
                                            <Link href={sub.href}>{sub.label}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                key={index}
                                href={item.href!}
                                className="hover:text-blue-500"
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 md:gap-4">
                    <ModeToggle />

                    {!isLogin ? (
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" onClick={() => setIsLogin(true)}>
                                Register
                            </Button>
                            <Button onClick={() => setIsLogin(true)}>Login</Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Profile</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">My Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders">Orders</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsLogin(false)}>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="md:hidden px-6 pb-4 space-y-2 bg-white dark:bg-black border-t">
                    {navItems.map((item, index) =>
                        item.dropdown ? (
                            <DropdownMenu key={index}>
                                <DropdownMenuTrigger className="w-full text-left hover:text-blue-500">
                                    {item.label}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {item.dropdown.map((sub, i) => (
                                        <DropdownMenuItem key={i} asChild>
                                            <Link href={sub.href}>{sub.label}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                key={index}
                                href={item.href!}
                                className="block w-full py-2 hover:text-blue-500"
                            >
                                {item.label}
                            </Link>
                        )
                    )}

                    {/* Mobile Login / Register */}
                    {!isLogin ? (
                        <div className="flex flex-col gap-2 mt-2">
                            <Button variant="ghost" onClick={() => setIsLogin(true)}>
                                Register
                            </Button>
                            <Button onClick={() => setIsLogin(true)}>Login</Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 mt-2">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Profile</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">My Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders">Orders</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsLogin(false)}>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}