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

type User = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
    is_verified: boolean;
};

const emptyForm = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "customer",
};

const extractData = (res: any) => {
    if (!res) return null;
    if (res.data?.data) return res.data.data;
    if (res.data) return res.data;
    return res;
};

export default function UserDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const fetchUsers = async (searchText = "") => {
        try {
            setLoading(true);

            const res = await apiGet<any[]>(
                client,
                `/admin/users?search=${encodeURIComponent(searchText)}`
            );

            const data = extractData(res);

            const normalized = Array.isArray(data)
                ? data.map((u: any) => ({
                    id: u.id,
                    email: u.email,
                    first_name: u.first_name,
                    last_name: u.last_name,
                    phone: u.phone,
                    role: u.role,
                    is_verified: u.is_verified,
                }))
                : [];

            setUsers(normalized);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchUsers(debouncedSearch);
    }, [debouncedSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleting(true);

            await apiDelete(client, `/admin/users/${deleteId}`);

            setUsers((prev) =>
                prev.filter((u) => u.id !== deleteId)
            );

            toast.success("User deleted 🗑️");
            setDeleteId(null);
        } catch (err) {
            console.error(err);
            toast.error("Delete failed ❌");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.email || !form.first_name) {
            toast.error("Required fields missing");
            return;
        }

        if (!editingId && !form.password) {
            toast.error("Password is required");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name,
                role: form.role,
                ...(form.phone && { phone: form.phone }),
                ...(!editingId && { password: form.password }),
            };


            // CREATE
            if (!editingId) {
                const res = await apiPost(client, "/admin/users", payload);

                const newUser = extractData(res);
                if (!newUser) throw new Error();

                setUsers((prev) => [newUser, ...prev]);

                toast.success("User created 🎉");
            }

            // UPDATE
            else {
                const res = await apiPatch(
                    client,
                    `/admin/users/${editingId}`,
                    payload
                );

                const updated = extractData(res);
                if (!updated) throw new Error();

                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === editingId
                            ? { ...u, ...updated }
                            : u
                    )
                );

                toast.success("User updated ✏️");
            }

            setForm(emptyForm);
            setEditingId(null);
            setOpen(false);
        } catch (err: any) {
            console.error("❌ ERROR:", err);


            toast.error(
                err?.response?.data?.message || "Something went wrong ❌"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const updateRole = async (id: string, role: string) => {
        try {
            await apiPatch(
                client,
                `/admin/users/${id}/role`,
                { role }
            );

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id ? { ...u, role } : u
                )
            );

            toast.success("Role updated ✅");
        } catch {
            toast.error("Role update failed ❌");
        }
    };

    const verifyUser = async (id: string) => {
        try {
            await apiPatch(client, `/admin/users/${id}/verify`, {});

            toast.success("User verified ✅");

            await fetchUsers();
        } catch {
            toast.error("Verify failed ❌");
        }
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setOpen(true);
    };

    const openEdit = (user: User) => {
        setEditingId(user.id);

        setForm({
            email: user.email ?? "",
            password: "",
            first_name: user.first_name ?? "",
            last_name: user.last_name ?? "",
            phone: user.phone ?? "",
            role: user.role ?? "customer",
        });

        setOpen(true);
    };



    const columns = [
        { key: "id", title: "ID" },
        { key: "email", title: "Email" },
        { key: "first_name", title: "First Name" },
        { key: "last_name", title: "Last Name" },
        { key: "phone", title: "Phone" },
        { key: "role", title: "Role" },
        {
            key: "verified",
            title: "Verified",
            render: (row: User) =>
                row.is_verified ? "✅" : "❌",
        },
        {
            key: "actions",
            title: "",
            render: (row: User) => (
                <div className="flex gap-2">
                    <RowDropdown
                        onEdit={() => openEdit(row)}
                        onDelete={() => setDeleteId(row.id)}
                    />

                    <Button
                        size="sm"
                        onClick={() => updateRole(row.id, "admin")}
                    >
                        Admin
                    </Button>

                    <Button
                        size="sm"
                        onClick={() => verifyUser(row.id)}
                    >
                        Verify
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminMainLayout>
            <div className="p-6 space-y-4">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold">Users</h1>
                    <Button onClick={openCreate}>+ Add User</Button>
                </div>

                <SearchBar value={search} onChange={setSearch} />

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <DataTable columns={columns} data={users} />
                )}

                {/* CREATE / EDIT */}
                <AppModal
                    open={open}
                    onOpenChange={setOpen}
                    title={editingId ? "Edit User" : "Create User"}
                >
                    <div className="space-y-3">
                        <input
                            className="border p-2 w-full"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value,
                                })
                            }
                        />

                        {!editingId && (
                            <input
                                type="password"
                                className="border p-2 w-full"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                            />
                        )}

                        <input
                            className="border p-2 w-full"
                            placeholder="First Name"
                            value={form.first_name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    first_name: e.target.value,
                                })
                            }
                        />

                        <input
                            className="border p-2 w-full"
                            placeholder="Last Name"
                            value={form.last_name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    last_name: e.target.value,
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

                        <select
                            className="border p-2 w-full"
                            value={form.role}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    role: e.target.value,
                                })
                            }
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>

                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting
                                ? "Saving..."
                                : editingId
                                    ? "Update User"
                                    : "Create User"}
                        </Button>
                    </div>
                </AppModal>

                {/* DELETE */}
                <AppModal
                    open={!!deleteId}
                    onOpenChange={() => setDeleteId(null)}
                    title="Delete User"
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