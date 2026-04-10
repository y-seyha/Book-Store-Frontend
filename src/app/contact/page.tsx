"use client";

import MainLayout from "@/components/layout/MainLayout";
import FloatingInput from "@/components/ui/FloatingInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebook, FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { apiPost, createBrowserApiClient } from "@/lib/api.helper";
import { toast } from "sonner";
import { z } from "zod";

const client = createBrowserApiClient();

// Zod schema for input validation
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(2, "Subject must be at least 2 characters"),
    message: z.string().min(5, "Message must be at least 5 characters"),
});

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = contactSchema.safeParse(form);
        if (!result.success) {
            const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
            toast.error(firstError || "Invalid input");
            return;
        }

        setLoading(true);
        try {
            await apiPost(client, "/contact", form);
            toast.success("Message sent successfully!");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err: any) {
            // console.error(err);
            const msg = err?.response?.data?.message || "Failed to send message";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <section className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-10 mt-16">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                        Contact Us
                    </h1>
                    <p className="mt-2 text-base md:text-lg text-gray-700 dark:text-gray-300">
                        We’d love to hear from you!
                    </p>
                </div>

                {/* Form + Contact Info */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Contact Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 flex flex-col gap-3 bg-white dark:bg-[#121212] p-6 rounded-xl shadow-md"
                    >
                        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                            Get in Touch
                        </h2>

                        <FloatingInput
                            label="Name"
                            value={form.name}
                            onChange={(val) => handleChange("name", val)}
                            className="dark:bg-[#121212] dark:text-gray-200 dark:border-gray-600"
                        />
                        <FloatingInput
                            label="Email"
                            value={form.email}
                            onChange={(val) => handleChange("email", val)}
                            className="dark:bg-[#121212] dark:text-gray-200 dark:border-gray-600"
                        />
                        <FloatingInput
                            label="Subject"
                            value={form.subject}
                            onChange={(val) => handleChange("subject", val)}
                            className="dark:bg-[#121212] dark:text-gray-200 dark:border-gray-600"
                        />

                        {/* Message */}
                        <div className="relative w-full mt-3">
                            <textarea
                                value={form.message}
                                onChange={(e) => handleChange("message", e.target.value)}
                                placeholder=" "
                                className="peer block w-full px-2 pt-5 pb-2 border rounded-md border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white dark:bg-[#121212] resize-none h-28 text-sm dark:text-gray-200"
                            />
                            <label className="absolute left-2 -top-2 px-1 text-gray-400 text-xs bg-white dark:bg-[#121212] z-10
                                transition-all duration-200
                                peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm
                                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
                                peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-500">
                                Message
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-36 text-sm"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send"}
                        </Button>
                    </form>

                    {/* Contact Info */}
                    <div className="flex-1 flex flex-col gap-3 bg-gray-100 dark:bg-[#1a1a1a] p-6 rounded-xl shadow-md text-sm text-gray-800 dark:text-gray-200">
                        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                            Contact Info
                        </h2>

                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>123 Book Lane</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <a href="tel:+85512345678" className="hover:underline">
                                +855 12 345 678
                            </a>
                        </div>

                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <a href="mailto:contact@bookstore.com" className="hover:underline">
                                contact@bookstore.com
                            </a>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                                <FaInstagramSquare className="w-5 h-5" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-md mt-6">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.765223171176!2d104.88816677601154!3d11.56868124407922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109519fe4077d69%3A0x20138e822e434660!2sRoyal%20University%20of%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1775834807887!5m2!1sen!2skh"
                        className="w-full h-full border-0"
                        loading="lazy"
                    />
                </div>

                {/* Hours + Social */}
                <div className="flex flex-col md:flex-row gap-8 mt-6">
                    <div className="flex-1 flex flex-col gap-2 bg-white dark:bg-[#121212] p-5 rounded-lg shadow-md text-sm text-gray-800 dark:text-gray-200">
                        <h2 className="text-xl font-semibold mb-1">Hours</h2>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Mon-Fri: 9am - 6pm</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Sat-Sun: 10am - 4pm</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-100 dark:bg-[#1a1a1a] p-5 rounded-lg shadow-md text-sm text-gray-800 dark:text-gray-200">
                        <h2 className="text-xl font-semibold mb-3">Social Media</h2>
                        <div className="flex items-center justify-start gap-5">
                            {[{ icon: FaFacebook, href: "https://facebook.com", color: "hover:text-blue-600", label: "Facebook" },
                                { icon: FaInstagramSquare, href: "https://instagram.com", color: "hover:text-pink-500", label: "Instagram" },
                                { icon: FaTwitter, href: "https://twitter.com", color: "hover:text-blue-400", label: "Twitter" }].map(s => (
                                <div key={s.label} className="flex flex-col items-center gap-1">
                                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={`${s.color} transition`}>
                                        <s.icon className="w-5 h-5" />
                                    </a>
                                    <span className="text-xs">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}