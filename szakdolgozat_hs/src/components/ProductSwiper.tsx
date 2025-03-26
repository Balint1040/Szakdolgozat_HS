"use client"

import { Swiper, SwiperClass, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { useState } from "react"

export default function ProductSwiper({
    images,
}: {
    images: { url: string }[]
}) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null)
    const [imageErrors, setImageErrors] = useState<boolean[]>(new Array(images.length).fill(false))

    function handleLoadingError(index: number) {
        const newImageErrors = [...imageErrors]
        newImageErrors[index] = true
        setImageErrors(newImageErrors)
    }

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
                    !imageErrors[index] && (
                        <SwiperSlide
                            key={index}
                            className={"d-flex justify-content-center align-items-center " + `slide-${index}`}
                        >
                            <img
                                src={image.url}
                                alt={`Product Image ${index + 1}`}
                                onError={() => handleLoadingError(index)}
                            />
                        </SwiperSlide>
                    )
                ))}
            </Swiper>

            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                breakpoints={{
                    100: {
                        slidesPerView: 2
                    },
                    320: {
                        slidesPerView: 2
                    },
                    576: {
                        slidesPerView: 3
                    },
                    768: {
                        slidesPerView: 3
                    },
                    992: {
                        slidesPerView: 4
                    },
                    1200: {
                        slidesPerView: 5
                    },
                  }}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="productSwiperThumbs"
            >
                {images.map((image, index) => (
                    !imageErrors[index] && (
                        <SwiperSlide
                            key={index}
                            className={"position-relative thumbSwiperSlide " + `slide-${index}`}
                        >
                            <img
                                src={image.url}
                                className="productSwiperThumbImg"
                                onError={() => handleLoadingError(index)}
                            />
                        </SwiperSlide>
                    )
                ))}
            </Swiper>
        </>
    )
}
