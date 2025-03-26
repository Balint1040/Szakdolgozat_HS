"use client"

import { CartItem } from "@/app/kosar/page";
import { User } from "@/app/vezerlopult/profil/page";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoggedInButtons() {

    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [user, setUser] = useState<User | null>(null)

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
        const fetchUserData = async() => {
            try {
                const res = await fetch("/api/users", {
                    headers: {
                        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                    },
                    credentials: "include"
                })
                const data = await res.json()
                
                if (res.ok ) {
                    setUser(data)
                }
            } catch(e) {
                console.error(e)
            }
        }
        fetchUserData()
    }, [])

    useEffect(() => {
        cartItemNumber()
        window.addEventListener("cartUpdated", cartItemNumber)
        setCartItems([])
    }, [])

    return (
        <div className="d-flex flex-row justify-content-between">
            <Link className="loggedInCartButton me-3" href="/kosar">
                <FontAwesomeIcon icon={faCartShopping as IconProp} />
                <span className={"cartButtonNum " + (cartItems.length === 0 ? "d-none" : "")}>{cartItems.length > 9 ? "9+" : cartItems.length}</span>
            </Link>
            <Link className="loggedInCartButton loggedInProfileButton" href="/vezerlopult">
                {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="navbarPfp" />
                ) : (
                    <FontAwesomeIcon icon={faUser as IconProp} />
                )}
            </Link>
        </div>
    )
}