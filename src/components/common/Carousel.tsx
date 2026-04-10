"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

interface CarouselProps {
    images: string[];
}

export default function BookstoreCarousel({ images }: CarouselProps) {
    return (
        <div className="w-full max-w-7xl mx-auto">
            <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="h-64 md:h-96"
            >
                {images.map((img, i) => (
                    <SwiperSlide key={i}>
                        <img
                            src={img}
                            alt={`Bookstore ${i}`}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}