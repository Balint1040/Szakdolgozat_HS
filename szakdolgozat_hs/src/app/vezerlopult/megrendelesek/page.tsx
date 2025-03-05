'use client'

import { useEffect, useState } from "react"

interface Payment {
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
    }
}


export default function Page() {
    const [payments, setPayments] = useState<Payment[]>([])

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const res = await fetch('/api/stripe', {
                    headers: {
                        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                    }
                })
                const data = await res.json()
                if (data.status === 200) {
                    setPayments(data.payments)
                }
            } catch (e) {
                console.error(e)
            }
        }

        fetchPaymentHistory()
    }, [])

    return (
        <div className="container py-4">
            <h3>Korábbi rendelések</h3>
            <hr />
            {payments.length == 0 ? (
                <p>Még nincs fizetési előzmény</p>
            ) : (
                <div>
                    {payments.map((payment) => (
                        <div key={payment.id} className="mb-3 p-3 border rounded">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <strong>Rendelés azonosító:</strong> {payment.id}
                                </div>
                                <div>
                                    <strong>Összeg:</strong> {payment.amount.toLocaleString()} {payment.currencry}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <div>
                                    <strong>Státusz:</strong> {payment.status}
                                </div>
                                <div>
                                    <strong>Dátum:</strong> {new Date(payment.created).toLocaleDateString('hu-HU')}
                                </div>
                                <div className="mt-3">
                                    <strong>Termékek:</strong>
                                        {payment.items?.map((item, index) => (
                                            <li key={index}>• {item.name} - {item.quantity} db</li>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            )}
        </div>
        
    )
}