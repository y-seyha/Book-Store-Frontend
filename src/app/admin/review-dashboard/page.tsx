"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
    apiGet,
    apiPatch,
    apiDelete,
    createBrowserApiClient, apiPut,
} from "@/lib/api.helper";

import SearchBar from "@/components/common/admin/SearchBar";
import DataTable from "@/components/common/admin/DataTable";
import RowDropdown from "@/components/common/admin/RowDropdown";
import AdminMainLayout from "@/components/layout/AdminMainLayout";
import AppModal from "@/components/common/admin/Modal";
import { Button } from "@/components/ui/button";

const client = createBrowserApiClient();

type Review = {
    id: number;
    rating: number;
    comment: string;

    user?: {
        email: string;
    };

    product?: {
        id: number;
        name: string;
    };

    created_at?: string;
};

export default function ReviewDashboard() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selected, setSelected] = useState<Review | null>(null);
    const [editComment, setEditComment] = useState("");

    const fetchReviews = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (debouncedSearch) params.append("search", debouncedSearch);
            if (ratingFilter) params.append("rating", ratingFilter);

            const url = `/reviews/admin/all${
                params.toString() ? `?${params.toString()}` : ""
            }`;

            const res = await apiGet<{ data: Review[] }>(client, url);

            setReviews(res?.data ?? []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load reviews ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchReviews();
    }, [debouncedSearch, ratingFilter]);

    const openEdit = (review: Review) => {
        setSelected(review);
        setEditComment(review.comment);
        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!selected) return;

        try {
            await apiPut(client, `/reviews/admin/${selected.id}`, {
                comment: editComment,
            });

            setReviews((prev) =>
                prev.map((r) =>
                    r.id === selected.id ? { ...r, comment: editComment } : r
                )
            );

            toast.success("Review updated ✏️");
            setEditOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Update failed ❌");
        }
    };

    const openDelete = (review: Review) => {
        setSelected(review);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!selected) return;

        try {
            await apiDelete(client, `/reviews/admin/${selected.id}`);

            setReviews((prev) => prev.filter((r) => r.id !== selected.id));

            toast.success("Review deleted 🗑️");
            setDeleteOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Delete failed ❌");
        }
    };

    const columns = [
        { key: "id", title: "ID" },

        {
            key: "product",
            title: "Product",
            render: (row: Review) => row?.product?.name ?? "-",
        },

        {
            key: "user",
            title: "User",
            render: (row: Review) => row?.user?.email ?? "-",
        },

        {
            key: "rating",
            title: "Rating",
            render: (row: Review) => (
                <span>
                    {"⭐".repeat(row.rating)} ({row.rating})
                </span>
            ),
        },

        {
            key: "comment",
            title: "Comment",
            render: (row: Review) => (
                <span className="text-gray-600">{row.comment}</span>
            ),
        },

        {
            key: "actions",
            title: "",
            render: (row: Review) => (
                <RowDropdown
                    onEdit={() => openEdit(row)}
                    onDelete={() => openDelete(row)}
                />
            ),
        },
    ];

    return (
        <AdminMainLayout>
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-semibold">Reviews</h1>

                {/* FILTERS */}
                <div className="flex gap-3">
                    <SearchBar value={search} onChange={setSearch} />

                    <select
                        className="border p-2"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                    >
                        <option value="">All Ratings</option>
                        <option value="5">5 ⭐</option>
                        <option value="4">4 ⭐</option>
                        <option value="3">3 ⭐</option>
                        <option value="2">2 ⭐</option>
                        <option value="1">1 ⭐</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading reviews...</p>
                ) : (
                    <DataTable columns={columns} data={reviews} />
                )}

                {/*  EDIT MODAL  */}
                <AppModal
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    title="Edit Review"
                >
                    <div className="space-y-3">
                        <textarea
                            className="border p-2 w-full"
                            value={editComment}
                            onChange={(e) =>
                                setEditComment(e.target.value)
                            }
                        />

                        <Button onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </div>
                </AppModal>

                {/*  DELETE MODAL  */}
                <AppModal
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    title="Delete Review"
                >
                    <div className="space-y-4">
                        <p>
                            Are you sure you want to delete this review?
                        </p>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="bg-red-600 text-white"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </AppModal>
            </div>
        </AdminMainLayout>
    );
}