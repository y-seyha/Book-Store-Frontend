"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

interface AddToCartProps {
    stock: number;
    productId: number;
}

export default function AddToCart({ stock, productId }: AddToCartProps) {
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
        if (!productId || quantity <= 0 || isOutOfStock) return;

        await addToCart(productId, quantity);
        setAdded((prev) => prev + quantity);
        setLastAddedQuantity(quantity);
        setJustAdded(true);
        setQuantity(1);
        setTimeout(() => setJustAdded(false), 2000);

        // console.log("Added to cart:", productId, quantity);
    };

    const handleWishlist = () => {
        if (!productId) return;

        const wishlist: number[] = JSON.parse(localStorage.getItem("wishlist") || "[]");

        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            alert("Added to Wishlist ❤️");
        } else {
            alert("Already in Wishlist");
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