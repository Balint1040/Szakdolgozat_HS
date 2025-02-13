'use client'

import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import OrangeButton from "./OrangeButton"
import { useEffect, useState } from "react"

export default function Hero() {
    const [productCount, setProductCount] = useState<number | null>(null)

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

    return (
        <section className="position-relative hero">
            <div className="container h-100">
                <div className="row d-flex align-items-center h-100">
                    <div className="contentWrapper">
                        <p className="text-end pb-3">
                            <span className="text-Orange">{productCount}</span> termékünk várja, hogy kiválaszd a számodra legmegfelelőbbet!
                        </p>
                        <OrangeButton name="Termékek felfedezése" href="/termekek" variant="discover"/>
                    </div>
                </div>
            </div>
        </section>
    )
}