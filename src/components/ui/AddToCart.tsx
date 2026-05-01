"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

interface AddToCartProps {
    stock: number;
    productId: number;
}

export default function AddToCart({ stock, productId }: AddToCartProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(0);
    const [justAdded, setJustAdded] = useState(false);
    const [lastAddedQuantity, setLastAddedQuantity] = useState(0);

    const { addToCart } = useCart();

    const isOutOfStock = stock <= 0 || added >= stock;

    useEffect(() => {
        setQuantity(1);
        setAdded(0);
        setJustAdded(false);
        setLastAddedQuantity(0);
    }, [productId]);

    const increment = () => setQuantity((q) => Math.min(q + 1, stock - added));
    const decrement = () => setQuantity((q) => Math.max(q - 1, 1));
    

    const handleAddToCart = async () => {
        if (!productId || quantity <= 0 || isOutOfStock) {
            toast.error("Cannot add to cart", {
                description: "Invalid quantity or product is out of stock.",
            });
            return;
        }

        try {
            await addToCart(productId, quantity);

            setAdded((prev) => prev + quantity);
            setLastAddedQuantity(quantity);
            setJustAdded(true);
            setQuantity(1);

            toast.success(`Added (${quantity}) to cart successfully 🛒`);

            setTimeout(() => setJustAdded(false), 2000);
        } catch (error: any) {
            toast.error("Failed to add to cart", {
                description: error?.message || "Something went wrong",
            });
        }
    };

    const handleWishlist = () => {
        if (!productId) return;

        const wishlist: number[] = JSON.parse(
            localStorage.getItem("favorites") || "[]"
        );

        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            localStorage.setItem("favorites", JSON.stringify(wishlist));

            toast.success("Added to wishlist ❤️", {
                action: {
                    label: "Go to wishlist",
                    onClick: () => router.push("/wishlist"),
                },
            });
        } else {
            toast.info("Already in wishlist", {
                action: {
                    label: "View wishlist",
                    onClick: () => router.push("/wishlist"),
                },
            });
        }
    };


    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">

            {/* Quantity selector */}
            <div className="flex w-full md:w-auto items-center gap-2">
                <Button onClick={decrement} disabled={quantity <= 1 || isOutOfStock} size="sm">-</Button>
                <span className="px-3 py-1 border rounded text-center flex-1">{quantity}</span>
                <Button onClick={increment} disabled={quantity >= stock - added || isOutOfStock} size="sm">+</Button>
            </div>

            {/* Wishlist + Add to Cart buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                    onClick={handleWishlist}
                    variant="outline"
                    className="w-full sm:w-auto px-4"
                >
                    Wishlist
                </Button>
                <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full sm:w-auto px-6"
                >
                    {isOutOfStock
                        ? "Sold Out"
                        : justAdded
                            ? `Added (${lastAddedQuantity}) to Cart`
                            : "Add to Cart"
                    }
                </Button>
            </div>

        </div>
    );
}