'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Product } from '../page'

const ProductCard = dynamic(() => import("@/components/ProductCard"), {
    loading: () => <div style={{
        height: "500px",
        backgroundColor: "#f2f2f2",
        borderRadius: "20px",
        width: "100%"
    }}></div>,
})


export default function Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get('')
    const [products, setProducts] = useState<Product[]>([])
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const fetchProducts = useCallback(async () => {
        setLoading(true)

        try {
            const res = await fetch(`/api/search?kereses=${query}`)
            const data: Product[] = await res.json()

            setProducts(data)
            setDisplayedProducts(data.slice(0, 20))
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [query])

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

    
/*
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        try {
            async function fetchData() {
                const res = await fetch(`/api/search?kereses=${query}`)
                const data: Product[] = await res.json()

                setProducts(data)
            }
            fetchData()
        } catch (error) {
            console.error('Failed to fetch products:', error)
        }
    }, [])

*/
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
                                {products.map((product) => (
                                    <div className="col-4 p-2" key={product.id}>
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