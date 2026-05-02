"use client";

import { useEffect, useState } from "react";
import {
    apiGet,
    createBrowserApiClient,
} from "@/lib/api.helper";

import SearchBar from "@/components/common/admin/SearchBar";
import DataTable from "@/components/common/admin/DataTable";
import SellerMainLayout from "@/components/layout/SellerLayout";

const client = createBrowserApiClient();

type Category = {
    id: number;
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
};


export default function CategoriesDashboard() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const res = await apiGet<Category[]>(
                client,
                "/admin/categories"
            );

            setCategories(res ?? []);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );


    const columns = [
        { key: "id", title: "ID" },

        { key: "name", title: "Name" },

        {
            key: "description",
            title: "Description",
            render: (row: Category) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                {row.description.slice(0, 60)}
                    {row.description.length > 60 ? "..." : ""}
            </span>
            ),
        },

        {
            key: "actions",
            title: "Actions",
            render: () => (
                <span className="text-gray-400 text-xs italic">
            Read only
        </span>
            ),
        }
    ];

    return (
        <SellerMainLayout>
            <div className="p-6 space-y-4">

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">
                        Categories
                    </h1>

                </div>

                {/* SEARCH */}
                <SearchBar value={search} onChange={setSearch} />

                {/* TABLE */}
                {loading ? (
                    <p>Loading categories...</p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filtered}
                    />
                )}
            </div>
        </SellerMainLayout>
    );
}