"use client";

import { Truck } from "lucide-react";

export default function OrderShipping({ order }: { order: any }) {
    return (
        <div>
            <h3 className="flex items-center gap-2 font-semibold mb-2 text-gray-900 dark:text-gray-100">
                <Truck className="w-5 h-5" />
                Shipping
            </h3>

            <p className="text-sm text-gray-800 dark:text-gray-200">
                {order.shipping_name} | {order.shipping_phone}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
                {order.shipping_address}, {order.shipping_city}
            </p>
        </div>
    );
}