export default function OrderItem({ item }: { item: any }) {
    return (
        <div className="flex gap-4 items-center">

            <img
                src={item.product.image_url || "/placeholder.png"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-md border"
            />

            <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {item.product.description}
                </p>

                <p className="text-sm mt-1">
                    Qty: {item.quantity} × ${item.price}
                </p>
            </div>
        </div>
    );
}