"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    apiGet,
    apiPatch,
    createBrowserApiClient,
} from "@/lib/api.helper";

import SearchBar from "@/components/common/admin/SearchBar";
import AppModal from "@/components/common/admin/Modal";
import DataTable from "@/components/common/admin/DataTable";
import { toast } from "sonner";
import AdminMainLayout from "@/components/layout/AdminMainLayout";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {MoreHorizontal} from "lucide-react";

const client = createBrowserApiClient();

type DeliveryStatus =
    | "pending"
    | "assigned"
    | "on_the_way"
    | "delivered"
    | "cancelled";

type Driver = {
    id: number;
    plate_number: string;
    vehicle_type: string;
    user: {
        first_name: string;
        last_name: string;
    };
};

type Tracking = {
    id: number;
    status: DeliveryStatus;

    order: {
        id: number;
    };

    driverProfile?: Driver;
};

const emptyFail = {
    reason: "",
};

const extractData = (res: any) => {
    if (!res) return null;
    if (res.data?.data) return res.data.data;
    if (res.data) return res.data;
    return res;
};

export default function DeliveryTrackingDashboard() {
    const [trackings, setTrackings] = useState<Tracking[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [_loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [assignOpen, setAssignOpen] = useState(false);
    const [failOpen, setFailOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
    const [failForm, setFailForm] = useState(emptyFail);

    const fetchTracking = async () => {
        try {
            setLoading(true);

            const res = await apiGet(client, `/admin/delivery-tracking`);
            const data = extractData(res);

            setTrackings(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error("Failed to load tracking");
        } finally {
            setLoading(false);
        }
    };

    const fetchDrivers = async () => {
        try {
            const res = await apiGet(client, `/admin/delivery-driver`);
            const data = extractData(res);

            setDrivers(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error("Failed to load drivers");
        }
    };

    useEffect(() => {
        fetchTracking();
        fetchDrivers();
    }, []);

    const assignDriver = async () => {
        if (!selectedId || !selectedDriverId) return;

        await apiPatch(
            client,
            `/admin/delivery-tracking/${selectedId}/assign-driver`,
            {
                driverProfileId: selectedDriverId,
            }
        );

        toast.success("Driver assigned 🚚");
        setAssignOpen(false);
        fetchTracking();
    };

    const markFailed = async () => {
        if (!selectedId) return;

        await apiPatch(
            client,
            `/admin/delivery-tracking/${selectedId}/fail`,
            {
                reason: failForm.reason,
            }
        );

        toast.success("Marked failed ❌");
        setFailOpen(false);
        setFailForm(emptyFail);
        fetchTracking();
    };

    const markDelivered = async (id: number) => {
        await apiPatch(
            client,
            `/admin/delivery-tracking/${id}/delivered`,
            {}
        );

        toast.success("Delivered 🎉");
        fetchTracking();
    };

    const filtered = trackings.filter((t) => {
        const q = search.toLowerCase();

        return (
            t.status?.toLowerCase().includes(q) ||
            t.order?.id?.toString().includes(q) ||
            t.driverProfile?.user?.first_name?.toLowerCase().includes(q)
        );
    });

    const columns = [
        { key: "id", title: "ID" },

        {
            key: "order",
            title: "Order",
            render: (row: Tracking) => `#${row.order.id}`,
        },

        {
            key: "driver",
            title: "Driver",
            render: (row: Tracking) =>
                row.driverProfile
                    ? `${row.driverProfile.user.first_name} ${row.driverProfile.user.last_name}`
                    : "Unassigned",
        },

        {
            key: "status",
            title: "Status",
            render: (row: Tracking) => row.status,
        },

        {
            key: "actions",
            title: "Actions",
            render: (row: Tracking) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">

                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedId(row.id);
                                setAssignOpen(true);
                            }}
                        >
                            Assign Driver
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => markDelivered(row.id)}
                            className="text-green-600"
                        >
                            Mark Delivered
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedId(row.id);
                                setFailOpen(true);
                            }}
                            className="text-red-600"
                        >
                            Mark Failed
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }
    ];

    return (
        <AdminMainLayout>
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-semibold">
                    Delivery Tracking
                </h1>

                <SearchBar value={search} onChange={setSearch} />

                <DataTable columns={columns} data={filtered} />

                <AppModal
                    open={assignOpen}
                    onOpenChange={setAssignOpen}
                    title="Assign Driver"
                >
                    <div className="space-y-3">
                        <select
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setSelectedDriverId(Number(e.target.value))
                            }
                        >
                            <option value="">Select driver</option>

                            {drivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.user.first_name} {d.user.last_name}
                                </option>
                            ))}
                        </select>

                        <Button onClick={assignDriver}>
                            Assign
                        </Button>
                    </div>
                </AppModal>

                <AppModal
                    open={failOpen}
                    onOpenChange={setFailOpen}
                    title="Mark Failed"
                >
                    <div className="space-y-3">
                        <input
                            className="border p-2 w-full"
                            placeholder="Reason"
                            value={failForm.reason}
                            onChange={(e) =>
                                setFailForm({ reason: e.target.value })
                            }
                        />

                        <Button
                            className="bg-red-600 text-white"
                            onClick={markFailed}
                        >
                            Confirm
                        </Button>
                    </div>
                </AppModal>
            </div>
        </AdminMainLayout>
    );
}