'use client'
import OrangeButton from '@/components/OrangeButton'
import ProductSwiper from '@/components/ProductSwiper'
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
        return <div className='w-100 vh-100 d-flex justify-content-center align-items-center'>Loading...</div>
    }

    /*
    {product.imageUrls.map((image, index) => (
        <img key={index} src={image.url} alt={`Product Image ${index + 1}`} />
    ))}
    */

    return (
        <>
            <div className="container productContainer">
                <div className="row">
                    <div className="col-6">
                        <ProductSwiper images={product.imageUrls} />
                    </div>
                    <div className="col-6">
                        <h2>{product.name}</h2>
                        <h3 className='my-3'>Ár: <span className="text-Blue">{product.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span> <span className="text-Orange">Ft</span></h3>
                        <div className="d-flex justify-content-between align-items-center my-3">
                            <div className="quantityWrap">
                                <a className="">-</a>
                                <h3>1</h3>
                                <a className="">+</a>
                            </div>
                            <OrangeButton name="Kosárba" href="#" />
                        </div>
                        <p>Gyártó: {product.manufacturer}</p>
                        {[...Object.entries(product.properties)].map(
                            ([key, value], i) => {
                            return (
                                <div key={i} className="row propertyRow">
                                <span className="w-50 propertyKey">{key}:</span>
                                <span className="w-50 propertyValue">{value}</span>
                                </div>
                            );
                            }
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}