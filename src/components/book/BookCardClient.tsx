"use client";

import BookCard from "./BookCard";
import { useCart } from "@/hooks/useCart";

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image_url?: string | null;
    category: { id: number; name: string };
}

interface Props {
    products: Product[];
}

export default function BookCardClient({ products }: Props) {
    const { addToCart } = useCart();

    return (
        <BookCard
            products={products}
            onAddToCart={(product) => addToCart(product.id)}
        />
    );
}