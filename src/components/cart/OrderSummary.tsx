"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";


export default function OrderSummary() {
    const { cart, removeItem, updateQuantity, clearCart } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClearCart = async () => {
        setLoading(true);
        try {
            await clearCart();
            toast.success("Cart cleared 🧹");
        } catch (error) {
            console.error(error);
            toast.error("Failed to clear cart");
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    if (!cart.length)
        return (
            <Card className="p-6 w-full">
                <CardContent className="text-center text-gray-500">
                    Your cart is empty
                </CardContent>
            </Card>
        );

    return (
        <>
            <Card className="w-full flex flex-col">
                <CardContent className="space-y-4 flex-1 flex flex-col">
                    {/* Header with Clear button */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Order Summary</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowModal(true)}
                            className="text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear
                        </Button>
                    </div>

                    {/* Cart Items */}
                    <div className="border rounded-lg overflow-hidden">
                        <ScrollArea className="h-[400px]">
                            <div className="flex flex-col divide-y">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-4 p-4"
                                    >
                                        {/* Product Info */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <Avatar className="w-16 h-16 flex-shrink-0">
                                                {item.product.image_url ? (
                                                    <AvatarImage
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                    />
                                                ) : (
                                                    <AvatarFallback>
                                                        {item.product.name[0]}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>

                                            <div className="truncate">
                                                <h3 className="font-medium truncate">{item.product.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    ${item.product.price}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                                                }
                                            >
                                                -
                                            </Button>
                                            <span className="w-6 text-center">{item.quantity}</span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                            >
                                                +
                                            </Button>
                                        </div>

                                        {/* Remove Single Item Button */}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => removeItem(item.id).then(() => toast.success("Item removed"))}
                                            className="p-2 rounded-full"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showModal}
                title="Clear your cart?"
                description="Are you sure you want to remove all items from your cart? This action cannot be undone."
                onCancel={() => setShowModal(false)}
                onConfirm={handleClearCart}
                loading={loading}
                confirmText="Clear"
                cancelText="Cancel"
            />
        </>
    );
}