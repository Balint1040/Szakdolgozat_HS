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
import { useEffect, useState } from "react";



export default function Reviews() {

    const [reviews, setReviews] = useState<IReviewCard[]>([])

    useEffect(() => {
        const fetchReview = async() => {
            try{
                const res = await fetch("/api/reviews", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY || ""
                    },
                    credentials: "include"
                })
                if(res.ok){
                    const data = await res.json()
                    const shuffled = data.sort(() => 0.5 - Math.random())
                    const selected = shuffled.slice(0, 6)
                    setReviews(selected)
                }
            }catch(e){
                console.error(e)
            }
        }
        fetchReview()
    }, [])

    return (
        <section id="reviews" className="position-relative" data-aos="zoom-in-up" data-aos-offset="500">
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
                        {reviews.map(review => (
                            <SwiperSlide key={review.id}>
                                <ReviewCard data={review} />
                            </SwiperSlide>
                        ))}
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