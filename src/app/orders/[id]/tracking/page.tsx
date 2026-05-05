"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaMotorcycle, FaUser, FaPhone} from "react-icons/fa";

import {
    createBrowserApiClient,
    apiGet, apiPost,
} from "@/lib/api.helper";
import {DeliveryStatus, Order} from "@/types";
import MainLayout from "@/components/layout/MainLayout";
import {Breadcrumb, BreadcrumbItem} from "@/components/ui/Breadcrumb";
import {BsCreditCard2Front} from "react-icons/bs";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {cn, getStatusMessage} from "@/lib/utils";
import {toast} from "sonner";

export default function DeliveryTrackingPage() {
    const { id } = useParams();
    const api = createBrowserApiClient();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchOrder = async () => {
        try {
            const data = await apiGet<Order>(api, `/orders/${id}`);

            if (!data || typeof data !== "object") {
                throw new Error("Invalid order response");
            }
            setOrder(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);


    const handleCancel = async () => {
        try {
            setCancelling(true);

            await apiPost(api, `/orders/${id}/client-cancel`);

            toast.success("Order cancelled successfully");

            await fetchOrder();
        } catch (err) {
            console.error(err);

            toast.error("Failed to cancel order");
        } finally {
            setCancelling(false);
        }
    };

    if (loading || !order) return <div className="p-6">Loading...</div>;
    const payment = order ? order.payments?.[0] ?? null : null;

    const tracking = order.tracking;

    const steps: DeliveryStatus[] = [
        "preparing",
        "picked_up",
        "on_the_way",
        "delivered",
        "cancelled",
    ];

    return (
        <MainLayout>
            <div className="max-w-6xl mt-20 mx-auto p-4 md:p-6 space-y-6">
                <Breadcrumb>
                    <BreadcrumbItem href="/">Home</BreadcrumbItem>
                    <BreadcrumbItem href="/orders">Orders</BreadcrumbItem>
                    <BreadcrumbItem isLast>Tracking</BreadcrumbItem>
                </Breadcrumb>

                {/* ORDER + STATUS */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order #{order.id}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                Placed On:{" "}
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                            {/* PAYMENT STATUS */}
                            {/* PAYMENT STATUS */}
                            <div className="flex items-center gap-2">
                                <span>Payment:</span>

                                <Badge
                                    className={
                                        payment?.status === "success"
                                            ? "bg-green-500 text-white"
                                            : payment?.status === "pending"
                                                ? "bg-yellow-500 text-black"
                                                : "bg-red-500 text-white"
                                    }
                                >
                                    {payment?.status ?? "NO PAYMENT"}
                                </Badge>
                            </div>

                            {payment?.method && (
                                <p className="text-muted-foreground">
                                    Method: {payment.method}
                                </p>
                            )}

                            {payment?.paid_at && (
                                <p className="text-muted-foreground">
                                    Paid at: {new Date(payment.paid_at).toLocaleString()}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Delivery Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Status</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center justify-between text-xs md:text-sm font-medium">
                                {steps.map((step, index) => {
                                    const isActive = tracking?.status === step;
                                    const isCancelled = tracking?.status === "cancelled";
                                    const isPassed =
                                        steps.indexOf(tracking?.status as DeliveryStatus) >= index;

                                    return (
                                        <div key={step} className="flex flex-col items-center flex-1">
                                            {/* Circle */}
                                            <div
                                                className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center border",
                                                    isCancelled
                                                        ? "bg-red-500 text-white border-red-500"
                                                        : isPassed
                                                            ? "bg-green-500 text-white border-green-500"
                                                            : "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {index + 1}
                                            </div>

                                            {/* Label */}
                                            <span
                                                className={cn(
                                                    "mt-2 text-center text-[10px] md:text-xs",
                                                    isCancelled
                                                        ? "text-red-500 font-semibold"
                                                        : isActive && "font-bold text-green-700"
                                                )}

                                            >


                            {step.replace("_", " ")}
                        </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Message under steps */}
                            <div className="mt-4 text-sm text-muted-foreground text-center">
                                {getStatusMessage(tracking?.status)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* DRIVER + ADDRESS */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Driver */}
                    {order.tracking?.driverProfile ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Driver Profile</CardTitle>
                            </CardHeader>

                            <CardContent className="text-sm space-y-3">
                                <div className="flex items-center gap-2">
                                    <FaUser />
                                    <span>
                {order.tracking.driverProfile.user.first_name}{" "}
                                        {order.tracking.driverProfile.user.last_name}
            </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FaPhone />
                                    <span>{order.tracking.driverProfile.user.phone}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <FaMotorcycle />
                                    <span>{order.tracking.driverProfile.vehicle_type}</span>
                                </div>

                                {order.tracking.driverProfile.plate_number && (
                                    <div className="flex items-center gap-2">
                                        <BsCreditCard2Front />
                                        <span>{order.tracking.driverProfile.plate_number}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="text-sm text-muted-foreground py-6 text-center">
                                No driver assigned yet
                            </CardContent>
                        </Card>
                    )}

                    {/* Address placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle>📍 Delivery Address</CardTitle>
                        </CardHeader>

                        <CardContent className="text-sm space-y-2">
                            <div className="space-y-1">
                                <p><span className="font-semibold">Customer:</span> {order.shipping_name}</p>
                                <p><span className="font-semibold">Phone:</span> {order.shipping_phone}</p>
                                <p><span className="font-semibold">City:</span> {order.shipping_city}</p>
                                <p><span className="font-semibold">Address:</span> {order.shipping_address}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ITEMS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between text-sm border-b pb-2"
                                >
                                    <div>
                                        {item.quantity}x {item.product.name}
                                    </div>

                                    <div>
                                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TOTAL */}
                        <div className="flex justify-between font-semibold pt-3 border-t">
                            <span>Total</span>
                            <span>${order.total_price}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* ACTION */}
                {order.status !== "completed" &&
                    order.status !== "cancelled" && (
                        <div className="flex justify-end">
                            <Button
                                variant="destructive"
                                onClick={() => setOpen(true)}
                                disabled={cancelling}
                            >
                                {cancelling ? "Cancelling..." : "Cancel Order"}
                            </Button>

                            <ConfirmModal
                                isOpen={open}
                                title="Cancel this order?"
                                description="This will refund stock, update driver, and mark payment as failed."
                                confirmText="Yes, Cancel"
                                cancelText="No"
                                loading={cancelling}
                                onCancel={() => setOpen(false)}
                                onConfirm={async () => {
                                    setOpen(false);
                                    await handleCancel();
                                }}
                            />
                        </div>
                    )}
            </div>
        </MainLayout>
    );
}
