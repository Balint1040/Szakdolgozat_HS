'use client'

import RecommendationCard from '@/components/RecommendationCard'
import { useEffect, useState } from 'react'

export interface Product {
    id: number,
    name: string,
    price: number,
    properties: Object,
    manufacturer: string,
    categoryId: number,
    imgId: number,
    url: string,
    productId: number
}

export default function Page() {
    const [products, setProducts] = useState<Product[]>([])
    const [error, setError] = useState<string | null>(null)

    //const uniqueProducts = [...new Map(products.map(prod => [prod.url.includes("webp"), prod])).values()]
    const uniqueProducts = [...new Map(products.map(prod => [prod['productId'], prod])).values()]

    useEffect(() => {
        fetch('/api')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data)
            })
            .catch((err) => {
                setError('Failed to fetch products')
                console.error(err)
            })
    }, [])

    return (
        <>
            {error && <p>{error}</p>}
            <div className="container productsContainer">
                <div className="row">
                    <div className="col-3">

                    </div>
                    <div className="col-9">
                        <div className="row">
                            {uniqueProducts.map((product) => (
                                <div className="col-4 p-2" key={product.productId}>
                                    <RecommendationCard data={product} />
                                    <span>{product.url}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}