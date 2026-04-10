"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {apiGet, apiPatch, apiPost, createBrowserApiClient} from "@/lib/api.helper";


const client = createBrowserApiClient();

export interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image_url?: string | null;
    };
}

export interface CartContextType {
    cart: CartItem[];
    loading: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
    removeItem: (cartItemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalQuantity: number;
    totalPrice: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await apiGet<any>(client, "/cart");

            // Extract the items array and map price to number
            const items: CartItem[] = Array.isArray(data.items)
                ? data.items.map((item: any) => ({
                    id: item.id,
                    quantity: item.quantity,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        price: parseFloat(item.product.price),
                        image_url: item.product.image_url ?? null,
                    },
                }))
                : [];

            setCart(items);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: number, quantity = 1) => {
        await apiPost(client, "/cart/add", { productId, quantity });
        await fetchCart(); // refresh
    };

    const updateQuantity = async (cartItemId: number, quantity: number) => {
        await apiPatch(client, `/cart/${cartItemId}`, { quantity });
        await fetchCart();
    };

    const removeItem = async (cartItemId: number) => {
        await client.delete(`/cart/${cartItemId}`);
        await fetchCart();
    };


    const clearCart = async () => {
        setLoading(true);
        try {
            await client.delete("/cart/clear");
            setCart([]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
    );

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                fetchCart,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
                totalQuantity,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}