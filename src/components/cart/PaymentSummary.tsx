"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserApiClient, apiPost } from "@/lib/api.helper";
import {toast} from "sonner";
import {ShippingData} from "@/components/cart/ShippingForm";


interface Props {
    shippingData: ShippingData;
}

export default function PaymentSummary({shippingData} : Props) {
    const { totalQuantity, totalPrice, cart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const client = createBrowserApiClient();

    const handleCheckout = async () => {
        if (totalQuantity === 0) return;

        setLoading(true);
        try {
            await apiPost(client, "/checkout", shippingData);

            await clearCart();

            toast.success("Checkout successful! 🎉");

            router.push("/orders");
        } catch (error: any) {
            console.error("Checkout failed:", error);

            const msg = error?.response?.data?.message || "Checkout failed!";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);

    return (
        <div className="border rounded-lg p-6 space-y-6 flex-1 max-w-md">
            <h2 className="text-xl font-semibold">Payment Summary</h2>

            <div className="flex justify-between">
                <span>Items</span>
                <span>{totalQuantity}</span>
            </div>

            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
            </div>


            <hr />

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Name</span>
                    <span>{shippingData.shipping_name}</span>
                </div>

                <div className="flex justify-between">
                    <span>Phone</span>
                    <span>{shippingData.shipping_phone}</span>
                </div>

                <div className="flex justify-between">
                    <span>Address</span>
                    <span className="text-right max-w-[60%] truncate">
            {shippingData.shipping_address}
        </span>
                </div>

                <div className="flex justify-between">
                    <span>City</span>
                    <span>{shippingData.shipping_city}</span>
                </div>

                <div className="flex justify-between">
                    <span>Payment</span>
                    <span className="capitalize">
            {shippingData.payment_method === "cod"
                ? "Cash on Delivery"
                : "ABA"}
        </span>
                </div>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
            </div>

            <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={loading || totalQuantity === 0}
            >
                {loading ? "Processing..." : "Proceed to Checkout"}
            </Button>
        </div>
    );
}