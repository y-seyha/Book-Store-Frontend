"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export interface ShippingData {
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    payment_method: "cod" | "aba";
}

interface Props {
    onSubmit: (data: ShippingData) => void;
}

export default function ShippingForm({ onSubmit }: Props) {
    const { user } = useAuth();

    const [form, setForm] = useState<ShippingData>({
        shipping_name: "",
        shipping_phone: "",
        shipping_address: "",
        shipping_city: "",
        payment_method: "cod",
    });

    const handleChange = (key: keyof ShippingData, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (
            !form.shipping_name ||
            !form.shipping_phone ||
            !form.shipping_address ||
            !form.shipping_city
        ) {
            toast.error("Please fill all fields");
            return;
        }

        onSubmit(form);
    };

    useEffect(() => {
        if (!user) return;

        setForm((prev) => {
            const isEmpty = !prev.shipping_name && !prev.shipping_phone;

            if (!isEmpty) return prev; // don't override user input

            return {
                ...prev,
                shipping_name: `${user.firstName} ${user.lastName}`,
                shipping_phone: user.phone ?? "",
            };
        });
    }, [user]);

    return (
        <div className="border rounded-lg p-6 space-y-4 flex-1">
            <h2 className="text-xl font-semibold">Shipping Info</h2>

            <Input
                placeholder="Full Name"
                value={form.shipping_name}
                onChange={(e) => handleChange("shipping_name", e.target.value)}
            />

            <Input
                placeholder="Phone Number"
                value={form.shipping_phone}
                onChange={(e) => handleChange("shipping_phone", e.target.value)}
            />

            <Input
                placeholder="Address"
                value={form.shipping_address}
                onChange={(e) => handleChange("shipping_address", e.target.value)}
            />

            <Input
                placeholder="City"
                value={form.shipping_city}
                onChange={(e) => handleChange("shipping_city", e.target.value)}
            />

            <select
                className="w-full border rounded-md p-2 dark:bg-[#121212]"
                value={form.payment_method}
                onChange={(e) =>
                    handleChange("payment_method", e.target.value as "cod" | "aba")
                }
            >
                <option value="cod">Cash on Delivery</option>
                <option value="aba">ABA</option>
            </select>

            <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-2 rounded-md"
            >
                Continue to Payment
            </button>
        </div>
    );
}