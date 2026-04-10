"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function BookCarousel({ images, name }: any) {
    return (
        <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={10}
            slidesPerView={1}
            className="rounded-lg shadow"
        >
            {images.map((img: string, idx: number) => (
                <SwiperSlide key={idx}>
                    <img
                        src={img}
                        alt={name}
                        className="w-full h-80 md:h-[400px] object-cover rounded-lg"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}