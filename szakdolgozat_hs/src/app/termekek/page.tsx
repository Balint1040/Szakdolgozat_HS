'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ProductCard = dynamic(() => import("@/components/ProductCard"), {
    loading: () => <div style={{
        height: "500px",
        backgroundColor: "#f2f2f2",
        borderRadius: "20px",
        width: "100%"
    }}></div>,
})

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
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const fetchProducts = useCallback(async () => {
        setLoading(true)

        try {
            const res = await fetch(`/api/products`)
            const data: Product[] = await res.json()

            setProducts(data)
            setDisplayedProducts(data.slice(0, 20))
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const loadMoreProducts = useCallback(() => {
        if (loading || !hasMore) return

        setLoading(true)
        const nextIndex = displayedProducts.length

        const nextProducts = products.slice(nextIndex, nextIndex + 20)

        if (nextProducts.length === 0) {
            setHasMore(false)
        } else {
            setDisplayedProducts((prev) => [...prev, ...nextProducts])
        }

        setLoading(false)
    }, [loading, hasMore, displayedProducts, products])

    const loaderRef = useCallback((node: HTMLDivElement) => {
        if (loading || !hasMore) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreProducts()
                }
            },
            { threshold: 1.0 }
        )
        if (node) observer.observe(node)
        return () => observer.disconnect()
    }, [loading, hasMore, loadMoreProducts])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return (
        <>
                <div className="container productsContainer">
            <div className="row">
                <div className="col-3">
                    {/* Add any sidebar or filter components here */}
                </div>
                <div className="col-9">
                    <div className="row">
                        <Suspense fallback={"loading"}>
                            {displayedProducts.map((product) => (
                                <div className="col-4 p-2" key={product.id}>
                                    <ProductCard data={product} />
                                </div>
                            ))}
                        </Suspense>
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <div>Loading...</div>
                        </div>
                    )}

                    {hasMore && (
                        <div ref={loaderRef} style={{ height: '20px', marginBottom: '20px' }}>
                            {/* Invisible loader */}
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>

    )
}
