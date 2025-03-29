'use client'

import { Product } from "@/app/termekek/page"
import { Button, ButtonGroup } from "react-bootstrap"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { enqueueSnackbar } from "notistack"
import fallbackImg from '../../../../public/static/imgNotFound.png'

export default function Page() {

    const [products, setProducts] = useState<Product[]>([])
    //const [newProduct, setNewProducts] = useState<Product>()

    const categoryOptions: { [key: number]: string } = {
        1: "Videókártya",
        2: "Processzor",
        3: "Alaplap",
        4: "Memória"
    }

    useEffect(() => {
        async function fetchProducts() {
            const data = await fetch(`/api/products`, {
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                }
            })
            const init = (await data.json()) as Product[]

            setProducts([...init])
        }

        fetchProducts()
    }, [])

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])


    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/products`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                setProducts(products.filter(product => product.id !== id))
                enqueueSnackbar('Termék sikeresen törölve', { variant: "success", autoHideDuration: 2000 })
                const closeButton = document.querySelector(`#deleteModal${id} .btn-close`)
                closeButton?.dispatchEvent(new Event('click'))
            }
        } catch (e) {
            console.error(e)
            enqueueSnackbar('Termék törlése sikertelen', { variant: "error", autoHideDuration: 2000 })
        }
    }


    return (
        <div className="container-fluid position-relative px-0 productContainer">
            <div className="d-flex justify-content-between">
                <h1 className="mb-3 mb-sm-0">Termékek</h1>
                <button className="orangeButton" data-bs-toggle="modal" data-bs-target="#productModal">
                    Termék hozzáadása
                </button>
            </div>
            <hr />
            <div className="row dashboardRowHeader">
                <div className="col-1">
                    ID
                </div>
                <div className="col-7">
                    Név
                </div>
                <div className="col-1">
                    Ár
                </div>
                <div className="col-1">
                    Kategória
                </div>
            </div>
            {products.map((product) => (
                <div className="row dashboardRow" key={product.id}>
                    <div className="col-1">
                        {product.id}
                    </div>
                    <div className="col-7">
                        {(product.name.slice(0, 95).length) < 95 ? product.name : (product.name.slice(0, 95) + "...")}
                    </div>
                    <div className="col-1">
                        {product.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")},-
                    </div>
                    <div className="col-2">
                        {categoryOptions[product.categoryId]}
                    </div>
                    <div className="col-1 d-flex justify-content-end dashboardButtons">
                        <ButtonGroup>
                            <Button
                                variant="warning"
                                href={`/vezerlopult/termekek/${product.id}`}
                            >
                                <FontAwesomeIcon icon={faPen as IconProp} />
                            </Button>
                            <Button
                                variant="danger"
                                data-bs-toggle="modal"
                                data-bs-target={`#deleteModal${product.id}`}
                            >
                                <FontAwesomeIcon icon={faTrash as IconProp} />
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div className="modal fade" id={`deleteModal${product.id}`} tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Felhasználó törlése</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    Biztosan törölni szeretnéd <strong>{product.name}</strong> terméket?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="blueButton" data-bs-dismiss="modal">Mégsem</button>
                                    <button type="button" className="orangeButton" onClick={() => handleDelete(product.id)}>Törlés</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="modal fade" id="productModal" tabIndex={-1} aria-labelledby="productModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Termék hozzáadása</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            
                            <div className="row justify-content-center justify-content-xxl-start">
                                <div className="col-12 col-sm-10 col-md-8 col-lg-12 col-xxl-6 order-2 order-xxl-1 mt-5 mt-xxl-0">
                                    {/*<ProductSwiper images={product.imageUrls} />*/}
                                    <div className="mb-3">
                                        <label className="form-label">Képek kezelése:</label>
                                        <div className="image-list mb-3">
                                            <div /*key={index}*/ className="d-flex align-items-center mb-2">
                                                    <img
                                                        src={/*image.url || */fallbackImg.src}
                                                        style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        /*value={image.url != fallbackImg.src ? image.url : ""}
                                                        onChange={(e) => handleChange(e, undefined, index)}*/
                                                        placeholder="Kép URL"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm ms-2"
                                                        /*onClick={() => {
                                                            const newImageUrls = product.imageUrls.filter((_, i) => i !== index)
                                                            setProduct(prevState => prevState ? ({ ...prevState, imageUrls: newImageUrls }) : null)
                                                            setDeletedImages(prevState => [...prevState, image.url])
                                                        }}*/
                                                    >
                                                        <FontAwesomeIcon icon={faTrash as IconProp} />
                                                    </button>
                                                </div>
                                            <button
                                                className="addImgButton"
                                                /*onClick={() => {
                                                    setProduct(prevState => {
                                                        if (!prevState) return null
                                                        return {
                                                            ...prevState,
                                                            imageUrls: [...prevState.imageUrls, { url: fallbackImg.src }]
                                                        }
                                                    })
                                                }}*/
                                            >
                                                Új kép hozzáadása
                                                <span><FontAwesomeIcon icon={faPlus as IconProp} /></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-xxl-6 order-1 order-xxl-2">
                                    <form /*onSubmit={handleSubmit}*/>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Név:</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className="form-control"
                                                /*value={product.name}
                                                onChange={handleChange}*/
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label">Ár:</label>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                className="form-control"
                                                /*value={product.price}
                                                onChange={handleChange}*/
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="manufacturer" className="form-label">Gyártó:</label>
                                            <input
                                                type="text"
                                                id="manufacturer"
                                                name="manufacturer"
                                                className="form-control"
                                                /*value={product.manufacturer}
                                                onChange={handleChange}*/
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
                                            <div className="row my-4 my-sm-2" /*key={index}*/>
                                                <div className="col-10 col-sm-11">
                                                    <div className="row">
                                                        <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                /*value={property[0]}
                                                                onChange={(e) => handleChange(e, index, undefined, true)}*/
                                                                placeholder="Tulajdonság neve"
                                                            />
                                                        </div>
                                                        <div className="col-12 col-sm-6">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                /*value={property[1]}
                                                                onChange={(e) => handleChange(e, index, undefined, false)}*/
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
                                                            /*onClick={() => {
                                                                const properties = Object.entries(newProduct.properties)
                                                                const filteredProperties = properties.filter((_, i) => i !== index)
                                                                const updatedProperties = filteredProperties.reduce((acc, [key, value]) => {
                                                                    acc[key] = value
                                                                    return acc
                                                                }, {} as Record<string, string>)

                                                                setProduct(prevState => prevState ? ({
                                                                    ...prevState,
                                                                    properties: updatedProperties
                                                                }) : null)
                                                            }}*/
                                                        >
                                                            <FontAwesomeIcon icon={faTrash as IconProp} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        <button
                                            className="addImgButton"
                                            type='button'
                                            /*onClick={() => {
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
                                            }}*/
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
                                                /*value={product.categoryId}
                                                onChange={handleChange}*/
                                            >
                                                {Object.entries(categoryOptions).map(([id, name]) => (
                                                    <option key={id} value={id}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" className="orangeButton visually-hidden" id='productSumbit' name='productSumbit'>Mentés</button>
                                    </form>
                                </div>
                            </div>
                            
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="blueButton" data-bs-dismiss="modal">Mégse</button>
                            <button type="button" className="orangeButton" data-bs-dismiss="modal" /*onClick={handleProfilePicSubmit}*/>Mentés</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}