
"use client";

interface Review {
    user: string;
    rating: number;
    comment: string;
}

export default function BookReviews({ reviews }: { reviews: Review[] }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reviews</h2>
            {reviews.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
            )}

            {reviews.map((r, idx) => (
                <div
                    key={idx}
                    className="border-b border-gray-200 dark:border-gray-700 pb-3 flex flex-col gap-1"
                >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{r.user}</p>
                    <div className="text-yellow-500">{"⭐".repeat(r.rating)}</div>
                    <p className="text-gray-700 dark:text-gray-300">{r.comment}</p>
                </div>
            ))}
        </div>
    );
}