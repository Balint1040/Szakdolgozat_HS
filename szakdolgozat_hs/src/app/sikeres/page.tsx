"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Fireworks from "react-canvas-confetti/dist/presets/fireworks"
import Realistic from "react-canvas-confetti/dist/presets/realistic"
import { enqueueSnackbar } from "notistack"

export default function Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        async function clearCart() {
            try {
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
                }
                
                if (sessionId) {
                    try {
                            await fetch('/api/stripe/couponUsage', {
                            method: 'POST',
                            headers: {
                                'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || "",
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                sessionId
                            })
                        })
                    } catch (e) {
                        console.error(e)
                    }
                }
                setTimeout(() => {
                    router.push('/')
                }, 3000)
            } catch (e) {
                console.error(e)
            }
        }

        clearCart()

    }, [router, sessionId])

    return (
        <>
            <div className="d-flex justify-content-center align-items-center successPayment">
                Sikeres fizetés
            </div>
            <Realistic autorun={{ speed: 1, duration: 500, delay: 200 }} />
        </>
    )
}