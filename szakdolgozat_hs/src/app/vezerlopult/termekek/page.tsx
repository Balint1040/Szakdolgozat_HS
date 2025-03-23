'use client'

import { Product } from "@/app/termekek/page"
import { Button, ButtonGroup } from "react-bootstrap"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { enqueueSnackbar } from "notistack"

export default function Page() {

    const [products, setProducts] = useState<Product[]>([])

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
        <div className="container-fluid position-relative px-0">
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
        </div>
    )
}