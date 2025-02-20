"use client"

import { useEffect, useState } from "react"
import { Product } from "../termekek/page"
import Cart from "@/components/Cart"
import OrangeButton from "@/components/OrangeButton"
import BlueButton from "@/components/BlueButton"

export default function Page() {
    const [products, setProducts] = useState<Product[] | null>(null)

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

    if (products === null) {
        return (
            <div>Loading...</div>
        )
    }

    const subTotal = 236956
    return (
        <>
            <div className="container py-4">
                <div className="row">
                    <h3>Kosaram</h3>
                    <hr />
                </div>
                <Cart product={products[0]} />
                <Cart product={products[1]} />
                <div className="row">
                    <hr />
                    <div className="d-flex flex-column align-items-end cartBottomRow">
                        <div className="mb-3 d-flex justify-content-between w-100">
                            <div className="d-flex align-items-center justiy-content-center">
                                <label htmlFor="voucher" className="pe-2">Kuponkód:</label>
                                <input type="text" id="voucher" className="form-control" />
                            </div>
                            <div>
                                Összesen: <span className="text-Orange">{subTotal.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span>,-
                            </div>
                        </div>
                        <BlueButton name="Fizetés" href="#" variant="discover" />
                    </div>
                </div>
            </div>
        </>
    )
}