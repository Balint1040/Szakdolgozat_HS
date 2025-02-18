'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import OrangeButton from '@/components/OrangeButton'

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
    url: string,
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
            const res = await fetch(`/api/products`, {
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                }
            })
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
        <div className="container productsContainer py-5">
            <div className="row">
                <div className="col-3 p-2 position-relative">
                    <div className="filters p-2">
                        <div className="row">
                            <h3 className="text-Blue text-center">Szűrők</h3>
                        </div>
                        <hr />
                        <div className="priceFilter">
                            <h5>Ár</h5>
                            <div className="row">
                                <div className="col-5 pe-0">
                                    <input type="number" placeholder="Min."  />
                                </div>
                                <div className="col-2 text-center d-flex align-items-center justify-content-center">
                                    -
                                </div>
                                <div className="col-5 ps-0">
                                    <input type="number" placeholder='Max.' />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="checkboxFilter">
                            <h5>Kategória</h5>
                            <div className="checkboxWrap">
                                <div>
                                    <input type="checkbox" id='cat1' />
                                    <label htmlFor="cat1">Processzor</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='cat2' />
                                    <label htmlFor="cat2">Videókártya</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='cat3' />
                                    <label htmlFor="cat3">Alaplap</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='cat4' />
                                    <label htmlFor="cat4">Memória</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='cat5' />
                                    <label htmlFor="cat5">Tárhely</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='cat6' />
                                    <label htmlFor="cat6">Processzorhűtő</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='cat7' />
                                    <label htmlFor="cat7">Gépház</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='cat8' />
                                    <label htmlFor="cat8">Kábelek</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='cat9' />
                                    <label htmlFor="cat9">Bővítőkártyák</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='cat10' />
                                    <label htmlFor="cat10">Tápegység</label>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="checkboxFilter">
                            <h5>Gyártó</h5>
                            <div className="checkboxWrap">
                                <div>
                                    <input type="checkbox" id='example1' />
                                    <label htmlFor="example1">Asus</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='example2' />
                                    <label htmlFor="example2">Msi</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='example3' />
                                    <label htmlFor="example3">Gigabyte</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='example4' />
                                    <label htmlFor="example4">Bequit</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='example5' />
                                    <label htmlFor="example5">Intel</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='example6' />
                                    <label htmlFor="example6">Corsair</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='example7' />
                                    <label htmlFor="example7">ROG</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='example8' />
                                    <label htmlFor="example8">Intel</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='example9' />
                                    <label htmlFor="example9">Corsair</label>
                                </div>
                                <div>
                                    <input type="checkbox" id='example10' />
                                    <label htmlFor="example10">ROG</label>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="priceFilter">
                            <h5>Ventillátorok száma</h5>
                            <div className="row">
                                <div className="col-5 pe-0">
                                    <input type="number" placeholder="Min."  />
                                </div>
                                <div className="col-2 text-center d-flex align-items-center justify-content-center">
                                    -
                                </div>
                                <div className="col-5 ps-0">
                                    <input type="number" placeholder='Max.' />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <OrangeButton name='Alkalmazás' href='#' />
                    </div>
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
