"use client";

export default function BookCardSkeleton() {
    return (
        <div className="w-full max-w-sm animate-pulse">
            <div className="relative bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm rounded-md overflow-hidden">
                {/* Image */}
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700" />

                {/* Content */}
                <div className="p-4">
                    <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2" /> {/* Title */}
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2" /> {/* Description */}
                    <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4" /> {/* Price */}

                    {/* Badges */}
                    <div className="flex gap-2 mt-2">
                        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
                        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-4">
                    <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}