import { StatusBadgeProps } from "@/app/admin/payment-dashboard/page";

export default function StatusBadge({ stock, status }: StatusBadgeProps) {
    if (status) {
        const normalized = status.toLowerCase();

        const map: Record<string, string> = {
            success: "bg-green-100 text-green-700",
            failed: "bg-red-100 text-red-700",
            pending: "bg-yellow-100 text-yellow-700",
        };

        return (
            <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                    map[normalized] ?? "bg-gray-100 text-gray-700"
                }`}
            >
                {normalized.toUpperCase()}
            </span>
        );
    }

    if (stock !== undefined) {
        if (stock === 0) {
            return (
                <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">
                    Out of stock
                </span>
            );
        }

        if (stock < 5) {
            return (
                <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
                    Low stock
                </span>
            );
        }

        return (
            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                In stock
            </span>
        );
    }

    return null;
}