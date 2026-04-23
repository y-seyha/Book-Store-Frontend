"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    apiDelete,
    apiGet,
    apiPatch, apiPut,
    createBrowserApiClient,
} from "@/lib/api.helper";

import SearchBar from "@/components/common/admin/SearchBar";
import AppModal from "@/components/common/admin/Modal";
import DataTable from "@/components/common/admin/DataTable";
import RowDropdown from "@/components/common/admin/RowDropdown";
import { toast } from "sonner";
import AdminMainLayout from "@/components/layout/AdminMainLayout";

const client = createBrowserApiClient();

type Seller = {
    id: string;
    store_name: string;
    store_description: string;
    store_address: string;
    phone: string;
    logo_url: string | null;
    user: {
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        is_verified: boolean;
    };
};

const emptyForm = {
    store_name: "",
    store_description: "",
    store_address: "",
    phone: "",
    logo: null as File | null,
};

const extractData = (res: any) => {
    if (!res) return null;
    if (res.data?.data) return res.data.data;
    if (res.data) return res.data;
    return res;
};

export default function SellerDashboard() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchSellers = async () => {
        try {
            setLoading(true);

            const res = await apiGet<any>(
                client,
                `/sellers/admin`
            );

            const data = extractData(res);

            setSellers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load sellers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        void fetchSellers();
    }, [debouncedSearch]);

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleting(true);

            await apiDelete(client, `/sellers/admin/${deleteId}`);

            setSellers((prev) =>
                prev.filter((s) => s.id !== deleteId)
            );

            toast.success("Seller deleted 🗑️");
            setDeleteId(null);
        } catch (err) {
            console.error(err);
            toast.error("Delete failed ❌");
        } finally {
            setDeleting(false);
        }
    };

    const openEdit = (seller: Seller) => {
        setEditingId(seller.id);

        setForm({
            store_name: seller.store_name ?? "",
            store_description: seller.store_description ?? "",
            store_address: seller.store_address ?? "",
            phone: seller.phone ?? "",
            logo: null,
        });

        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.store_name) {
            toast.error("Store name required");
            return;
        }

        try {
            if (!editingId) {
                toast.error("Create not implemented yet");
                return;
            }

            const payload = {
                store_name: form.store_name,
                store_description: form.store_description,
                store_address: form.store_address,
                phone: form.phone,
            };

            const res = await apiPut(
                client,
                `/sellers/admin/${editingId}`,
                payload
            );

            const updated = extractData(res);

            setSellers((prev) =>
                prev.map((s) =>
                    s.id === editingId ? { ...s, ...updated } : s
                )
            );

            toast.success("Seller updated ✏️");

            setOpen(false);
            setEditingId(null);
            setForm(emptyForm);
        } catch (err) {
            console.error(err);
            toast.error("Update failed ❌");
        }
    };

    const columns = [

        { key: "id", title: "ID" },

        {
            key: "store",
            title: "Store",
            render: (row: Seller) => (
                <div>
                    <div className="font-medium">{row.store_name}</div>
                    <div className="text-xs text-gray-500">
                        {row.store_description}
                    </div>
                </div>
            ),
        },

        {
            key: "owner",
            title: "Owner",
            render: (row: Seller) =>
                `${row.user.first_name} ${row.user.last_name}`,
        },

        {
            key: "email",
            title: "Email",
            render: (row: Seller) => row.user.email,
        },

        {
            key: "verified",
            title: "Verified",
            render: (row: Seller) =>
                row.user.is_verified ? "✅" : "❌",
        },

        {
            key: "actions",
            title: "",
            render: (row: Seller) => (
                <RowDropdown
                    onEdit={() => openEdit(row)}
                    onDelete={() => setDeleteId(row.id)}
                />
            ),
        },
    ];

    const filteredSellers = sellers.filter((s) => {
        const q = search.toLowerCase();

        return (
            s.store_name?.toLowerCase().includes(q) ||
            s.store_description?.toLowerCase().includes(q) ||
            s.store_address?.toLowerCase().includes(q) ||
            s.phone?.toLowerCase().includes(q) ||
            s.user.email?.toLowerCase().includes(q) ||
            s.user.first_name?.toLowerCase().includes(q) ||
            s.user.last_name?.toLowerCase().includes(q)
        );
    });

    return (
        <AdminMainLayout>
            <div className="p-6 space-y-4">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold">Sellers</h1>
                </div>

                <SearchBar value={search} onChange={setSearch} />

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <DataTable columns={columns} data={filteredSellers} />
                )}

                {/* EDIT MODAL */}
                <AppModal
                    open={open}
                    onOpenChange={setOpen}
                    title="Edit Seller"
                >
                    <div className="space-y-3">
                        <input
                            className="border p-2 w-full"
                            placeholder="Store Name"
                            value={form.store_name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    store_name: e.target.value,
                                })
                            }
                        />

                        <textarea
                            className="border p-2 w-full"
                            placeholder="Description"
                            value={form.store_description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    store_description: e.target.value,
                                })
                            }
                        />

                        <input
                            className="border p-2 w-full"
                            placeholder="Address"
                            value={form.store_address}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    store_address: e.target.value,
                                })
                            }
                        />

                        <input
                            className="border p-2 w-full"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    phone: e.target.value,
                                })
                            }
                        />

                        <input
                            type="file"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    logo: e.target.files?.[0] || null,
                                })
                            }
                        />

                        <Button onClick={handleSubmit}>
                            Update Seller
                        </Button>
                    </div>
                </AppModal>

                {/* DELETE */}
                <AppModal
                    open={!!deleteId}
                    onOpenChange={() => setDeleteId(null)}
                    title="Delete Seller"
                >
                    <div className="space-y-4">
                        <p>Are you sure?</p>

                        <div className="flex justify-end gap-2">
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
                                {deleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </AppModal>
            </div>
        </AdminMainLayout>
    );
}