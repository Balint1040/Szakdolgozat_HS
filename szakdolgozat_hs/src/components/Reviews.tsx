"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/scrollbar'
import 'swiper/css/navigation'
import {Navigation, Scrollbar } from "swiper/modules";
import ReviewCard, { IReviewCard } from "./ReviewCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";



export default function Reviews() {

    const review1 = {
        id: 1,
        name: "Horváth Győző",
        text: '"Kiváló webshop, szép termékválaszték. Pontos és gyors szállítás. Volt egy garanciális jellegű problémám, de ez az én hibám volt, és a személyzet minden segítséget megadott, amire szükségem volt, műszaki és pénzügyi tanácsokkal kiegészítve. Ennél jobb ügyfélszolgálatot nem is lehet kérni."',
        star: 5
    }
    const review2 = {
        id: 2,
        name: "Beton Tamás",
        text: '"Csak ajánlani tudom Őket! Profi, precíz, fiatalos csapat fantasztikus ötletekkel és ami még jobb, hogy meg is tudják valósítani!"',
        star: 5
    }
    const review3 = {
        id: 3,
        name: "Kiss Elek",
        text: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."',
        star: 4
    }
    const review4 = {
        id: 4,
        name: "Horváth Bálint",
        text: '"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."',
        star: 3
    }

    return (
        <section id="reviews" className="position-relative">
            <div className="container">
                <div className="row">
                    <h1>Mások mondták rólunk...</h1>
                </div>
                <div className="row">
                    <Swiper
                        modules={[Navigation, Scrollbar]}
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation = {{
                            prevEl: ".reviewSwiper-prevEl",
                            nextEl: ".reviewSwiper-nextEl"
                        }}
                        scrollbar={{ 
                            draggable: true, 
                            el: '.reviewSwiper-scrollbar'
                        }}
                        className="reviewSwiper"
                    >
                        <SwiperSlide><ReviewCard data={review1 as IReviewCard} /></SwiperSlide>
                        <SwiperSlide><ReviewCard data={review2 as IReviewCard} /></SwiperSlide>
                        <SwiperSlide><ReviewCard data={review3 as IReviewCard} /></SwiperSlide>
                        <SwiperSlide><ReviewCard data={review4 as IReviewCard} /></SwiperSlide>
                    </Swiper>
                    <div className="reviewSwiper-controlWrap">
                        <div className="reviewSwiper-prevEl"><FontAwesomeIcon icon={faAngleLeft as IconProp} /></div>
                            <div className="reviewSwiper-scrollbarWrap">
                                <div className="reviewSwiper-scrollbarInnerWrap">
                                    <div className="reviewSwiper-scrollbar"></div>
                                </div>
                            </div>
                        <div className="reviewSwiper-nextEl"><FontAwesomeIcon icon={faAngleRight as IconProp} /></div>
                    </div>
                </div>
            </div>
        </section>
    )
}