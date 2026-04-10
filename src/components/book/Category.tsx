"use client";

import React, { useState, useEffect } from "react";

interface CategoryCard {
    id: number;
    name: string;
    count: number;
}

interface CategoriesProps {
    categories: CategoryCard[];
    onSelectCategory?: (id: number | null) => void;
    onSearch?: (query: string) => void;
}

export default function Categories({ categories, onSelectCategory, onSearch }: CategoriesProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    // Handle category click
    const handleSelect = (id: number) => {
        const newSelected = selectedCategory === id ? null : id;
        setSelectedCategory(newSelected);
        onSelectCategory?.(newSelected);
    };

    // Debounced search callback
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            onSearch?.(search.trim());
        }, 800);
        return () => clearTimeout(delayDebounce);
    }, [search, onSearch]);

    return (
        <div className="mt-10 max-w-7xl mx-auto p-4 bg-white dark-background rounded-lg shadow-md w-full">
            {/* Categories */}
            <div className="flex flex-wrap gap-4 mb-4 w-full">
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;

                    return (
                        <div
                            key={cat.id}
                            onClick={() => handleSelect(cat.id)}
                            className={`flex-1 min-w-[120px] p-4 rounded-lg text-center cursor-pointer transition flex flex-col justify-center
                ${isSelected
                                ? "border-2 border-blue-500 bg-blue-50 dark-background"
                                : "border border-gray-300 hover:border-blue-500 bg-white dark-background"
                            }`}
                        >
                            <div
                                className={`text-sm font-medium ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-100"}`}
                            >
                                {cat.name}
                            </div>
                            <div
                                className={`text-xl font-bold ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-gray-100"}`}
                            >
                                {cat.count}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search Box */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark-background border-gray-700 placeholder-gray-400"
                />
            </div>
        </div>
    );
}