// HomePage.tsx
"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BookstoreCarousel from "@/components/common/Carousel";
import BookCardClient from "@/components/book/BookCardClient";
import { apiGet, createBrowserApiClient } from "@/lib/api.helper";
import Categories from "@/components/book/Category";

const client = createBrowserApiClient();

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image_url: string | null;
    category: { id: number; name: string };
}

interface CategoryCard {
    id: number;
    name: string;
    count: number;
}

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryCard[]>([
        { id: 1, name: "Fiction", count: 0 },
        { id: 2, name: "Non-Fiction", count: 0 },
        { id: 3, name: "Children & Young Adult", count: 0 },
        { id: 4, name: "Science & Technology", count: 0 },
        { id: 5, name: "Art & Literature", count: 0 },
    ]);

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCategoryCounts = async () => {
        const res = await apiGet<{ categoryId: number; count: number }[]>(
            client,
            "/products/categories/counts"
        );
        setCategories(prev =>
            prev.map(c => ({
                ...c,
                count: res.find(r => r.categoryId === c.id)?.count ?? 0,
            }))
        );
    };

    const fetchProducts = async (categoryId?: number, search?: string) => {
        let url = "/products";

        if (search?.trim()) {
            url = `/products?search=${encodeURIComponent(search.trim())}`;
        } else if (categoryId) {
            url = `/products/categories/${categoryId}`;
        }

        const res = await apiGet<{ data: Product[] }>(client, url);
        setProducts(res.data);
    };

    // Initial load
    useEffect(() => {
        fetchCategoryCounts();
        fetchProducts();
    }, []);

    // Fetch products when category or search changes
    useEffect(() => {
        fetchProducts(selectedCategory ?? undefined, searchQuery);
    }, [selectedCategory, searchQuery]);

    const images = ["/book1.png", "/book4.jpg", "/book3.webp"];

    return (
        <MainLayout>
            <section>
                <h1 className="text-3xl font-bold text-center mb-6">
                    Welcome to Our Bookstore
                </h1>
                <BookstoreCarousel images={images} />
            </section>

            <section>
                <Categories
                    categories={categories}
                    onSelectCategory={(catId) => setSelectedCategory(catId)}
                    onSearch={(query) => setSearchQuery(query)}
                />
            </section>

            <section className="max-w-7xl mx-auto px-4">
                <h2 className="mt-10 text-2xl font-bold mb-4">
                    {selectedCategory
                        ? categories.find(c => c.id === selectedCategory)?.name
                        : "All Books"}
                </h2>

                <BookCardClient products={products} />
            </section>
        </MainLayout>
    );
}