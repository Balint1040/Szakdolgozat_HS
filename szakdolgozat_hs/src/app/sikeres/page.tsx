"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Fireworks from "react-canvas-confetti/dist/presets/fireworks"
import Realistic from "react-canvas-confetti/dist/presets/realistic"
/*<Fireworks autorun={{ speed: 3, duration: 2000, delay: 300 }} />*/
export default function Page() {

    const router = useRouter()

    useEffect(() => {
        async function clearCart() {
            try {
                console.log('clearing cart...')
                const res = await fetch('/api/cartItems', {
                    method: 'PATCH',
                    headers: {
                        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || "",
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                
                if (res.ok) {
                    window.dispatchEvent(new Event('cartUpdated'))
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                }
            } catch (e) {
                console.error(e)
            }
        }

        clearCart()
    }, [router])


    return (
        <>
            <div className="d-flex justify-content-center align-items-center successPayment">
                Sikeres fizetés
            </div>
            <Realistic autorun={{ speed: 1, duration: 500, delay: 200 }} />
        </>
    )
}