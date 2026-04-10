"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import BookCard from "@/components/book/BookCard";
import { apiGet, createBrowserApiClient } from "@/lib/api.helper";

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

export default function CategoryPage() {
    const params = useParams();
    const categoryId = Number(params.id);

    const [products, setProducts] = useState<Product[]>([]);
    const [categoryName, setCategoryName] = useState<string>("");

    const fetchProducts = async () => {
        const res = await apiGet<{ data: Product[] }>(
            client,
            `/products/categories/${categoryId}`
        );

        setProducts(res.data);

        // set category name from first product
        if (res.data.length > 0) {
            setCategoryName(res.data[0].category.name);
        }
    };

    useEffect(() => {
        if (categoryId) {
            fetchProducts();
        }
    }, [categoryId]);

    return (
        <MainLayout>
            <section className="max-w-7xl mx-auto px-4 mt-30">
                <h1 className="text-3xl font-bold mb-6">
                   Categories :  {categoryName || "Category"}
                </h1>

                {products.length > 0 ? (
                    <BookCard products={products} />
                ) : (
                    <p className="text-gray-500">No products found.</p>
                )}
            </section>
        </MainLayout>
    );
}