"use client"

import AOS from 'aos';
import { useEffect } from 'react';
import "aos/dist/aos.css";

export default function AosClient() {
    useEffect(() => {
        require("aos/dist/aos.js")
        AOS.init({
            offset: 400
        });
    })
    return (
        <></>
    )
}