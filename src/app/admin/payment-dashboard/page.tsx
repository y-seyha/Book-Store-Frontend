"use client";

import { useEffect, useState } from "react";

import {
    apiGet,
    apiPatch,
    createBrowserApiClient,
} from "@/lib/api.helper";

import SearchBar from "@/components/common/admin/SearchBar";
import DataTable from "@/components/common/admin/DataTable";
import RowDropdown from "@/components/common/admin/RowDropdown";
import StatusBadge from "@/components/common/admin/StatusBadge";
import { toast } from "sonner";
import AdminMainLayout from "@/components/layout/AdminMainLayout";

const client = createBrowserApiClient();

export type StatusBadgeProps = {
    stock?: number;
    status?: "PENDING" | "SUCCESS" | "FAILED";
};

type Payment = {
    id: number;
    amount: number;
    method: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
    paid_at?: string | null;

    order?: {
        id: number;
        user?: {
            email: string;
        };
    };
};

export default function PaymentDashboard() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("");
    const [methodFilter, setMethodFilter] = useState("");

    const fetchPayments = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (search) params.append("search", search);
            if (statusFilter) params.append("status", statusFilter);
            if (methodFilter) params.append("method", methodFilter);

            const queryString = params.toString();
            const url = `/admin/payments${queryString ? `?${queryString}` : ""}`;

            const res = await apiGet<Payment[]>(client, url);

            setPayments(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load payments ❌");
        } finally {
            setLoading(false);
        }
    };

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const run = async () => {
            await fetchPayments();
        };
        run();
    }, [debouncedSearch, statusFilter, methodFilter]);

    const confirmPayment = async (id: number) => {
        try {
            await apiPatch(client, `/admin/payments/${id}/confirm`, {});

            setPayments((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? {
                            ...p,
                            status: "SUCCESS",
                            paid_at: new Date().toISOString(),
                        }
                        : p
                )
            );

            toast.success("Payment confirmed ✅");
        } catch (err) {
            console.error(err);
            toast.error("Confirm failed ❌");
        }
    };

    const rejectPayment = async (id: number) => {
        try {
            await apiPatch(client, `/admin/payments/${id}/reject`, {});

            setPayments((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, status: "FAILED" } : p
                )
            );

            toast.success("Payment rejected ❌");
        } catch (err) {
            console.error(err);
            toast.error("Reject failed");
        }
    };

    // const updateStatus = async (
    //     id: number,
    //     status: "PENDING" | "SUCCESS" | "FAILED"
    // ) => {
    //     try {
    //         await apiPatch(client, `/admin/payments/${id}/status`, {
    //             status,
    //         });
    //
    //         setPayments((prev) =>
    //             prev.map((p) =>
    //                 p.id === id ? { ...p, status } : p
    //             )
    //         );
    //
    //         toast.success("Status updated ✏️");
    //     } catch (err) {
    //         console.error(err);
    //         toast.error("Update failed");
    //     }
    // };


    // table
    const columns = [
        { key: "id", title: "ID" },

        {
            key: "order",
            title: "Order ID",
            render: (row: Payment) => row?.order?.id ?? "-",
        },

        {
            key: "user",
            title: "User",
            render: (row: Payment) =>
                row?.order?.user?.email ?? "-",
        },

        {
            key: "amount",
            title: "Amount",
            render: (row: Payment) => `$${row?.amount ?? 0}`,
        },

        {
            key: "method",
            title: "Method",
        },

        {
            key: "status",
            title: "Status",
            render: (row: Payment) => (
                <StatusBadge status={row.status} />
            ),
        },

        {
            key: "paid_at",
            title: "Paid At",
            render: (row: Payment) =>
                row?.paid_at
                    ? new Date(row.paid_at).toLocaleString()
                    : "-",
        },

        {
            key: "actions",
            title: "",
            render: (row: Payment) => (
                <RowDropdown
                    onEdit={() => confirmPayment(row.id)}
                    onDelete={() => rejectPayment(row.id)}
                    editLabel="Confirm Payment"
                    deleteLabel="Reject Payment"
                />
            ),
        },
    ];

    return (
        <AdminMainLayout>
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-semibold">Payments</h1>

                {/* Filters */}
                <div className="flex gap-3">
                    <SearchBar value={search} onChange={setSearch} />

                    <select
                        className="border p-2"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">PENDING</option>
                        <option value="success">SUCCESS</option>
                        <option value="failed">FAILED</option>
                    </select>

                    <select
                        className="border p-2"
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                    >
                        <option value="">All Methods</option>
                        <option value="card">CARD</option>
                        <option value="cod">CASH</option>
                        <option value="aba">ABA</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading payments...</p>
                ) : (
                    <DataTable columns={columns} data={payments} />
                )}
            </div>
        </AdminMainLayout>
    );
}