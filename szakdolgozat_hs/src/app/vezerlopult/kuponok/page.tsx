'use client'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

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
        <>
            <div className="container-fluid position-relative px-0 couponsContainer">
                <form onSubmit={handleSubmit} className="card mb-4 p-3">
                    <div className="row">
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
                            <label className='form-label'>Lejárati dátum</label>
                            <input
                                type="date"
                                value={newCoupon.expiryDate}
                                className='form-control inputDate'
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
                            <button type="submit" className="orangeButton">
                                Létrehozás
                            </button>
                        </div>
                    </div>
                </form>
                <div className="row dashboardRowHeader">
                    <div className="col-2">
                        Kód
                    </div>
                    <div className="col-2">
                        Százalék
                    </div>
                    <div className="col-2">
                        Minimum ár
                    </div>
                    <div className="col-2">
                        Lejárati dátum
                    </div>
                    <div className="col-2">
                        Eddig felhasználva
                    </div>
                    <div className="col-2">

                    </div>
                </div>
                {coupons.map(coupon => (
                    <div className="row dashboardRow" key={coupon.id}>
                        <div className="col-2">
                            {coupon.code}
                        </div>
                        <div className="col-2">
                            {coupon.discount}%
                        </div>
                        <div className="col-2">
                            {coupon.minAmount} Ft
                        </div>
                        <div className="col-2">
                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Nincs'}
                        </div>
                        <div className="col-2">
                            {coupon.currentUsage}/{coupon.usageLimit}
                        </div>
                        <div className="col-2 d-flex justify-content-end dashboardButtons">
                            <ButtonGroup>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(coupon.code)}
                                >
                                    <FontAwesomeIcon icon={faTrash as IconProp} />
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}