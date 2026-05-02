"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { apiGet, createBrowserApiClient } from "@/lib/api.helper";


import { DollarSign, ShoppingCart, Package } from "lucide-react";

import KpiCard from "@/components/Dashboard/admin/KpiCard";
import KpiGrid from "@/components/Dashboard/admin/KpiGrid";
import DashboardGrid from "@/components/Dashboard/admin/DashboardGrid";
import TopProductsCard from "@/components/Dashboard/admin/TopProductsCard";
import InsightCard from "@/components/Dashboard/admin/InsightCard";
import SellerMainLayout from "@/components/layout/SellerLayout";

const client = createBrowserApiClient();

type SellerDashboardData = {
    totalSales: number;
    totalOrders: number;

    topProducts: {
        productId: number;
        name: string;
        totalSold: number | string;
    }[];
};

export default function SellerDashboardPage() {
    const [data, setData] = useState<SellerDashboardData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const res = await apiGet<SellerDashboardData>(
                client,
                "/sellers/dashboard"
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

    // DERIVED
    const bestProduct = data?.topProducts?.[0];

    const avgOrderValue = useMemo(() => {
        if (!data?.totalSales || !data?.totalOrders) return "0.00";
        return (data.totalSales / data.totalOrders).toFixed(2);
    }, [data]);

    return (
        <SellerMainLayout>
            <div className="p-6 space-y-8">

                {/* HEADER */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">
                        Seller Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Track your sales and product performance
                    </p>
                </div>

                {/* KPI */}
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
                        title="Products"
                        value={data?.topProducts?.length ?? 0}
                        icon={<Package size={18} />}
                    />
                </KpiGrid>

                {/* MAIN GRID */}
                <DashboardGrid>
                    {/* TOP PRODUCTS */}
                    <div className="lg:col-span-8">
                        {data?.topProducts && (
                            <TopProductsCard items={data.topProducts} />
                        )}
                    </div>

                    {/* INSIGHTS */}
                    <div className="lg:col-span-4 space-y-4">
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
                </DashboardGrid>

                {/* LOADING */}
                {loading && (
                    <div className="text-sm text-muted-foreground">
                        Loading dashboard...
                    </div>
                )}
            </div>
        </SellerMainLayout>
    );
}