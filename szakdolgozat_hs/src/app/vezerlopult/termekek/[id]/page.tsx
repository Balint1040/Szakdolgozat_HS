'use client'
import OrangeButton from '@/components/OrangeButton'
import ProductSwiper from '@/components/ProductSwiper'
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProduct(prevState => prevState ? ({
            ...prevState,
            [name]: value
        }) : null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (product) {
            await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            })
            alert("juhu")
        }
    }

    if (!product) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="container productContainer">
                <div className="mb-2">
                    <a className='pointer' onClick={() => { router.back() }}>
                        <FontAwesomeIcon icon={faAnglesLeft as IconProp} /> Vissza
                    </a>
                </div>
                <div className="row">
                    <div className="col-6">
                        <ProductSwiper images={product.imageUrls} />
                    </div>
                    <div className="col-6">
                        <h2>{product.name}</h2>
                        <h3 className='my-3'>Ár: <span className="text-Blue">{product.price}</span></h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Név:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={product.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Ár:</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    className="form-control"
                                    value={product.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="manufacturer" className="form-label">Gyártó:</label>
                                <input
                                    type="text"
                                    id="manufacturer"
                                    name="manufacturer"
                                    className="form-control"
                                    value={product.manufacturer}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoryId" className="form-label">Termékkategória:</label>
                                <input
                                    type="text"
                                    id="categoryId"
                                    name="categoryId"
                                    className="form-control"
                                    value={product.categoryId}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Mentés</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}