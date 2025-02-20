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
}: {
    params: Promise<{ id: string }>
}) {
    const router = useRouter()
    const { id } = React.use(params)
    const [product, setProduct] = useState<Product | null>(null)

    const categoryOptions = {
        1: "Videókártya",
        2: "Processzor",
        3: "Alaplap",
        4: "Memória"
    }

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, propertyIndex?: number, isKey?: boolean) => {
        const { name, value } = e.target
        if (propertyIndex !== undefined) {
            setProduct(prevState  => {

                if(!prevState) return null
                
                const properties = Object.entries(prevState.properties);
                if (isKey) {
                    const [_, oldValue] = properties[propertyIndex]
                    properties[propertyIndex] = [value, oldValue]
                } else {
                    const [oldKey, _] = properties[propertyIndex]
                    properties[propertyIndex] = [oldKey, value]
                }
                
                const updatedProperties = properties.reduce((acc, [key, value]) => {
                    acc[key] = value
                    return acc
                }, {} as Record<string, string>);
    
                return {
                    ...prevState,
                    properties: updatedProperties
                }
            })
        } else {
            setProduct(prevState => prevState ? ({
                ...prevState,
                [name]: value
            }) : null)
        }
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
        return <div className="w-100 h-100 d-flex justify-content-center align-items-center">Loading...</div>
    }

    return (
        <>
            <div className="container-fluid productContainer py-3">
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
                        <h3 className='my-3'>Ár: <span className="text-Blue">{product.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")},-</span></h3>
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
                            { /*
                            <div className="mb-3">
                                <label htmlFor="properties" className='form-label'>Tulajdonságok</label>
                                <textarea
                                    id="properties"
                                    name="properties"
                                    className="form-control"
                                    value={JSON.stringify(product.properties)}
                                    onChange={handleChange}
                                />
                            </div>
                            */ 
                            }
                                <label className="form-label">Tulajdonságok:</label>
                                {Object.entries(product.properties).map((property, index) => (
                                    <div className="row my-2" key={index}>
                                        <div className="col-6">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={property[0]} 
                                                onChange={(e) => handleChange(e, index, true)} 
                                                placeholder="Tulajdonság neve"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={property[1]} 
                                                onChange={(e) => handleChange(e, index, false)} 
                                                placeholder="Érték"
                                            />
                                        </div>
                                    </div>
                                ))}
                            <div className="mb-3">
                                <label htmlFor="categoryId" className="form-label">Termékkategória:</label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    className="form-control"
                                    value={product.categoryId}
                                    onChange={handleChange}
                                >
                                    {Object.entries(categoryOptions).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="blueButton">Mentés</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}