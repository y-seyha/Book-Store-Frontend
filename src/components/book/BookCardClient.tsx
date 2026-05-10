"use client";

import BookCard from "./BookCard";
import {useCart} from "@/hooks/useCart";
import {useAuth} from "@/context/AuthContext";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

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

export default function BookCardClient({products}: Props) {
    const router = useRouter();
    const {addToCart} = useCart();
    const {user, loading} = useAuth();

    const handleAddToCart = async (productId: number) => {
        if (loading)
            return;

        if (!user) {
            toast.error("Please sign in first");
            router.push("/auth/signin");

            return;
        }

        await addToCart(productId);
        toast.success("Added to cart");
    }

    return (
        <BookCard
            products={products}
            onAddToCart={(product) =>
                handleAddToCart(product.id)
            }
        />
    );
}