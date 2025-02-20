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
    const [minPrice, setMinPrice] = useState<number | null>(() => {
        const saved = global?.localStorage?.getItem('minPrice')
        return saved != null ? Number(saved) : null
    })
    const [maxPrice, setMaxPrice] = useState<number | null>(() => {
        const saved = global?.localStorage?.getItem('maxPrice')
        return saved != null ? Number(saved) : null
    })
    const [categoryId, setCategoryId] = useState<number[]>(() => {
        const saved = global?.localStorage?.getItem('categoryId')
        return saved ? JSON.parse(saved) : []
    })
    const [manufacturer, setManufacturer] = useState<string[]>(() => {
        const saved = global?.localStorage?.getItem('manufacturer')
        return saved ? JSON.parse(saved) : []
    })
    const [filters, setFilters] = useState<{ minPrice: number | null, maxPrice: number | null, categoryId: number[], manufacturer: string[] }>({
        minPrice,
        maxPrice,
        categoryId,
        manufacturer
    })


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMinPrice = global?.localStorage?.getItem('minPrice')
            const savedMaxPrice = global?.localStorage?.getItem('maxPrice')
            const savedCategoryId = global?.localStorage?.getItem('categoryId')
            const savedManufacturer = global?.localStorage?.getItem('manufacturer')
            if (savedMinPrice) setMinPrice(Number(savedMinPrice))
            if (savedMaxPrice) setMaxPrice(Number(savedMaxPrice))
            if (savedCategoryId) setCategoryId(JSON.parse((savedCategoryId)))
            if (savedManufacturer) setManufacturer(JSON.parse((savedManufacturer)))
            setFilters({
                minPrice: savedMinPrice ? Number(savedMinPrice) : null,
                maxPrice: savedMaxPrice ? Number(savedMaxPrice) : null,
                categoryId: savedCategoryId ? JSON.parse((savedCategoryId)) : [],
                manufacturer: savedManufacturer ? JSON.parse((savedManufacturer)) : []
            })
        }
    }, [])

    const handleCategoryChange = (id: number) => {
        setCategoryId((prev) => {
            if (prev.includes(id)) {
                return prev.filter((categoryId) => categoryId !== id)
            } else {
                return [...prev, id]
            }
        })
    }

    const handleManufacturerChange = (name: string) => {
        setManufacturer((prev) => {
            if (prev.includes(name)) {
                return prev.filter((manufacturer) => manufacturer !== name)
            } else {
                return [...prev, name]
            }
        })
    }



    const fetchProducts = useCallback(async () => {
        setLoading(true)

        try {
            const filterParams = new URLSearchParams()
            if (filters.minPrice) filterParams.append('minPrice', filters.minPrice.toString())
            if (filters.maxPrice) filterParams.append('maxPrice', filters.maxPrice.toString())
            if (filters.categoryId.length > 0) filterParams.append('categoryId', filters.categoryId.join(','))
            if (filters.manufacturer.length > 0) filterParams.append("manufacturer", filters.manufacturer.join(","))


            const res = await fetch(`/api/products?${filterParams}`, {
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                }
            })
            const data: Product[] = await res.json()

            setProducts(data)
            setDisplayedProducts(data.slice(0, 20))
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [filters])

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

    const applyFilters = () => {
        setFilters({
            minPrice,
            maxPrice,
            categoryId,
            manufacturer
        })

        if (typeof window !== 'undefined') {
            if (minPrice !== null) global?.localStorage?.setItem('minPrice', minPrice.toString())
            if (maxPrice !== null) global?.localStorage?.setItem('maxPrice', maxPrice.toString())
            if (categoryId.length > 0) global?.localStorage?.setItem('categoryId', JSON.stringify(categoryId))
            if (manufacturer.length > 0) global?.localStorage?.setItem("manufacturer", JSON.stringify(manufacturer))
        }

        fetchProducts()
    }

    const clearFilters = () => {
        setMinPrice(null)
        setMaxPrice(null)
        setCategoryId([])
        setManufacturer([])
        setFilters({ minPrice: null, maxPrice: null, categoryId: [], manufacturer: [] })

        if (typeof window !== 'undefined') {
            global?.localStorage?.removeItem('minPrice')
            global?.localStorage?.removeItem('maxPrice')
            global?.localStorage?.removeItem('categoryId')
            global?.localStorage?.removeItem('manufacturer')
        }
        fetchProducts()
    }

    const categoryOptions: { [key: number]: string } = {
        1: "Videókártya",
        2: "Processzor",
        3: "Alaplap",
        4: "Memória"
    }

    const uniqueManufacturers = Array.from(new Set(products.filter(product => categoryId.length == 0 || categoryId.includes(product.categoryId)).map(product => product.manufacturer)))
    const uniqueCategories = Array.from(new Set(products.filter(product => manufacturer.length === 0 || manufacturer.includes(product.manufacturer)).map(product => product.categoryId)))

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return (
        <>
            <div className="container productsContainer py-4">
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
                                        <input type="number"
                                            placeholder="Min."
                                            value={minPrice || ''}
                                            onChange={(e) => setMinPrice(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="col-2 text-center d-flex align-items-center justify-content-center">
                                        -
                                    </div>
                                    <div className="col-5 ps-0">
                                        <input
                                            type="number ps-0"
                                            placeholder='Max.'
                                            value={maxPrice || ''}
                                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="checkboxFilter">
                                <h5>Kategória</h5>
                                <div className="checkboxWrap">
                                    {uniqueCategories.map((id) => (
                                        <div key={id}>
                                            <input
                                                type="checkbox"
                                                id={id.toString()}
                                                checked={categoryId.includes(id)}
                                                onChange={() => handleCategoryChange(id)}
                                                disabled={!uniqueCategories.includes(id)}
                                            />
                                            <label htmlFor={id.toString()}>{categoryOptions[id]}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <hr />
                            <div className="checkboxFilter">
                                <h5>Gyártó</h5>
                                <div className="checkboxWrap">
                                    {uniqueManufacturers.map((manufacturerName) => (
                                        <div key={manufacturerName}>
                                            <input
                                                type="checkbox"
                                                id={manufacturerName}
                                                checked={manufacturer.includes(manufacturerName)}
                                                onChange={() => handleManufacturerChange(manufacturerName)}
                                                disabled={!products.some(product => product.manufacturer === manufacturerName && (categoryId.length === 0 || categoryId.includes(product.categoryId)))}
                                            />
                                            <label htmlFor={manufacturerName}>{manufacturerName}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <hr />
                            <div className="priceFilter">
                                <h5>Ventillátorok száma</h5>
                                <div className="row">
                                    <div className="col-5 pe-0">
                                        <input type="number" placeholder="Min." />
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
                            <div className='orangeButton' onClick={applyFilters}>Alkamazás</div>
                            <div className='blueButton mt-2' onClick={clearFilters}>Szűrők törlése</div>
                        </div>

                    </div>
                    <div className="col-9 pt-2">
                        <div className="orderRow p-2 mb-2">
                            <div><span className='text-Blue'>{products.length}</span> találat</div>
                            <div className='d-flex align-items-center position-relative customSelect'>
                                {/* <OrangeButton name='Relevancia' href='#' variant='order' /> */}
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Dropdown button
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#">Action</a>
                                        <a className="dropdown-item" href="#">Another action</a>
                                        <a className="dropdown-item" href="#">Something else here</a>
                                    </div>
                                </div>
                            </div>
                        </div>

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
