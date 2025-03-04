'use client'

import Cart from "@/components/Cart";
import ProfileProductHistory from "@/components/ProfileProductHistory";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface Product {
    id: number,
    name: string,
    price: number,
    properties: Object,
    manufacturer: string,
    categoryId: number,
    imageUrls: { url: string }[],
}

export default function Page() {
    const [product, setProduct] = useState<Product | null>(null)

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])

    useEffect(() => {
            const fetchProduct = async () => {
                const res = await fetch(`/api/products/1`, {
                    headers: {
                        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                    }
                })
                const data = await res.json()
                if (data.length > 0) {
                    const productData = {
                        id: 1,
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
        }, [])

    return (
        <>
            <div className="row profileRow py-3">
                <div className="col-4">
                    <div className="d-flex flex-column justify-content-center align-items-center w-100">
                        <div className="dashboardProfilKepWrap mb-3">
                            <FontAwesomeIcon icon={faUser as IconProp} />
                        </div>
                        <a className="editText" data-bs-toggle="modal" data-bs-target="#nameModal"><h1>Példa Név</h1></a>
                        <a className="editText" data-bs-toggle="modal" data-bs-target="#emailModal"><h5>pelda@email.hu</h5></a>
                    </div>
                </div>
                <div className="col-8">
                    <h3>Korábbi rendelések</h3>
                    <hr />
                    {!product ? "Még nincs előzmény" : <ProfileProductHistory product={product}/>}

                </div>

                <div className="modal fade" id="nameModal" tabIndex={-1} aria-labelledby="nameModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Név szerkesztése</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                
                                <form action="">
                                    <label htmlFor="profileName" className="form-label">Név</label>
                                    <input type="text" id="profileName" className="form-control"/>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="blueButton" data-bs-dismiss="modal">Mégse</button>
                                <button type="button" className="orangeButton">Mentés</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="emailModal" tabIndex={-1} aria-labelledby="emailModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Email szerkesztése</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                
                                <form action="">
                                    <label htmlFor="profileEmail" className="form-label">Email</label>
                                    <input type="text" id="profileEmail" className="form-control"/>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="blueButton" data-bs-dismiss="modal">Mégse</button>
                                <button type="button" className="orangeButton">Mentés</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}