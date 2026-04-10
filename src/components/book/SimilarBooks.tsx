// components/book/SimilarBooks.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {Navigation} from "swiper/modules";
import { Button } from "@/components/ui/button";

interface SimilarBook {
    id: string;
    cover: string;
    name: string;
    price: number;
}

export default function SimilarBooks({ books }: { books: SimilarBook[] }) {
    if (books.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Similar Books
            </h2>

            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                }}
            >
                {books.map((b) => (
                    <SwiperSlide key={b.id}>
                        <div className="flex flex-col gap-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow">
                            <img
                                src={b.cover}
                                alt={b.name}
                                className="w-full h-48 object-cover rounded-md"
                            />
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{b.name}</p>
                            <p className="text-gray-600 dark:text-gray-400">${b.price.toFixed(2)}</p>
                            <Button size="sm">View</Button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}