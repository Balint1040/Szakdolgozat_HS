'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { useProductFilters } from '@/hooks/ProductFilters'

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

    const {
        minPrice,
        maxPrice,
        categoryId,
        manufacturer,
        filters,
        setMinPrice,
        setMaxPrice,
        handleCategoryChange,
        handleManufacturerChange,
        applyFilters,
        clearFilters

    } = useProductFilters()

    const [products, setProducts] = useState<Product[]>([])
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(30)
    const [selectedSort, setSelectedSort] = useState("default")


    const categoryOptions: { [key: number]: string } = {
        1: "Videókártya",
        2: "Processzor",
        3: "Alaplap",
        4: "Memória"
    }

    const uniqueManufacturers = Array.from(new Set(products.filter(product => categoryId.length == 0 || categoryId.includes(product.categoryId)).map(product => product.manufacturer)))
    const uniqueCategories = Array.from(new Set(products.filter(product => manufacturer.length === 0 || manufacturer.includes(product.manufacturer)).map(product => product.categoryId)))

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
            paginateProducts(data, 1)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])

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
        fetchProducts()
    }, [fetchProducts])

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
                    <div className="col-12 col-lg-3 p-2 position-relative">
                        <div className="filters p-2" id='filters'>
                            <div className="row">
                                <a className='cursor-pointer' onClick={() => { document.getElementById("filters")?.classList.toggle("open") }}>
                                    <h3 className="text-Blue text-center">Szűrők</h3>
                                </a>
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
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-12">
                                    <div className='orangeButton' onClick={applyFilters}>Alkamazás</div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-12">
                                    <div className='blueButton mt-2 mt-md-0 mt-lg-2' onClick={clearFilters}>Szűrők törlése</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-9 pt-2">
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

                        {loading && (
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <div>Loading...</div>
                            </div>
                        )}

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
