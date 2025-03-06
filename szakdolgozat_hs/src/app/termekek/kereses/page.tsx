'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Product } from '@/app/termekek/page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faCircleXmark, faFaceFrown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

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
    const [selectedSort, setSelectedSort] = useState("default")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(30)

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])

    const fetchProducts = useCallback(async () => {
        setLoading(true)

        try {
            const res = await fetch(`/api/search?kereses=${query}`)
            const data: Product[] = await res.json()

            setProducts(data)
            paginateProducts(data, 1)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [query])


    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const paginateProducts = (allProducts: Product[], page: number) => {
        const startIndex = (page - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        setDisplayedProducts(allProducts.slice(startIndex, endIndex))
    }

    const handlePageChange = (page: number) => {
        scrollToTop()
        setCurrentPage(page)
        paginateProducts(products, page)
    }

    const isBrowser = () => typeof window !== 'undefined'
    function scrollToTop() {
        if (!isBrowser()) return
        window.scrollTo({ top: 0 })
    }

    useEffect(() => {
        if (products.length > 0) {
            const sortedProducts = [...products]
            
            switch (selectedSort) {
                case 'novekvo':
                    sortedProducts.sort((a, b) => a.price - b.price)
                    break
                case 'csokkeno':
                    sortedProducts.sort((a, b) => b.price - a.price)
                    break
                case 'a-z':
                    sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
                    break
                case 'z-a':
                    sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
                    break
                default:
                    break
            }
            
            paginateProducts(sortedProducts, currentPage)
        }
    }, [selectedSort, products, currentPage])

    return (
        <>
            <div className="container productsContainer py-4">
                <div className="row">
                    <div className="col-3">
                        {/* Add any sidebar or filter components here */}
                    </div>
                    <div className="col-9">
                    <div className="orderRow p-2 mb-2">
                            <div><span className='text-Blue'>{products.length}</span> találat</div>
                            <div className="dropdown">
                                <button
                                    className="btn dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                >
                                    {selectedSort === 'default' && 'Relevancia'}
                                    {selectedSort === 'novekvo' && 'Ár szerint növekvő'}
                                    {selectedSort === 'csokkeno' && 'Ár szerint csökkenő'}
                                    {selectedSort === 'a-z' && 'A-Z sorrendben'}
                                    {selectedSort === 'z-a' && 'Z-A sorrendben'}
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setSelectedSort('default')}
                                        >
                                            Relevancia
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setSelectedSort('novekvo')}
                                        >
                                            Ár szerint növekvő
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setSelectedSort('csokkeno')}
                                        >
                                            Ár szerint csökkenő
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setSelectedSort('a-z')}
                                        >
                                            A-Z sorrendben
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setSelectedSort('z-a')}
                                        >
                                            Z-A sorrendben
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setSelectedSort('hat')}
                                        >
                                            hat
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="row">
                            {products.length === 0 ? (
                                <div className='emptyCart'>
                                    <div className="emptyIconWrap">
                                        <FontAwesomeIcon icon={faMagnifyingGlass as IconProp} />
                                        <FontAwesomeIcon icon={faCircleXmark as IconProp} />
                                    </div>
                                    Nem található ilyen termék
                                </div>
                            ) : (
                                <Suspense fallback={"loading"}>
                                {displayedProducts.map((product) => (
                                    <div className="col-4 p-2" key={product.id}>
                                        <ProductCard data={product}/>
                                    </div>
                                ))}
                            </Suspense>
                            )}
                        </div>

                        <div className="pagination mt-5 position-relative d-flex justify-content-center align-items-center">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className='paginationPrev'
                            >
                                <FontAwesomeIcon icon={faAngleLeft as IconProp} />
                            </button>
                            <div>{currentPage}</div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={displayedProducts.length < itemsPerPage}
                                className='paginationNext'
                            >
                                <FontAwesomeIcon icon={faAngleRight as IconProp} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}