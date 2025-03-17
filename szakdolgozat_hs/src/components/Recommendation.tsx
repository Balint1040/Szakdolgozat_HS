"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/scrollbar'
import 'swiper/css/navigation'
import {Navigation, Scrollbar } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import RecommendationCard from "./RecommendationCard";
import { Product } from "@/app/termekek/page";
import { useEffect, useState } from "react";

const categoryIds = [1,2,3,4]

export default function Recommendation() {
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])

    useEffect(() => {
        const fetchRecommendedProducts = async() => {
            try{

                let allProducts: Product[] = []

                for(const categoryId of categoryIds){
                    const res = await fetch(`/api/products?categoryId=${categoryId}`, {
                        headers: {
                            'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                        }
                    })

                    const products = await res.json()
                    if(products && products.length > 0){
                        const shuffled = [...products].sort(() => 0.5 - Math.random())
                        const selected = shuffled.slice(0, Math.min(2, shuffled.length))
                        allProducts = [...allProducts, ...selected]
                    }
                }

                const shuffledRecommendations = allProducts.sort(() => 0.5 - Math.random())
                setRecommendedProducts(shuffledRecommendations.slice(0, 10))
            }catch(e){
                console.error(e)
            }
        }

        fetchRecommendedProducts()
    }, [])

    return (
        <section id="recommendation" className="position-relative">
            <div className="container">
                <div className="row">
                    <h1>Termékek, amik tetszhetnek...</h1>
                </div>
                <div className="row">
                    <Swiper
                        modules={[Navigation, Scrollbar]}
                        spaceBetween={50}
                        slidesPerView={3}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 40,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 40,
                            },
                            992: {
                                spaceBetween: 50,
                                slidesPerView: 3
                            },
                          }}
                        navigation = {{
                            prevEl: ".recommendationSwiper-prevEl",
                            nextEl: ".recommendationSwiper-nextEl"
                        }}
                        scrollbar={{ 
                            draggable: true, 
                            el: '.recommendationSwiper-scrollbar'
                        }}
                        className="recommendationSwiper"
                    >
                        {recommendedProducts.map((product) => (
                            <SwiperSlide key={`${product.id}`}>
                                <RecommendationCard data={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="recommendationSwiper-controlWrap">
                        <div className="recommendationSwiper-prevEl"><FontAwesomeIcon icon={faAngleLeft as IconProp} /></div>
                            <div className="recommendationSwiper-scrollbarWrap">
                                <div className="recommendationSwiper-scrollbarInnerWrap">
                                    <div className="recommendationSwiper-scrollbar"></div>
                                </div>
                            </div>
                        <div className="recommendationSwiper-nextEl"><FontAwesomeIcon icon={faAngleRight as IconProp} /></div>
                    </div>
                </div>
            </div>
        </section>
    )
}