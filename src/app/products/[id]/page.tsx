"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookById } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import BookCarousel from "@/components/book/BookCarousel";
import MainLayout from "@/components/layout/MainLayout";
import AddToCart from "@/components/ui/AddToCart";

type Book = {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    category?: { id: number; name: string };
    image_url?: string;
    images?: string[];
    user?: { first_name: string; last_name: string; email: string };
};

export default function BookDetailsPage() {
    const params = useParams();
    const bookId = params.id as string;
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookId) return;

        const fetchBook = async () => {
            setLoading(true);
            try {
                const data = await getBookById(bookId);
                setBook(data);
            } catch (err) {
                console.error("Failed to fetch book:", err);
                setBook(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!book) return <div className="p-10 text-center">Book not found</div>;

    const images = book.images?.length
        ? book.images
        : book.image_url
            ? [book.image_url]
            : ["/placeholder-book.png"];

    const price = parseFloat(book.price ?? "0").toFixed(2);
    const isOutOfStock = book.stock <= 0;

    return (
        <MainLayout>
            <div className="mt-30  max-w-7xl mx-auto p-4 lg:p-8 flex flex-col gap-12">

                {/* Top Section: Book Details */}
                <div className="border rounded-lg p-6 flex flex-col md:flex-row gap-8 bg-white dark:bg-black shadow-sm">

                    {/* Image Carousel */}
                    <div className="flex-1 w-full md:w-1/2 relative">
                        {isOutOfStock && (
                            <Badge className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg shadow-md">
                                Out of Stock
                            </Badge>
                        )}
                        <BookCarousel images={images} name={book.name} />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 w-full md:w-1/2 flex flex-col gap-4 text-gray-900 dark:text-gray-100">
                        <h1 className="text-2xl md:text-3xl font-bold">{book.name}</h1>
                        <p className="text-gray-700 dark:text-gray-300">{book.description}</p>
                        <p className="text-xl md:text-2xl font-semibold">${price}</p>
                        <p className="text-sm text-gray-500">
                            {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
                        </p>

                        {book.category?.name && (
                            <p className="text-sm">
                                Category: <strong>{book.category.name}</strong>
                            </p>
                        )}

                        {book.user && (
                            <p className="text-sm">
                                Added by: <strong>{book.user.first_name} {book.user.last_name}</strong> ({book.user.email})
                            </p>
                        )}

                        {/* Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 flex-wrap">
                            <AddToCart stock={book.stock} productId={book.id} />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}