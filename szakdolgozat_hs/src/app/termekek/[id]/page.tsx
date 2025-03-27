'use client'
import Loading from '@/components/Loading'
import OrangeButton from '@/components/OrangeButton'
import ProductSwiper from '@/components/ProductSwiper'
import { Quantity } from '@/components/RecommendationCard'
import { addToCart } from '@/utils/addToCart'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAnglesLeft, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Product } from '../page'
import fallbackImg from '../../../../public/static/imgNotFound.png'


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
        return <Loading/>
    }

    /*
    {product.imageUrls.map((image, index) => (
        <img key={index} src={image.url} alt={`Product Image ${index + 1}`} />
    ))}
    */

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity)
        }
    }

    const fb = [{
        url: fallbackImg.src
    }]

    if (product.imageUrls === undefined || product.imageUrls.length === 1) {
        product.imageUrls = fb
    }

    let quantityClass = ""
    if (quantity === 1) {
        quantityClass = "disabled"
    } else {
        quantityClass = ""
    }

    return (
        <>
            <div className="container productContainer">
                <div className="mb-2">
                    <a className='pointer' onClick={() => (router.back())}><FontAwesomeIcon icon={faAnglesLeft as IconProp} /> Vissza</a>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-7 col-xl-6 order-2 order-lg-1 mt-5 mt-lg-0">
                        <ProductSwiper images={product.imageUrls} />
                    </div>
                    <div className="col-12 col-lg-5 col-xl-6 order-1 order-lg-2">
                        <h2>{product.name}</h2>
                        <h3 className='my-3'>Ár: <span className="text-Blue">{product.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span> <span className="text-Orange">Ft</span></h3>
                        <div className="d-flex justify-content-between align-items-center my-3">
                            <div className="quantityWrap">
                                <a 
                                    className={`pointer ${quantityClass}`}
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
                        <div id="properyMask">
                            <div className="propertyWrap" id='propertyWrap'>
                                {[...Object.entries(product.properties)].map(
                                    ([key, value], i) => {
                                        return (
                                            <div key={i} className="row propertyRow">
                                                <span className="propertyKey">{key}:</span>
                                                <span className="propertyValue">{value}</span>
                                            </div>
                                        );
                                    }
                                )}
                                <a 
                                    className="productMorePropery d-lg-none" 
                                    id='productMorePropery'
                                    onClick={() => {
                                        const el = document.getElementById("propertyWrap")
                                        const mask = document.getElementById("properyMask")
                                        const text = document.getElementById("productMoreProperyText")
                                        if (!el || !mask || !text) {
                                            return
                                        }
                                        el.classList.toggle("open")
                                        if (el.classList.contains("open")) {
                                            text.textContent = "Kevesebb"
                                        } else {
                                            text.textContent = "Több"
                                        }
                                        let currentHeight = el.offsetHeight
                                        mask.style.height = currentHeight + "px"
                                    }}
                                >
                                    <span id='productMoreProperyText'>Több</span>
                                    <FontAwesomeIcon icon={faSortDown as IconProp} className='ms-2 d-block d-lg-none productMoreProperyArrow' />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
