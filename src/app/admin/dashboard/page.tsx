"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { apiGet, createBrowserApiClient } from "@/lib/api.helper";

import AdminMainLayout from "@/components/layout/AdminMainLayout";

import { DollarSign, ShoppingCart, Users } from "lucide-react";

import KpiCard from "@/components/Dashboard/admin/KpiCard";
import KpiGrid from "@/components/Dashboard/admin/KpiGrid";
import DashboardGrid from "@/components/Dashboard/admin/DashboardGrid";
import TopProductsCard from "@/components/Dashboard/admin/TopProductsCard";
import InsightCard from "@/components/Dashboard/admin/InsightCard";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const client = createBrowserApiClient();

type DashboardData = {
    totalSales: number;
    totalOrders: number;
    activeUsers: number;
    totalSellers: number;
    totalDrivers: number;

    topProducts: {
        productId: number;
        name: string;
        totalSold: number | string;
    }[];

    revenueChart: {
        date: string;
        revenue: string;
    }[];
};

export default function AdminDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch
    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const res = await apiGet<DashboardData>(
                client,
                "/admin/dashboard"
            );

            setData(res);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load dashboard ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    // DERIVED DATA
    const chartData = useMemo(() => {
        return (
            data?.revenueChart?.map((item) => ({
                date: new Date(item.date).toLocaleDateString(),
                revenue: Number(item.revenue),
                orders: Math.floor(Number(item.revenue) / 10), // temporary derived metric
            })) ?? []
        );
    }, [data]);

    const bestProduct = data?.topProducts?.[0];

    const avgOrderValue = useMemo(() => {
        if (!data?.totalSales || !data?.totalOrders) return "0.00";
        return (data.totalSales / data.totalOrders).toFixed(2);
    }, [data]);

    return (
        <AdminMainLayout>
            <div className="p-6 space-y-8">

                {/* HEADER */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of sales, users, and performance
                    </p>
                </div>

                {/* KPI GRID */}
                <KpiGrid>
                    <KpiCard
                        title="Total Sales"
                        value={`$${data?.totalSales ?? 0}`}
                        icon={<DollarSign size={18} />}
                    />

                    <KpiCard
                        title="Total Orders"
                        value={data?.totalOrders ?? 0}
                        icon={<ShoppingCart size={18} />}
                    />

                    <KpiCard
                        title="Active Users"
                        value={data?.activeUsers ?? 0}
                        icon={<Users size={18} />}
                    />

                    <KpiCard
                        title="Total Sellers"
                        value={data?.totalSellers ?? 0}
                        icon={<Users size={18} />}
                    />

                    <KpiCard
                        title="Total Drivers"
                        value={data?.totalDrivers ?? 0}
                        icon={<Users size={18} />}
                    />
                </KpiGrid>

                {/* MAIN GRID */}
                <DashboardGrid>
                    {/* REVENUE CHART */}
                    <div className="lg:col-span-8 rounded-xl border bg-white shadow-sm p-5">
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-semibold">
                                    Revenue Overview
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Last performance trends
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                    Avg per order
                                </p>
                                <p className="text-sm font-semibold">
                                    ${avgOrderValue}
                                </p>
                            </div>
                        </div>

                        {/* CHART */}
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>

                                                <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>

                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />

                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#3b82f6"
                                                fill="url(#rev)"
                                                strokeWidth={2}
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="orders"
                                                stroke="#10b981"
                                                fill="url(#orders)"
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* TOP PRODUCTS */}
                    <div className="lg:col-span-4">
                        {data?.topProducts && (
                            <TopProductsCard items={data.topProducts} />
                        )}
                    </div>
                </DashboardGrid>

                {/* INSIGHTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InsightCard
                        title="Best Selling Product"
                        value={
                            bestProduct
                                ? `${bestProduct.name} (${bestProduct.totalSold})`
                                : "-"
                        }
                    />

                    <InsightCard
                        title="Average Order Value"
                        value={`$${avgOrderValue}`}
                    />
                </div>

                {/* LOADING STATE */}
                {loading && (
                    <div className="text-sm text-muted-foreground">
                        Loading dashboard...
                    </div>
                )}
            </div>
        </AdminMainLayout>
    );
}