"use client"

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const isBrowser = () => typeof window !== 'undefined'

    function scrollToTop() {
        if (!isBrowser()) return
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return (
        <>
            <a id="scrollToTop" onClick={() => {scrollToTop()}} className={`... scrollToTopButton ${isVisible ? 'visible' : ''}`}>
                <FontAwesomeIcon icon={faArrowUp as IconProp} />
            </a>
        </>
    )
}