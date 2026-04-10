import { FaHashtag } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function OrderHeader({
                                        order,
                                        open,
                                    }: {
    order: any;
    open: boolean;
}) {
    return (
        <div className="flex justify-between items-start w-full">
            {/* Left: Order info */}
            <div className="flex flex-col">
                <p className="flex items-center gap-1 font-semibold text-lg">
                    <FaHashtag className="inline-block text-gray-600" /> Order #{order.id}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleDateString()} •{" "}
                    {order.items.length} item{order.items.length > 1 && "s"}
                </p>

                <p className="text-sm mt-1">📍 {order.shipping_city}</p>
            </div>

            {/* Right: Status + total + chevron */}
            <div className="flex flex-col items-end justify-between">
                <p className="text-yellow-600 capitalize font-medium">🟡 {order.status}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-lg">${order.total_price}</span>

                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}