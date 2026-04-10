"use client";

import { Package } from "lucide-react";
import OrderItem from "./OrderItem";

export default function OrderItems({ items }: { items: any[] }) {
    return (
        <div>
            <h3 className="flex items-center gap-2 font-semibold mb-3 text-gray-900 dark:text-gray-100">
                <Package className="w-5 h-5" />
                Items
            </h3>

            <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <OrderItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}