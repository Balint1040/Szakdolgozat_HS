"use client";

// Import Swiper React components
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useState } from "react";

export default function ProductSwiper({ 
    images 
} : { 
    images: {url: string}[]
}) {

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

    return (
        <>
            <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="productSwiper"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img src={image.url} alt={`Product Image ${index + 1}`} />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="productSwiperThumbs"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="position-relative">
                        <img src={image.url} className="productSwiperThumbImg" />
                    </SwiperSlide>
                ))}
                
            </Swiper>
        </>
    );
}
