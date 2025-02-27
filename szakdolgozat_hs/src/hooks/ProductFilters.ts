import { useState, useCallback, useEffect } from 'react'
import { Product } from '@/app/termekek/page'

export const useProductFilters = () => {
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
    const [filters, setFilters] = useState({
        minPrice,
        maxPrice,
        categoryId,
        manufacturer
    })

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
    }

    return {
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
    }
}