"use client";

import Link from "next/link";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebook, FaInstagramSquare, FaLinkedin } from "react-icons/fa";

const socialLinks = [
    { icon: FaFacebook, href: "#" },
    { icon: FaInstagramSquare, href: "#" },
    { icon: FaLinkedin, href: "#" },
    { icon: Send, href: "#" },
];

const contacts = [
    { icon: MapPin, label: "Phnom Penh, Cambodia" },
    { icon: Phone, label: "+666 35 369 753" },
    { icon: Mail, label: "bookstore@gmail.com" },
    { icon: Clock, label: "08:00 - 17:00" },
];

export default function Footer() {
    return (
        <footer className="border-t mt-10 bg-white dark:bg-black text-gray-700 dark:text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Main layout */}
                <div className="flex flex-col md:flex-row md:justify-between gap-10">

                    {/* LEFT */}
                    <div className="space-y-4 md:max-w-md">
                        <h2 className="text-xl font-bold">Bookstore</h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your one-stop shop for books across all categories. Discover,
                            learn, and explore with us every day.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-4">
                            {socialLinks.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="hover:text-blue-500 transition"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Policy */}
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center gap-2">
                            <Link href="/privacy" className="hover:underline">
                                Privacy Policy
                            </Link>
                            <span className="hidden sm:inline">•</span>
                            <span>© 2026 Bookstore</span>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-4 w-full md:w-auto">
                        <h3 className="text-lg font-semibold">
                            Our Contact
                        </h3>

                        <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            {contacts.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 md:justify-end"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}