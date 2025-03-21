'use client'

import Cart from "@/components/Cart";
import ProfileProductHistory from "@/components/ProfileProductHistory";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

interface Payment {
    id: string
    amount: number
    status: string
    created: Date
    currencry: string
}

interface User {
    name: string
    email: string
}

export default function Page() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])


    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const res = await fetch('/api/stripe', {
                    headers: {
                        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                    },
                    credentials: "include"
                })
                const data = await res.json()
                if (data.status === 200) {
                    setPayments(data.orders)
                }
            } catch (e) {
                console.error(e)
            }
        }

        fetchPaymentHistory()
    }, [])

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

    const handleNameSubmit = async () => {
        try {
            const res = await fetch("/api/users", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                credentials: "include",
                body: JSON.stringify({ name: newName, email: user?.email })
            })
            const data = await res.json()
            if (data.status === 200) {
                setUser(data.user)
                enqueueSnackbar('Név sikeresen módosítva', { variant: 'success', autoHideDuration: 2000 })
                const closeButton = document.querySelector('#nameModal .btn-close')
                closeButton?.dispatchEvent(new Event('click'))
            }else{
                enqueueSnackbar('A névnek minimum 3 karakterből kell állnia', {variant: "error", autoHideDuration: 2000})
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleEmailSubmit = async () => {
        try {
            const res = await fetch("/api/users", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                credentials: "include",
                body: JSON.stringify({ name: user?.name, email: newEmail })
            })
            const data = await res.json()
            if (data.status === 200) {
                setUser(data.user)
                enqueueSnackbar('Email cím sikeresen módosítva', {variant: 'success', autoHideDuration: 2000})
                const closeButton = document.querySelector('#emailModal .btn-close')
                closeButton?.dispatchEvent(new Event('click'))
            }else{
                enqueueSnackbar('Nem megfelelő email cím formátum', {variant: "error"} )
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <div className="row profileRow py-3">
                <div className="col-4">
                    <div className="d-flex flex-column justify-content-center align-items-center w-100">
                        <div className="dashboardProfilKepWrap mb-3">
                            <FontAwesomeIcon icon={faUser as IconProp} />
                        </div>
                        <a className="editText" data-bs-toggle="modal" data-bs-target="#nameModal">
                            <h1>{user ? user.name : 'Betöltés...'}</h1>
                        </a>
                        <a className="editText" data-bs-toggle="modal" data-bs-target="#emailModal">
                            <h5>{user ? user.email : 'Betöltés...'}</h5>
                        </a>
                    </div>
                </div>
                <div className="col-8">
                    <h3>Korábbi rendelések</h3>
                    <hr />
                    {payments.length == 0 ?(
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal fade" id="nameModal" tabIndex={-1} aria-labelledby="nameModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Név szerkesztése</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                
                                <form action="">
                                    <label htmlFor="profileName" className="form-label">Név</label>
                                    <input 
                                        type="text" 
                                        id="profileName" 
                                        className="form-control"
                                        value={newName}
                                        onChange={(e => setNewName(e.target.value))}
                                        />
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="blueButton" data-bs-dismiss="modal">Mégse</button>
                                <button type="button" className="orangeButton" onClick={handleNameSubmit}>Mentés</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="emailModal" tabIndex={-1} aria-labelledby="emailModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Email szerkesztése</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <label htmlFor="profileEmail" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        id="profileEmail" 
                                        className="form-control"
                                        value={newEmail}
                                        onChange={(e => setNewEmail(e.target.value))}
                                        />
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="blueButton" data-bs-dismiss="modal">Mégse</button>
                                <button type="button" className="orangeButton" onClick={handleEmailSubmit}>Mentés</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}