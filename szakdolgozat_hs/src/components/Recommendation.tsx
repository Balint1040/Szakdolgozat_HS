"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/scrollbar'
import 'swiper/css/navigation'
import {Navigation, Scrollbar } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import RecommendationCard, { IRecommendationCard } from "./RecommendationCard";


const recom1 = {
    id: 1,
    name: "ASUS ROG STRIX B650E-F GAMING WIFI Alaplap",
    desc: "A(z) ASUS márkájú alaplap AMD B650E chipkészletre épül és a CPU fogadására AMD AM5 foglalat áll rendelkezésre.",
    img: "https://1.pcx.hu/pcx_prod_img/79/m/798848_2.webp?202501212151",
    price: 71990,
    quantity: 1,
}
const recom2 = {
    id: 2,
    name: "AMD Ryzen 7 7800X3D 4.2GHz 8-Cores",
    desc: "A(z) Raphael gyártástechnológiával készült AMD Ryzen 7 7800X3D mikrochipet speciálisan az átlagosnál erősebb otthoni és irodai számítógépekhez tervezték.",
    img: "https://3.pcx.hu/pcx_prod_img/41/m/416117_4.webp?202501212151",
    price: 198990,
    quantity: 1,
}
const recom3 = {
    id: 3,
    name: "G.SKILL Ripjaws S5 32GB (2x16GB) DDR5 6000MHz",
    desc: "G. SKILL Memória DDR5 32GB 6000Mhz CL30 DIMM 1.35V, Ripjaws S5 Intel XMP (Kit of 2)",
    img: "https://2.pcx.hu/pcx_prod_img/15/m/158846_2.webp?202501212151",
    price: 71990,
    quantity: 1,
}
const recom4 = {
    id: 4,
    name: "ASUS ROG STRIX B650E-F GAMING WIFI Alaplap",
    desc: "A(z) ASUS márkájú alaplap AMD B650E chipkészletre épül és a CPU fogadására AMD AM5 foglalat áll rendelkezésre.",
    img: "https://3.pcx.hu/pcx_prod_img/41/m/416117_4.webp?202501212151",
    price: 71990,
    quantity: 1,
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
                        <SwiperSlide><RecommendationCard data={recom1 as IRecommendationCard} /></SwiperSlide>
                        <SwiperSlide><RecommendationCard data={recom2 as IRecommendationCard} /></SwiperSlide>
                        <SwiperSlide><RecommendationCard data={recom3 as IRecommendationCard} /></SwiperSlide>
                        <SwiperSlide><RecommendationCard data={recom4 as IRecommendationCard} /></SwiperSlide>
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