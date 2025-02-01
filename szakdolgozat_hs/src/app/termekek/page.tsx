'use client'

import dynamic from 'next/dynamic';
//import ProductCard from '@/components/ProductCard'
import { Suspense, useEffect, useState } from 'react'

const ProductCard = dynamic(() => import("@/components/ProductCard"), {
    loading: () => <div style={{
        height: "500px",
        backgroundColor: "#f2f2f2",
        borderRadius: "20px",
        width: "100%"
    }}></div>,
  });

export interface Product {
    id: number,
    name: string,
    price: number,
    properties: Object,
    manufacturer: string,
    categoryId: number,
    imgId: number,
    imageUrl: string,
    productId: number
}


export default function Page() {
    const [products, setProducts] = useState<Product[]>([])
    const [error, setError] = useState<string | null>(null)

    //const uniqueProducts = [...new Map(products.map(prod => [prod.url.includes("webp"), prod])).values()]
    const uniqueProducts = [...new Map(products.map(prod => [prod['productId'], prod])).values()]

    useEffect(() => {
        fetch('/api', {
            cache: 'force-cache'
        })
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
            <div className="container productsContainer">
                <div className="row">
                    <div className="col-3">

                    </div>
                    <div className="col-9">
                        <div className="row">
                            <Suspense fallback={"loading"}>
                                {products.map((product, index) => (
                                    <div className="col-4 p-2" key={index}>
                                        <ProductCard data={product} />
                                    </div>
                                ))}
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}