'use client'

import Loading from "@/components/Loading"
import Payment from "@/components/Payment"
import { useEffect, useState } from "react"

export interface PaymentInfo {
    id: string
    amount: number
    status: string
    created: Date
    currencry: string,
    name: string,
    quantity: number
    items: {
        name: string,
        quantity: number
    }[]
}


export default function Page() {
    const [payments, setPayments] = useState<PaymentInfo[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const res = await fetch('/api/stripe/admin', {
                    headers: {
                        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                    },
                    credentials: "include"
                })
                const data = await res.json()
                if (data.status === 200) {
                    setPayments(data.orders)
                }
                setIsLoading(false)
            } catch (e) {
                console.error(e)
            }
        }

        fetchPaymentHistory()
    }, [])

    return (
        <div className="container py-4 mt-4 mt-lg-0">
            <h3>Korábbi rendelések</h3>
            <hr />
            {payments.length == 0 ? (
                <>
                    {isLoading ? (
                        <div className="w-100 h-100 d-flex justify-content-center align-items-center py-5">
                            <div className="loader"></div><div>Betöltés...</div>
                        </div>
                    ) : (
                        <p className="text-center">Még nincs fizetési előzmény</p>
                    )}
                </>
            ) : (
                <div>
                    {payments.map((payment) => (
                        <Payment payment={payment} key={payment.id} />
                    ))}
                </div>
                
            )}
        </div>
    )
}