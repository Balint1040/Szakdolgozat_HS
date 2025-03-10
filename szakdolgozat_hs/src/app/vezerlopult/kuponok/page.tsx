'use client'
import { useState, useEffect } from 'react'

interface Coupon {
    id: number
    code: string
    discount: number
    minAmount: number
    expiryDate: string
    usageLimit: number
    currentUsage: number
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discount: 1,
        minAmount: 0,
        expiryDate: "",
        usageLimit: 1
    })

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/coupons', {
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ''
                }
            })
            if (res.ok) {
                const data = await res.json()
                setCoupons(data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify(newCoupon)
            })

            if (res.ok) {
                fetchCoupons()
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleDelete = async (code: string) => {
        try {
            const res = await fetch('/api/coupons', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ''
                },
                body: JSON.stringify({ code })
            })

            if (res.ok) {
                fetchCoupons()
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="container-fluid">
            <h1 className="mb-4">Kuponok kezelése</h1>
            <form onSubmit={handleSubmit} className="card mb-4 p-3">
                <div className="row g-3">
                    <div className="col-md-2">
                        <label className="form-label">Kuponkód</label>
                        <input
                            type="text"
                            className="form-control"
                            value={newCoupon.code}
                            onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Kedvezmény (%)</label>
                        <input
                            type="number"
                            className="form-control"
                            min="1"
                            max="100"
                            value={newCoupon.discount}
                            onChange={e => setNewCoupon({ ...newCoupon, discount: parseInt(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Minimum összeg</label>
                        <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={newCoupon.minAmount}
                            onChange={e => setNewCoupon({ ...newCoupon, minAmount: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className='fomr-control'>Lejárati dátum</label>
                        <input
                            type="date"
                            value={newCoupon.expiryDate}
                            onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Felhasználási limit</label>
                        <input
                            type="number"
                            className="form-control"
                            value={newCoupon.usageLimit}
                            onChange={e => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary w-100">
                            Létrehozás
                        </button>
                    </div>
                </div>
            </form>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Kód</th>
                            <th>Kedvezmény</th>
                            <th>Min. összeg</th>
                            <th>Lejárat</th>
                            <th>Használva</th>
                            <th>MŰveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon.id}>
                                <td>{coupon.code}</td>
                                <td>{coupon.discount}%</td>
                                <td>{coupon.minAmount} Ft</td>
                                <td>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Nincs'}</td>
                                <td>{coupon.currentUsage}/{coupon.usageLimit}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(coupon.code)}
                                    >
                                        Törlés
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}