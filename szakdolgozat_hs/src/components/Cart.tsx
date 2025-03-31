'use client'

import { CartItem } from "@/app/kosar/page";
import { Product } from "@/app/termekek/page";
import Link from "next/link";
import fallbackImg from '../../public/static/imgNotFound.png'
import { useState } from "react";


interface CartProps {
    product: CartItem
    quantity: number
    onQuantityChange: (quantity: number) => void
    onRemove: () => void
}

export default function Cart({
    product,
    quantity,
    onQuantityChange,
    onRemove
} : CartProps) {

    const [imageError, setImageError] = useState<boolean>()
    
    function handleLoadingError() {
        setImageError(true)
    }
    
    if(!product){
        console.error('Product is missing', product)
    }

    let quantityClass = ""
    if (quantity === 1) {
        quantityClass = "disabled"
    } else {
        quantityClass = ""
    }

    return (
        <div className="row cartItemRow">
            <div className="col-12 col-md-4 p-0 position-relative h-100">
                <div className="cartImgWrap">
                    {!imageError ? (
                        <img src={!product.imageUrl ? (product.url ?? fallbackImg.src) : product.imageUrl} alt={product.name} onError={() => handleLoadingError()} />
                    ) : (
                        <img src={fallbackImg.src} alt={product.name} />
                    )}
                </div>
            </div>
            <div className="col-12 col-md-8 h-100 position-relative">
                <div className="d-flex flex-column h-100 justify-content-between">
                    <div className="row">
                        <div className="col-12 col-lg-9">
                            <Link href={`/termekek/${product.productId}`} className="cartName">{product.name}</Link>
                        </div>
                        <div className="col-12 col-lg-3 text-end">
                            <span className="text-Blue">{(product.price*quantity).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span>,-
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button
                        className="orangeButton danger"
                        onClick={onRemove}
                        >
                            Törlés
                        </button>

                        <div className="quantityWrap">
                            <a 
                                className={`pointer ${quantityClass}`}
                                onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
                            >
                                -
                            </a>
                            <h3>{quantity}</h3>
                            <a 
                                className="pointer"
                                onClick={() => onQuantityChange(quantity + 1)}
                            >
                                +
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}