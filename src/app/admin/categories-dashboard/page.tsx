"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    apiDelete,
    apiGet,
    apiPatch,
    apiPost,
    createBrowserApiClient,
} from "@/lib/api.helper";

import SearchBar from "@/components/common/admin/SearchBar";
import AppModal from "@/components/common/admin/Modal";
import DataTable from "@/components/common/admin/DataTable";
import RowDropdown from "@/components/common/admin/RowDropdown";
import { toast } from "sonner";
import AdminMainLayout from "@/components/layout/AdminMainLayout";

const client = createBrowserApiClient();

type Category = {
    id: number;
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
};

const emptyForm = {
    name: "",
    description: "",
};

export default function CategoriesDashboard() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

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

    const handleSubmit = async () => {
        if (!form.name) {
            toast.error("Name is required");
            return;
        }

        try {
            if (!editingId) {
                const res = await apiPost<
                    typeof form,
                    Category
                >(client, "/admin/categories", form);

                setCategories((prev) => [res, ...prev]);
                toast.success("Category created 🎉");
            } else {
                const res = await apiPatch<
                    typeof form,
                    Category
                >(
                    client,
                    `/admin/categories/${editingId}`,
                    form
                );

                setCategories((prev) =>
                    prev.map((c) =>
                        c.id === editingId ? res : c
                    )
                );

                toast.success("Category updated ✏️");
            }

            setOpen(false);
            setForm(emptyForm);
            setEditingId(null);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleting(true);

            await apiDelete<void>(
                client,
                `/admin/categories/${deleteId}`
            );

            setCategories((prev) =>
                prev.filter((c) => c.id !== deleteId)
            );

            toast.success("Category deleted 🗑️");
            setDeleteId(null);
        } catch (err) {
            toast.error("Delete failed ❌");
        } finally {
            setDeleting(false);
        }
    };

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
            title: "",
            render: (row: Category) => (
                <RowDropdown
                    onEdit={() => {
                        setEditingId(row.id);
                        setForm({
                            name: row.name,
                            description: row.description,
                        });
                        setOpen(true);
                    }}
                    onDelete={() => setDeleteId(row.id)}
                />
            ),
        },
    ];

    return (
        <AdminMainLayout>
            <div className="p-6 space-y-4">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">
                        Categories
                    </h1>

                    <Button
                        onClick={() => {
                            setEditingId(null);
                            setForm(emptyForm);
                            setOpen(true);
                        }}
                    >
                        + Add Category
                    </Button>
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

                {/* CREATE / EDIT */}
                <AppModal
                    open={open}
                    onOpenChange={setOpen}
                    title={
                        editingId
                            ? "Edit Category"
                            : "Create Category"
                    }
                >
                    <div className="space-y-3">
                        <input
                            className="border p-2 w-full"
                            placeholder="Category name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                        />

                        <textarea
                            className="border p-2 w-full"
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description:
                                    e.target.value,
                                })
                            }
                        />

                        <Button onClick={handleSubmit}>
                            {editingId
                                ? "Update Category"
                                : "Create Category"}
                        </Button>
                    </div>
                </AppModal>

                {/* DELETE MODAL */}
                <AppModal
                    open={!!deleteId}
                    onOpenChange={() => setDeleteId(null)}
                    title="Delete Category"
                >
                    <div className="space-y-4">
                        <p>
                            Are you sure you want to delete this category?
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteId(null)}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="bg-red-600 text-white"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </Button>
                        </div>
                    </div>
                </AppModal>
            </div>
        </AdminMainLayout>
    );
}