"use client"

import { CartItem } from "@/app/kosar/page";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoggedInButtons() {

    const [cartItems, setCartItems] = useState<CartItem[]>([])
    async function cartItemNumber() {
        try {
            const res = await fetch('/api/carts', {
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                credentials: "include"
            })
            const data = await res.json()
            setCartItems(data)
        } catch (error) {
            console.error('Failed to fetch cart items:', error)
        }
    }

    useEffect(() => {
        cartItemNumber()
    }, [cartItems])

    return (
        <div className="d-flex flex-row justify-content-between">
            <Link className="loggedInCartButton me-3" href="/kosar">
                <FontAwesomeIcon icon={faCartShopping as IconProp} />
                <span className="cartButtonNum">{cartItems.length > 9 ? "9+" : cartItems.length}</span>
            </Link>
            <Link className="loggedInCartButton loggedInProfileButton" href="/vezerlopult">
                <FontAwesomeIcon icon={faUser as IconProp} />
            </Link>
        </div>
    )
}