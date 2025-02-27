'use client'
import OrangeButton from '@/components/OrangeButton'
import ProductSwiper from '@/components/ProductSwiper'
import { Quantity } from '@/components/RecommendationCard'
import { addToCart } from '@/utils/addToCart'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
    const router = useRouter()
    const { id } = React.use(params)
    const [product, setProduct] = useState<Product | null>(null)
    const [quantity, setQuantity] = useState<Quantity>(1 as Quantity)

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`/api/products/${id}`, {
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                }
            })
            const data = await res.json()
            if (data.length > 0) {
                const productData = {
                    id: Number(id),
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
        return <div className='w-100 d-flex justify-content-center align-items-center' style={{height: "calc(100vh - 100px)"}}>Loading...</div>
    }

    /*
    {product.imageUrls.map((image, index) => (
        <img key={index} src={image.url} alt={`Product Image ${index + 1}`} />
    ))}
    */

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity) // TODO: fix argument
        }
    }

    return (
        <>
            <div className="container productContainer">
                <div className="mb-2">
                    <a className='pointer' onClick={() => (router.back())}><FontAwesomeIcon icon={faAnglesLeft as IconProp} /> Vissza</a>
                </div>
                <div className="row">
                    <div className="col-6">
                        <ProductSwiper images={product.imageUrls} />
                    </div>
                    <div className="col-6">
                        <h2>{product.name}</h2>
                        <h3 className='my-3'>Ár: <span className="text-Blue">{product.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span> <span className="text-Orange">Ft</span></h3>
                        <div className="d-flex justify-content-between align-items-center my-3">
                            <div className="quantityWrap">
                                <a 
                                    className="pointer"
                                    onClick={() => quantity > 1 && setQuantity(q => (q - 1) as Quantity)}
                                >
                                    -
                                </a>
                                <h3>{quantity}</h3>
                                <a 
                                    className="pounter"
                                    onClick={() => setQuantity(q => (q + 1) as Quantity)}    
                                >
                                    +
                                </a>
                            </div>
                            <button className='orangeButton' onClick={handleAddToCart}>Kosárba</button>
                             {/*<OrangeButton href="#" onClick={handleAddToCart} />   - - -   Adamnak */}
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
