'use client'

import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import OrangeButton from "./OrangeButton"
import { useEffect, useState } from "react"

export default function Hero() {
    const [productCount, setProductCount] = useState<number | null>(null)
    const [countDisplay, setCountDisplay] = useState(0)

    useEffect(() => {
        const fetchProductCount = async() => {
            try {
                const res = await fetch('/api/products/productCount', {
                    headers: {
                        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                    }
                })
                const data = await res.json()
                setProductCount(data.count)
            } catch (e) {
                console.error(e)
            }
        }
        fetchProductCount()
    }, [])

    useEffect(() => {
        if (productCount !== null) {
            countEffect(productCount, setCountDisplay)
        }
    }, [productCount])

    const countEffect = (target: number, setCount: React.Dispatch<React.SetStateAction<number>>) => {
        let current = 0
        const duration = 3200 
        const startTime = performance.now()
    
        const animate = (time: number) => {
            const elapsed = time - startTime
            const progress = Math.min(elapsed / duration, 1) 
    
            const easedProgress = easeInOut(progress)
    
            const count = Math.round(target * easedProgress) 
            setCount(count)
    
            if (progress < 1) {
                requestAnimationFrame(animate) 
            }
        }
    
        requestAnimationFrame(animate) 
    }
    
    function easeInOut(t: number): number {
        return t < 0.5
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    

    return (
        <section className="position-relative hero">
            <div className="container h-100">
                <div className="row d-flex align-items-center h-100">
                    <div className="contentWrapper">
                        <p className="text-end pb-3">
                            <span className="text-Orange" id="productCount">{countDisplay}</span> termékünk várja, hogy kiválaszd a számodra legmegfelelőbbet!
                        </p>
                        <OrangeButton name="Termékek felfedezése" href="/termekek" variant="discover"/>
                    </div>
                </div>
            </div>
        </section>
    )
}
