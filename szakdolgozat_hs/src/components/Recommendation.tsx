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



const recom1 = {
    id: 2,
    name: "AMD Ryzen 7 7800X3D 4.2GHz 8-Cores",
    price: 312312,
    properties: {},
    manufacturer: "asasd",
    categoryId: 2,
    imgId: 3,
    url: "https://3.pcx.hu/pcx_prod_img/41/m/416117_4.webp?202501212151",
    productId: 3
}
const recom2 = {
    id: 23,
    name: "G.SKILL Ripjaws S5 32GB (2x16GB) DDR5 6000MHz",
    price: 312312,
    properties: {},
    manufacturer: "asasd",
    categoryId: 2,
    imgId: 3,
    url: "https://2.pcx.hu/pcx_prod_img/15/m/158846_2.webp?202501212151",
    productId: 3
}
const recom3 = {
    id: 2,
    name: "AMD Ryzen 7 7800X3D 4.2GHz 8-Cores",
    price: 312312,
    properties: {},
    manufacturer: "asasd",
    categoryId: 2,
    imgId: 3,
    url: "https://3.pcx.hu/pcx_prod_img/41/m/416117_4.webp?202501212151",
    productId: 3
}
const recom4 = {
    id: 23,
    name: "G.SKILL Ripjaws S5 32GB (2x16GB) DDR5 6000MHz",
    price: 312312,
    properties: {},
    manufacturer: "asasd",
    categoryId: 2,
    imgId: 3,
    url: "https://2.pcx.hu/pcx_prod_img/15/m/158846_2.webp?202501212151",
    productId: 3
}

export default function Recommendation() {
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
                        <SwiperSlide><RecommendationCard data={recom1 as Product} /></SwiperSlide>
                        <SwiperSlide><RecommendationCard data={recom2 as Product} /></SwiperSlide>
                        <SwiperSlide><RecommendationCard data={recom3 as Product} /></SwiperSlide>
                        <SwiperSlide><RecommendationCard data={recom4 as Product} /></SwiperSlide>
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