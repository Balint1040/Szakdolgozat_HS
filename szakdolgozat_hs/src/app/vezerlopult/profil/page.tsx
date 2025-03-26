'use client'

import Cart from "@/components/Cart";
import Payment from "@/components/Payment";
import ProfileProductHistory from "@/components/ProfileProductHistory";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { PaymentInfo } from "../megrendelesek/page";

interface Payment {
    id: string
    amount: number
    status: string
    created: Date
    currencry: string
}

export interface User {
    name: string
    email: string
    profilePicture?: string
}

export default function Page() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newProfilePicture, setNewProfilePicture] = useState('')

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
            }else{
                enqueueSnackbar('Nem megfelelő email cím formátum', {variant: "error"} )
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleProfilePicSubmit = async() => {
        try{
            const res = await fetch("/api/users", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                credentials: "include",
                body: JSON.stringify({
                    name: user?.name,
                    email: user?.email,
                    profilePicture: newProfilePicture
                })
            })
            const data = await res.json()
            if(data.status == 200){
                setUser(data.user)
                enqueueSnackbar('Profilkép sikeresen módosítva', {variant: 'success', autoHideDuration: 2000})
            }
        }catch(e){
            console.error(e)
            enqueueSnackbar("Nem sikerült a profilkép módosítása", {variant: 'error', autoHideDuration: 2000})
        }
    }

    return (
        <>
            <div className="row profileRow py-3">
                <div className="col-12 col-xl-5 col-xxl-4">
                    <div className="d-flex flex-column justify-content-center align-items-center w-100">
                        <div className="dashboardProfilKepWrap mb-3" data-bs-toggle="modal" data-bs-target="#profilePicModal">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="dashboardPfp" />
                            ) : (
                                <FontAwesomeIcon icon={faUser as IconProp} />
                            )}
                        </div>
                        <a className="editText" data-bs-toggle="modal" data-bs-target="#nameModal">
                            <h1>{user ? user.name : 'Betöltés...'}</h1>
                        </a>
                        <a className="editText" data-bs-toggle="modal" data-bs-target="#emailModal">
                            <h5>{user ? user.email : 'Betöltés...'}</h5>
                        </a>
                    </div>
                </div>
                <div className="col-12 col-xl-7 col-xxl-8 mt-5 mt-xl-0">
                    <h3>Korábbi rendelések</h3>
                    <hr />
                    {payments.length == 0 ?(
                        <p>Még nincs fizetési előzmény</p>
                    ) : (
                        <div>
                            {payments.map((payment) => (
                                <Payment payment={payment as PaymentInfo} key={payment.id} />
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
                                <button type="button" className="orangeButton" data-bs-dismiss="modal"onClick={handleNameSubmit}>Mentés</button>
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
                <div className="modal fade" id="profilePicModal" tabIndex={-1} aria-labelledby="profilePicModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Profilkép szerkesztése</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <label htmlFor="profilePic" className="form-label">Profilkép (url)</label>
                                    <input 
                                        type="text" 
                                        id="profilePic" 
                                        className="form-control"
                                        value={newProfilePicture}
                                        onChange={(e => setNewProfilePicture(e.target.value))}
                                        />
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="blueButton" data-bs-dismiss="modal">Mégse</button>
                                <button type="button" className="orangeButton" data-bs-dismiss="modal" onClick={handleProfilePicSubmit}>Mentés</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}