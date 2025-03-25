'use client'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { enqueueSnackbar } from 'notistack'
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
                setNewCoupon({
                    code: "",
                    discount: 1,
                    minAmount: 0,
                    expiryDate: "",
                    usageLimit: 1
                })
                fetchCoupons()
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])


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
                enqueueSnackbar("Kupon törölve", { variant: "success", autoHideDuration: 2000 })
                const closeButton = document.querySelector(`#deleteModal${code} .btn-close`)
                closeButton?.dispatchEvent(new Event('click'))
            }
        } catch (e) {
            console.error(e)
            enqueueSnackbar("Kupon törlése sikertelen", { variant: "error", autoHideDuration: 2000 })
        }
    }

    return (
        <>
            <div className="container-fluid position-relative px-0 couponsContainer">
                <form onSubmit={handleSubmit} className="card mb-4 p-3">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-lg-4 col-xxl-2 mt-2 mt-xxl-0">
                            <label className="form-label">Kuponkód</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newCoupon.code}
                                onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4 col-xxl-2 mt-2 mt-xxl-0">
                            <label className="form-label">Kedvezmény (%)</label>
                            <input
                                type="number"
                                className="form-control"
                                min="1"
                                max="100"
                                onChange={e => setNewCoupon({ ...newCoupon, discount: parseInt(e.target.value) })}
                                value={isNaN(newCoupon.discount) ? "" : newCoupon.discount}
                                required
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4 col-xxl-2 mt-2 mt-xxl-0">
                            <label className="form-label">Minimum összeg</label>
                            <input
                                type="number"
                                className="form-control"
                                min="0"
                                value={isNaN(newCoupon.minAmount) ? "" : newCoupon.minAmount}
                                onChange={e => setNewCoupon({ ...newCoupon, minAmount: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4 col-xxl-2 mt-2 mt-xxl-0">
                            <label className='form-label'>Lejárati dátum</label>
                            <input
                                type="date"
                                value={newCoupon.expiryDate}
                                className='form-control inputDate'
                                onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4 col-xxl-2 mt-2 mt-xxl-0">
                            <label className="form-label">Felhasználási limit</label>
                            <input
                                type="number"
                                className="form-control"
                                value={isNaN(newCoupon.usageLimit) ? "" : newCoupon.usageLimit}
                                onChange={e => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4 col-xxl-2 d-flex align-items-end mt-2 mt-xxl-0">
                            <button type="submit" className="orangeButton add">
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
                                    data-bs-toggle="modal"
                                    data-bs-target={`#deleteModal${coupon.code}`}
                                >
                                    <FontAwesomeIcon icon={faTrash as IconProp} />
                                </Button>
                            </ButtonGroup>
                        </div>
                        <div className="modal fade" id={`deleteModal${coupon.code}`} tabIndex={-1} aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Kupon törlése</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        Biztosan törölni szeretnéd <strong>{coupon.code}</strong> kódot?
                                    </div>
                                    <div className="modal-footer">
                                        <button type='button' className='blueButton' data-bs-dismiss="modal">Mégsem</button>
                                        <button type='button' className='orangeButton' onClick={() => handleDelete(coupon.code)}>Törlés</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}