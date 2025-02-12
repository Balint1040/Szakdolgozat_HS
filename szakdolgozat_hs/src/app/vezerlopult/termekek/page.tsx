'use client'

import { Product } from "@/app/termekek/page"
import { useEffect, useState } from "react"

export default function Page() {

    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        async function fetchRecipes() {
            const data = await fetch(`/api/products`)
            const init = (await data.json()) as Product[]

            setProducts([...init])
        }

        fetchRecipes()
    }, [])

    return (
        <div>
            <div className="row dashboardProductsHeader">
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
                <div className="row" key={product.id}>
                    <div className="col-1">
                        {product.id}
                    </div>
                    <div className="col-7">
                        {(product.name.slice(0, 95).length) < 95 ? product.name : (product.name.slice(0, 95) + "...")}
                    </div>
                    <div className="col-1">
                        {product.price}.-
                    </div>
                    <div className="col-1">
                        {product.categoryId}
                    </div>
                </div>
            ))}
        </div>
    )
}