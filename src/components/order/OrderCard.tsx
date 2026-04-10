"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrderHeader from "./OrderHeader";
import OrderItems from "./OrderItems";
import OrderShipping from "./OrderShipping";
import {DollarSign} from "lucide-react";
import {toast} from "sonner";

export default function OrderCard({ order }: { order: any }) {
    const [open, setOpen] = useState(false);


    const handleClick = () => {
        toast.dismiss(); // remove previous toasts
        toast.error('This feature will comming soon');
    };

    return (
        <div
            className="mt-5 border rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all bg-white dark:bg-[#121212] "
            onClick={() => setOpen(!open)}
        >
            {/* Header */}
            <OrderHeader order={order} open={open} />

            {/* Animated dropdown */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden mt-4 md:mt-6 flex flex-col gap-4 md:gap-6"
                    >
                        <div className="border-t pt-4">
                            <OrderItems items={order.items} />
                        </div>

                        <div className="border-t pt-4">
                            <OrderShipping order={order} />
                        </div>

                        <div className="border-t pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
      <span className="flex items-center gap-2 font-semibold text-lg md:text-xl text-gray-900 dark:text-gray-100">
        <DollarSign className="w-5 h-5" />
        Total: ${order.total_price}
      </span>

                            <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
                            onClick={handleClick}>
                                View Details
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}