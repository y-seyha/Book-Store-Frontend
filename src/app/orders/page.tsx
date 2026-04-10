"use client";

import { useEffect, useState } from "react";
import { createBrowserApiClient, apiGet } from "@/lib/api.helper";
import OrderList from "@/components/order/OrderList";
import MainLayout from "@/components/layout/MainLayout";


export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const client = createBrowserApiClient();
                const res = await apiGet<any>(client, "/orders/me");
                setOrders(res);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
       <MainLayout>
           <section className="max-w-5xl mx-auto mt-20 px-4 pb-20">
               <h1 className="text-3xl font-bold">My Orders</h1>

               {loading ? (
                   <p>Loading...</p>
               ) : (
                   <OrderList orders={orders} />
               )}
           </section>
       </MainLayout>
    );
}