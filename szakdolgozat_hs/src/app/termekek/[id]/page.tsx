'use client'
import React, { useEffect, useState } from 'react'

interface Product {
    id: number,
    name: string,
    price: number,
    properties: Object,
    manufacturer: string,
    categoryId: number,
    imageUrls: { url: string }[],
}

export default function Page({
    params
} : {
    params: Promise<{ id: string }>
}) {
    
    const { id } = React.use(params)
    const [product, setProduct] = useState<Product | null>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await fetch(`/api/${id}`)
            const data = await response.json()
            if (data.length > 0) {
                const productData = {
                    id: data[0].id,
                    name: data[0].name,
                    price: data[0].price,
                    manufacturer: data[0].manufacturer,
                    properties: data[0].properties,
                    categoryId: data[0].categoryId,
                    imageUrls: data.map((item: { url: string }) => ({ url: item.url })),
                }
                setProduct(productData)
            }
        }

        fetchProduct()
    }, [id])

    if (!product) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>Ár: {product.price} Ft</p>
            <p>Gyártó: {product.manufacturer}</p>
            {
                [...Object.entries(product.properties)].map(([key, value], i) => {
                    if (i < 4) {
                        return (
                            <div key={i} className="row propertyRow">
                                <span className="w-50 propertyKey">{key}:</span>
                                <span className="w-50 propertyValue">{value}</span>
                            </div>
                        )
                    }
                    return null // if no properties are defined then just return null
                })
            }
            {product.imageUrls.map((image, index) => (
                <img key={index} src={image.url} alt={`Product Image ${index + 1}`} />
            ))}
        </div>
    )
}