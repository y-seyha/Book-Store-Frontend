"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { FiShoppingCart, FiTag, FiBox, FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoQrCodeOutline } from "react-icons/io5";
import BookCardSkeleton from "@/components/skeleton/BookCardSkeleton";
import { useRouter } from "next/navigation";
import {FaHeart} from "react-icons/fa";
import {toast} from "sonner";
import {generateQrCode} from "@/lib/qr";
import QrModal from "@/components/ui/QrModal";

type Category = { id: number; name: string };
type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    category: Category;
    image_url?: string | null;
};

interface ProductCarouselProps {
    products: Product[];
    onAddToCart?: (product: Product) => void;
    onDetails?: (product: Product) => void;
}

export default function BookCard({ products, onAddToCart }: ProductCarouselProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
    const [badgeIds, setBadgeIds] = useState<Set<number>>(new Set());
    const swiperRef = useRef<any>(null);
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const stored = localStorage.getItem("favorites");
        if (stored) {
            setFavoriteIds(new Set(JSON.parse(stored)));
        }
    }, []);

    const handleAddToCart = (product: Product) => {
        onAddToCart?.(product);
        setBadgeIds((prev) => new Set(prev).add(product.id));
        setAddedIds((prev) => new Set(prev).add(product.id));
        setTimeout(() => {
            setBadgeIds((prev) => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
            setAddedIds((prev) => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
        }, 2000);
    };

    const toggleFavorite = (productId: number) => {
        let isAdding = false;

        setFavoriteIds((prev) => {
            const updated = new Set(prev);

            if (updated.has(productId)) {
                updated.delete(productId);
                isAdding = false;
            } else {
                updated.add(productId);
                isAdding = true;
            }

            localStorage.setItem("favorites", JSON.stringify(Array.from(updated)));
            return updated;
        });

        toast.success(
            isAdding
                ? "Added to your wishlist"
                : "Removed from your wishlist",
            {
                description: isAdding
                    ? "You can view it later in your wishlist"
                    : "Item removed from your wishlist",
            }
        );
    };

    const handleQrCodeClick = async (product: Product) => {
        const url = `${window.location.origin}/products/${product.id}`;
        const qr = await generateQrCode(url);

        setQrImage(qr);
        setSelectedProduct(product);
    };

    if (!mounted) {
        return (
            <div className="max-w-7xl mx-auto px-10 relative">
                <Swiper spaceBetween={15} slidesPerView={1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <SwiperSlide key={idx} className="flex justify-center">
                            <BookCardSkeleton />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    }

    return (
        <div className="mt-10 max-w-7xl mx-auto px-10 relative">
            {/* Prev Button */}
            <button
                onClick={() => swiperRef.current?.swiper.slidePrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-[#0f0f0f] text-black dark:text-white p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <FiChevronLeft size={20} />
            </button>

            {/* Next Button */}
            <button
                onClick={() => swiperRef.current?.swiper.slideNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-[#0f0f0f] text-black dark:text-white p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <FiChevronRight size={20} />
            </button>

            <Swiper
                ref={swiperRef}
                spaceBetween={15}
                slidesPerView={1}
                loop={false}
                breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="flex justify-center">
                        <div className="w-full relative">
                            <Card className="relative bg-white dark:bg-[#0f0f0f] text-black dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm">
                                {/* Book Image */}
                                <div className="h-48 w-full p-2 flex items-center justify-center overflow-hidden relative">
                                    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                                        <img
                                            src={product.image_url || "/placeholder-book.png"}
                                            alt={product.name}
                                            className="object-cover h-full w-full"
                                        />
                                        {/* Added badge */}
                                        {badgeIds.has(product.id) && (
                                            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                        Added
                      </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 truncate">{product.description}</p>
                                    <p className="text-md font-bold mt-2">${product.price}</p>

                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge
                                            variant="outline"
                                            className="flex items-center gap-1 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                                        >
                                            <FiTag className="w-4 h-4" /> {product.category.name}
                                        </Badge>

                                        {product.stock > 0 ? (
                                            <Badge
                                                variant="outline"
                                                className="flex items-center gap-1 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                                            >
                                                <FiBox className="w-4 h-4" /> {product.stock} left
                                            </Badge>
                                        ) : (
                                            <Badge className="flex items-center gap-1 bg-red-600 text-white border-none">Out of Stock</Badge>
                                        )}
                                    </div>
                                </CardContent>

                                {/* Footer */}
                                <CardFooter className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={() => handleQrCodeClick(product)} >
                                                    <IoQrCodeOutline />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Scan QR</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={() => toggleFavorite(product.id)}>
                                                    <FaHeart
                                                     className={`transition-colors ${favoriteIds.has(product.id) ?  "text-red-500" : "text-gray-400" }`}
                                                    />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {favoriteIds.has(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => router.push(`/products/${product.id}`)}>
                                            Details
                                        </Button>
                                        {/* Add / Added button */}
                                        <Button size="sm" onClick={() => handleAddToCart(product)}>
                                            {addedIds.has(product.id) ? "Added" : <FiShoppingCart />}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </SwiperSlide>
                ))}
                <QrModal
                    open={!!qrImage}
                    qrImage={qrImage}
                    title={selectedProduct?.name}
                    onClose={() => {
                        setQrImage(null);
                        setSelectedProduct(null);
                    }}
                />
            </Swiper>
        </div>
    );
}