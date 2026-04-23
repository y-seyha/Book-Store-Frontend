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

type Driver = {
    id: number;
    plate_number: string;
    vehicle_type: string;
    is_available: boolean;
    user: {
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
    };
};

const emptyForm = {
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    plate_number: "",
    vehicle_type: "",
    is_available: true,
};

const extractData = (res: any) => {
    if (!res) return null;
    if (res.data?.data) return res.data.data;
    if (res.data) return res.data;
    return res;
};

export default function DriverDashboard() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchDrivers = async () => {
        try {
            setLoading(true);

            const res = await apiGet<any>(client, `/admin/delivery-driver`);
            const data = extractData(res);

            setDrivers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load drivers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleting(true);

            await apiDelete(client, `/admin/delivery-driver/${deleteId}`);

            setDrivers((prev) =>
                prev.filter((d) => d.id !== deleteId)
            );

            toast.success("Driver deleted 🗑️");
            setDeleteId(null);
        } catch (err) {
            console.error(err);
            toast.error("Delete failed ❌");
        } finally {
            setDeleting(false);
        }
    };

    const openEdit = (driver: Driver) => {
        setEditingId(driver.id);

        setForm({
            email: driver.user.email ?? "",
            first_name: driver.user.first_name ?? "",
            last_name: driver.user.last_name ?? "",
            phone: driver.user.phone ?? "",
            plate_number: driver.plate_number ?? "",
            vehicle_type: driver.vehicle_type ?? "",
            is_available: driver.is_available,
        });

        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.email || !form.plate_number) {
            toast.error("Email and plate number required");
            return;
        }

        try {
            const payload = {
                email: form.email.trim(),
                first_name: form.first_name?.trim(),
                last_name: form.last_name?.trim(),
                phone: form.phone?.trim(),
                plate_number: form.plate_number?.trim(),
                vehicle_type: form.vehicle_type?.trim(),
            };

            // CREATE
            if (!editingId) {
                const res = await apiPost(client, `/admin/delivery-driver`, payload);
                const newDriver = extractData(res);

                setDrivers((prev) => [newDriver.driver ?? newDriver, ...prev]);

                toast.success("Driver created 🚚");
            }

            // UPDATE
            else {
                const res = await apiPatch(
                    client,
                    `/admin/delivery-driver/${editingId}`,
                    payload
                );

                const updated = extractData(res);

                setDrivers((prev) =>
                    prev.map((d) =>
                        d.id === editingId
                            ? { ...d, ...updated }
                            : d
                    )
                );

                toast.success("Driver updated ✏️");
            }

            setOpen(false);
            setEditingId(null);
            setForm(emptyForm);
        } catch (err) {
            console.error(err);
            // console.log(err.response?.data);
            toast.error("Operation failed ❌");
        }
    };

    const filteredDrivers = drivers.filter((d) => {
        const q = search.toLowerCase();

        return (
            d.user.email?.toLowerCase().includes(q) ||
            d.user.first_name?.toLowerCase().includes(q) ||
            d.user.last_name?.toLowerCase().includes(q) ||
            d.plate_number?.toLowerCase().includes(q) ||
            d.vehicle_type?.toLowerCase().includes(q)
        );
    });

    const columns = [
        { key: "id", title: "ID" },

        {
            key: "name",
            title: "Driver",
            render: (row: Driver) =>
                `${row.user.first_name} ${row.user.last_name}`,
        },

        {
            key: "email",
            title: "Email",
            render: (row: Driver) => row.user.email,
        },

        {
            key: "phone",
            title: "Phone",
            render: (row: Driver) => row.user.phone,
        },

        {
            key: "vehicle",
            title: "Vehicle",
            render: (row: Driver) =>
                `${row.vehicle_type} (${row.plate_number})`,
        },

        {
            key: "status",
            title: "Available",
            render: (row: Driver) =>
                row.is_available ? "🟢 Yes" : "🔴 No",
        },

        {
            key: "actions",
            title: "",
            render: (row: Driver) => (
                <RowDropdown
                    onEdit={() => openEdit(row)}
                    onDelete={() => setDeleteId(row.id)}
                />
            ),
        },
    ];

    return (
        <AdminMainLayout>
            <div className="p-6 space-y-4">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold">
                        Delivery Drivers
                    </h1>

                    <Button
                        onClick={() => {
                            setOpen(true);
                            setEditingId(null);
                            setForm(emptyForm);
                        }}
                    >
                        + Add Driver
                    </Button>
                </div>

                <SearchBar value={search} onChange={setSearch} />

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <DataTable columns={columns} data={filteredDrivers} />
                )}

                {/* MODAL */}
                <AppModal
                    open={open}
                    onOpenChange={setOpen}
                    title={editingId ? "Edit Driver" : "Create Driver"}
                >
                    <div className="space-y-3">

                        <input
                            className="border p-2 w-full"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />

                        <input
                            className="border p-2 w-full"
                            placeholder="First Name"
                            value={form.first_name}
                            onChange={(e) =>
                                setForm({ ...form, first_name: e.target.value })
                            }
                        />

                        <input
                            className="border p-2 w-full"
                            placeholder="Last Name"
                            value={form.last_name}
                            onChange={(e) =>
                                setForm({ ...form, last_name: e.target.value })
                            }
                        />

                        <input
                            className="border p-2 w-full"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                        />

                        <input
                            className="border p-2 w-full"
                            placeholder="Plate Number"
                            value={form.plate_number}
                            onChange={(e) =>
                                setForm({ ...form, plate_number: e.target.value })
                            }
                        />

                        <input
                            className="border p-2 w-full"
                            placeholder="Vehicle Type"
                            value={form.vehicle_type}
                            onChange={(e) =>
                                setForm({ ...form, vehicle_type: e.target.value })
                            }
                        />

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.is_available}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        is_available: e.target.checked,
                                    })
                                }
                            />
                            Available
                        </label>

                        <Button onClick={handleSubmit}>
                            {editingId ? "Update" : "Create"}
                        </Button>
                    </div>
                </AppModal>

                {/* DELETE */}
                <AppModal
                    open={!!deleteId}
                    onOpenChange={() => setDeleteId(null)}
                    title="Delete Driver"
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