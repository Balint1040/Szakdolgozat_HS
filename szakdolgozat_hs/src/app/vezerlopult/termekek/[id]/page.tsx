'use client'
import Loading from '@/components/Loading'
import OrangeButton from '@/components/OrangeButton'
import ProductSwiper from '@/components/ProductSwiper'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faAnglesLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import fallbackImg from '../../../../../public/static/imgNotFound.png'

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
    const [deletedImages, setDeletedImages] = useState<string[]>([])

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, propertyIndex?: number,imageIndex?: number,isKey?: boolean) => {
        const { name, value } = e.target

        if (imageIndex !== undefined) {
            setProduct(prevState => {
                if (!prevState) return null
                
                const isDuplicate = prevState.imageUrls.some(
                    (img, idx) => idx !== imageIndex && img.url === value
                )
                if (isDuplicate) {
                    return prevState
                }
    
                const newImageUrls = [...prevState.imageUrls]
                newImageUrls[imageIndex] = { url: value }
                return {
                    ...prevState,
                    imageUrls: newImageUrls
                }
            })
            return
        }

        if (propertyIndex !== undefined) {
            setProduct(prevState => {
                if (!prevState) return null
                const properties = Object.entries(prevState.properties)
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
                }, {} as Record<string, string>)
    
                return {
                    ...prevState,
                    properties: updatedProperties
                }
            })
        }

        setProduct(prevState => prevState ? ({
            ...prevState,
            [name]: value
        }) : null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (product) {
            try {
                const validImages = product.imageUrls.filter(img => img.url).map(img => img.url)

                const res = await fetch(`/api/products/${id}`, {
                    headers: {
                        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                    }
                })
                const currentData = await res.json()
                const existingUrls = new Set(currentData.map((item: { url: string }) => item.url))

                const newImages = validImages.filter(url => !existingUrls.has(url))

                const validProperties = Object.entries(product.properties).reduce((acc, [key, value]) => {
                    if (key.trim() && value.trim()) {
                        acc[key] = value
                    }
                    return acc
                }, {} as Record<string, string>)

                await fetch(`/api/products/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY || ""
                    },
                    body: JSON.stringify({
                        ...product,
                        properties: validProperties,
                        deletedImages: deletedImages,
                        images: newImages
                    })
                })
    
                enqueueSnackbar('Sikeres termékmódosítás', {variant: "success", autoHideDuration: 2000})
                setDeletedImages([])
            } catch (e) {
                console.error(e)
                enqueueSnackbar('Hiba történt a mentés során', {variant: "error", autoHideDuration: 2000})
            }
        }
    }

    if (!product) {
        return <Loading />
    }

    const fb = [{
        url: fallbackImg.src
    }]

    if (product.imageUrls === undefined || product.imageUrls.length === 1) {
        product.imageUrls = fb
    }

    return (
        <>
            <div className="container-fluid productContainer py-3 mt-5 mt-lg-0 position-relative">
                <div className="mb-2">
                    <a className='pointer' onClick={() => { router.push('/vezerlopult/termekek') }}>
                        <FontAwesomeIcon icon={faAnglesLeft as IconProp} /> Vissza
                    </a>
                </div>
                <div className="row justify-content-center justify-content-xxl-start">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-12 col-xxl-6 order-2 order-xxl-1 mt-5 mt-xxl-0">
                        <ProductSwiper images={product.imageUrls} />
                        <div className="mb-3">
                            <label className="form-label">Képek kezelése:</label>
                            <div className="image-list mb-3">
                                {product.imageUrls.map((image, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <img
                                            src={image.url || fallbackImg.src}
                                            style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }}
                                        />
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={image.url != fallbackImg.src ? image.url : ""}
                                            onChange={(e) => handleChange(e, undefined, index)}
                                            placeholder="Kép URL"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm ms-2"
                                            onClick={() => {
                                                const newImageUrls = product.imageUrls.filter((_, i) => i !== index)
                                                setProduct(prevState => prevState ? ({ ...prevState, imageUrls: newImageUrls }) : null)
                                                setDeletedImages(prevState => [...prevState, image.url])
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrash as IconProp} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="addImgButton"
                                    onClick={() => {
                                        setProduct(prevState => {
                                            if (!prevState) return null
                                            return {
                                                ...prevState,
                                                imageUrls: [...prevState.imageUrls, { url: fallbackImg.src }]
                                            }
                                        })
                                    }}
                                >
                                    Új kép hozzáadása
                                    <span><FontAwesomeIcon icon={faPlus as IconProp} /></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xxl-6 order-1 order-xxl-2">
                        <h2>{product.name}</h2>
                        <h3 className='my-3'>Ár: <span className="text-Blue">{Number(product.price).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")},-</span></h3>
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
                                <div className="row my-4 my-sm-2" key={index}>
                                    <div className="col-10 col-sm-11">
                                        <div className="row">
                                            <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={property[0]}
                                                    onChange={(e) => handleChange(e, index, undefined, true)}
                                                    placeholder="Tulajdonság neve"
                                                />
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={property[1]}
                                                    onChange={(e) => handleChange(e, index, undefined, false)}
                                                    placeholder="Érték"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-1">
                                        <div className="d-flex h-100 align-items-center justify-content-center">
                                            <button
                                                className="btn btn-danger btn-sm"
                                                type='button'
                                                onClick={() => {
                                                    const properties = Object.entries(product.properties)
                                                    const filteredProperties = properties.filter((_, i) => i !== index)
                                                    const updatedProperties = filteredProperties.reduce((acc, [key, value]) => {
                                                        acc[key] = value
                                                        return acc
                                                    }, {} as Record<string, string>)

                                                    setProduct(prevState => prevState ? ({
                                                        ...prevState,
                                                        properties: updatedProperties
                                                    }) : null)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash as IconProp} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                className="addImgButton"
                                type='button'
                                onClick={() => {
                                    setProduct(prevState => {
                                        if (!prevState) return null
                                        return {
                                            ...prevState,
                                            properties: {
                                                ...prevState.properties,
                                                "": ""
                                            }
                                        }
                                    })
                                }}
                            >
                                Új tulajdonság hozzáadása
                                <span><FontAwesomeIcon icon={faPlus as IconProp} /></span>
                            </button>
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
                            <button type="submit" className="orangeButton visually-hidden" id='productSumbit' name='productSumbit'>Mentés</button>
                        </form>
                    </div>
                    <div className="col-12 order-3">
                        <div className="d-flex justify-content-center">
                            <label className="orangeButton w-min-content" htmlFor='productSumbit'>Mentés</label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}