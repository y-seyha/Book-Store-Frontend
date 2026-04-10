"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { getBookById } from "@/lib/api";
import BookCardClient from "@/components/book/BookCardClient";

type Book = {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    category: { id: number; name: string };
    image_url?: string | null;
    images?: string[];
};

export default function FavoritePage() {
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    // Load favorites
    useEffect(() => {
        const stored = localStorage.getItem("favorites");

        if (stored) {
            setFavoriteIds(JSON.parse(stored));
        } else {
            setLoading(false);
        }
    }, []);

    // Fetch books
    useEffect(() => {
        if (favoriteIds.length === 0) {
            setBooks([]);
            setLoading(false);
            return;
        }

        const fetchFavorites = async () => {
            setLoading(true);

            try {
                const results = await Promise.all(
                    favoriteIds.map((id) => getBookById(id.toString()))
                );

                setBooks(results);
            } catch (err) {
                console.error("Failed to fetch favorites:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [favoriteIds]);

    // loading state
    if (loading) {
        return (
            <MainLayout>
                <div className="p-10 text-center">Loading favorites...</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <section className="max-w-7xl mx-auto px-4 mt-30">
                <h1 className="text-3xl font-bold mb-6">
                    Your Favorites
                </h1>

                {/* EMPTY STATE */}
                {books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center mt-20">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            No favorite items found
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Start adding books to your wishlist
                        </p>
                    </div>
                ) : (
                    <BookCardClient products={books} />
                )}
            </section>
        </MainLayout>
    );
}