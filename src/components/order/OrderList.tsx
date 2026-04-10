import OrderCard from "./OrderCard";

export default function OrderList({ orders }: { orders: any[] }) {
    if (!orders.length) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-2 mt-20">No orders yet</h2>
                <p className="text-gray-500 text-lg">
                    Start shopping to see your orders here.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 ">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}