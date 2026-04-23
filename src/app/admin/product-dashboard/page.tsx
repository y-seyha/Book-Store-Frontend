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
import StatusBadge from "@/components/common/admin/StatusBadge";
import { toast } from "sonner";
import AdminMainLayout from "@/components/layout/AdminMainLayout";

const client = createBrowserApiClient();

const emptyForm = {
    name: "",
    description: "",
    price: "",
    stock: 0,
    category_id: 0,
    image: null as File | null,
};

export default function ProductDashboard() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchProducts = async (searchText = "", pageNumber = 1) => {
        try {
            setLoading(true);

            const res = await apiGet<any>(
                client,
                `/products?page=${pageNumber}&limit=10&search=${encodeURIComponent(
                    searchText
                )}`
            );

            const payload = res;

            setProducts(payload.data || []);
            setPage(payload.page || 1);
            setLastPage(payload.lastPage || 1);
            setTotal(payload.total || 0);
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await apiGet<any[]>(client, "/admin/categories");
            setCategories(res ?? []);
        } catch (err) {
            console.error("Failed categories", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            await Promise.all([
                fetchProducts("", 1),
                fetchCategories(),
            ]);
        };
        init();
    }, []);

    /* SEARCH DEBOUNCE */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    /* SEARCH + RESET PAGE */
    useEffect(() => {
        setPage(1);
        fetchProducts(debouncedSearch, 1);
    }, [debouncedSearch]);

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleting(true);

            await apiDelete(client, `/products/${deleteId}`);

            toast.success("Product deleted 🗑️");

            await fetchProducts(debouncedSearch, page);
            setDeleteId(null);
        } catch (err) {
            console.error(err);
            toast.error("Delete failed ❌");
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteConfirm = (id: number) => {
        setDeleteId(id);
    };

    /*  CREATE / EDIT */
    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setOpen(true);
    };

    const openEdit = (product: any) => {
        setEditingId(product.id);

        setForm({
            name: product.name ?? "",
            description: product.description ?? "",
            price: product.price ?? "",
            stock: product.stock ?? 0,
            category_id: product.category?.id ?? 0,
            image: null,
        });

        setOpen(true);
    };

    // Table
    const columns = [
        { key: "id", title: "ID" },
        {
            key: "image",
            title: "Image",
            render: (row: any) =>
                row?.image_url ? (
                    <img
                        src={row.image_url}
                        className="w-10 h-10 rounded object-cover"
                    />
                ) : (
                    <span className="text-gray-400">No image</span>
                ),
        },
        { key: "name", title: "Name" },
        {
            key: "category",
            title: "Category",
            render: (row: any) => row?.category?.name ?? "-",
        },
        {
            key: "price",
            title: "Price",
            render: (row: any) => `$${row?.price ?? 0}`,
        },
        {
            key: "stock",
            title: "Stock",
            render: (row: any) => (
                <StatusBadge stock={row?.stock ?? 0} />
            ),
        },
        {
            key: "seller",
            title: "Seller",
            render: (row: any) =>
                `${row?.user?.first_name ?? ""} ${row?.user?.last_name ?? ""}`,
        },
        {
            key: "actions",
            title: "",
            render: (row: any) => (
                <RowDropdown
                    onEdit={() => openEdit(row)}
                    onDelete={() => openDeleteConfirm(row?.id)}
                />
            ),
        },
    ];

    /*  SUBMIT  */
    const handleSubmit = async () => {
        if (!form.name || !form.price || !form.category_id) {
            toast.error("Please fill required fields");
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", String(form.price));
            formData.append("stock", String(form.stock));
            formData.append("categoryId", String(form.category_id));

            if (form.image) {
                formData.append("file", form.image);
            }

            if (!editingId) {
                await apiPost(client, "/products", formData);
                toast.success("Product created 🎉");
            } else {
                await apiPatch(
                    client,
                    `/products/${editingId}`,
                    formData
                );
                toast.success("Product updated ✏️");
            }

            await fetchProducts(debouncedSearch, page);

            setForm(emptyForm);
            setEditingId(null);
            setOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong ❌");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminMainLayout>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">
                        Products
                    </h1>
                    <Button onClick={openCreate}>
                        + Add Product
                    </Button>
                </div>

                <SearchBar value={search} onChange={setSearch} />

                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={products.filter(Boolean)}
                        />

                        <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-gray-500">
                                Page {page} of {lastPage} • {total} items
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    disabled={page === 1}
                                    onClick={() => {
                                        const newPage = page - 1;
                                        setPage(newPage);
                                        fetchProducts(debouncedSearch, newPage);
                                    }}
                                >
                                    Prev
                                </Button>

                                <Button disabled>
                                    {page}
                                </Button>

                                <Button
                                    disabled={page === lastPage}
                                    onClick={() => {
                                        const newPage = page + 1;
                                        setPage(newPage);
                                        fetchProducts(debouncedSearch, newPage);
                                    }}
                                >
                                    Next
                                </Button>

                            </div>
                        </div>
                    </>
                )}

                <AppModal
                    open={open}
                    onOpenChange={setOpen}
                    title={editingId ? "Edit Product" : "Create Product"}
                >
                    <div className="space-y-3">
                        <input
                            className="border p-2 w-full"
                            placeholder="Product name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <textarea
                            className="border p-2 w-full"
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            className="border p-2 w-full"
                            placeholder="Price"
                            value={form.price}
                            onChange={(e) =>
                                setForm({ ...form, price: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            className="border p-2 w-full"
                            placeholder="Stock"
                            value={form.stock}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    stock: Number(e.target.value),
                                })
                            }
                        />

                        <select
                            className="border p-2 w-full"
                            value={form.category_id || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category_id: Number(e.target.value),
                                })
                            }
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="file"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    image: e.target.files?.[0] || null,
                                })
                            }
                        />

                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting
                                ? "Saving..."
                                : editingId
                                    ? "Update Product"
                                    : "Create Product"}
                        </Button>
                    </div>
                </AppModal>

                {/*//Confirm Delete Modal*/}
                <AppModal
                    open={!!deleteId}
                    onOpenChange={() => setDeleteId(null)}
                    title="Delete Product"
                >
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Are you sure you want to delete this product?
                            This action cannot be undone.
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
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </AppModal>
            </div>
        </AdminMainLayout>
    );
}