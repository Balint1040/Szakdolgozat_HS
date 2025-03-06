"use client"

import { useEffect, useState } from "react"
import { Product } from "../termekek/page"
import Cart from "@/components/Cart"
import OrangeButton from "@/components/OrangeButton"
import BlueButton from "@/components/BlueButton"
import Loading from "@/components/Loading"
import Stripe from "stripe"
import { loadStripe } from "@stripe/stripe-js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping, faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

export interface CartItem {
    id: number
    product: Product
    quantity: number
    price: number
    name: string
    imageurl: string
    url: string
}


export default function Page() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

    async function fetchCartItems() {
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
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCartItems()
    }, [])

    const quantityChange = async (productid: number, newQuantity: number) => {
        try{
            const res = await fetch('/api/carts',{
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify({id: productid, quantity: newQuantity})
            })
            if(res.ok){
                await fetchCartItems()
            }
        }catch(e){
            console.error(e)
        }
    }

    const handleRemove = async(productId:number) => {
        try{
            const res = await fetch(`/api/cartItems`, {
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                credentials: 'include',
                body: JSON.stringify({productId: productId})
            })
            if(res.ok){
                fetchCartItems()
            }
        }catch(e){
            console.error(e)
        }
    }

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity)
        }, 0)
    }

    async function handleCheckout() {
        try {
            const stripe = await stripePromise

            const response = await fetch('/api/stripe', {
                method: 'POST',
            })

            const { sessionId } = await response.json()

            await stripe?.redirectToCheckout({
                sessionId,
            })
        } catch (e) {
            console.log(e)
        }
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <div className="container py-4">
                <div className="row">
                    <div className="d-flex justify-content-between align-items-center pb-3">
                        <h3>Kosaram</h3>
                        <OrangeButton name="Tovább vásárlok" href="/termekek" variant="discover" />
                    </div>
                    <hr />
                </div>
                {cartItems.length === 0 ? (
                    <div className="emptyCart">
                        <div className="emptyIconWrap">
                            <FontAwesomeIcon icon={faCartShopping as IconProp} />
                            <FontAwesomeIcon icon={faCircleXmark as IconProp} />
                        </div>
                        A kosarad jelenleg üres
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <Cart 
                            key={item.id} 
                            product={{
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                imageUrl: item.imageurl,
                                url: item.url
                            }}
                            quantity={item.quantity}
                            onQuantityChange={(newQuantity) => quantityChange(item.id, newQuantity)} 
                            onRemove={() => handleRemove(item.id)}
                        />
                    ))
                )}
                <div className="row">
                    <hr />
                    <div className="d-flex flex-column align-items-end cartBottomRow">
                        <div className="mb-3 d-flex justify-content-between w-100">
                            <div className="d-flex align-items-center justiy-content-center">
                                <label htmlFor="voucher" className="pe-2">Kuponkód:</label>
                                <input type="text" id="voucher" className="form-control" />
                            </div>
                            <div>
                                Összesen: <span className="text-Orange">{calculateTotal().toFixed().replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span>,-
                            </div>
                        </div>
                        {/*<BlueButton name="Fizetés" href="#" variant="discover" />*/}
                        <button onClick={handleCheckout} className={`blueButton ${(cartItems.length === 0 ? "disabled" : "")}`}>Fizetés</button>
                    </div>
                </div>
            </div>
        </>
    )
}