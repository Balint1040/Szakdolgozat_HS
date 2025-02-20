'use client'

import { Product } from "@/app/termekek/page"
import { Button, ButtonGroup } from "react-bootstrap"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

export default function Page() {

    const [products, setProducts] = useState<Product[]>([])

    const categoryOptions: { [key: number]: string } = {
        1: "Videókártya",
        2: "Processzor",
        3: "Alaplap",
        4: "Memória"
    }

    useEffect(() => {
        async function fetchRecipes() {
            const data = await fetch(`/api/products`, {
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                }
            })
            const init = (await data.json()) as Product[]

            setProducts([...init])
        }

        fetchRecipes()
    }, [])

    const handleDelete = async (id: number) => {
        if (confirm("Biztosan törölni szeretnéd ezt a terméket?")) {
            await fetch(`/api/products`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify({ id })
            })
            setProducts(products.filter(product => product.id !== id))
            alert("Termék törölve!")
        }
    }


    return (
        <div className="container-fluid position-relative">
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
                                onClick={() => handleDelete(product.id)}
                            >
                            <FontAwesomeIcon icon={faTrash as IconProp} />
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            ))}
        </div>
    )
}