'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"


export default function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {

            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                const result = await response.json()
                setMessage(result.error || 'Sikertelen bejelentkezés')
                return
            }
            router.push('/')
            router.refresh()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="loginWrap d-flex justify-content-center align-items-center py-4">
                        <div className="loginCard d-flex justify-content-center align-items-center">
                            <form onSubmit={handleSubmit}>
                                <h2 className="text-center mb-4">Bejelentkezés</h2>
                                <div className="mb-3">
                                    <label htmlFor="email">E-mail cím</label>
                                    <input
                                        type="email"
                                        id="email" required
                                        className="form-control"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="password">Jelszó</label>
                                    <input
                                        type="password"
                                        id="password" required
                                        className="form-control"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 px-2 d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="d-flex align-items-center">
                                        <input type="checkbox" id="rememberMe" />
                                        <label htmlFor="rememberMe" className="ps-1 mb-0">Emlékezz rám</label>
                                    </div>
                                    <a href="#" className="forgotPassword text-Blue">Elfelejtett jelszó?</a>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="orangeButton">Bejelentkezés</button>
                                    {message && <p>{message}</p>}
                                </div>
                                <div className="text-center mt-4">
                                    <span>Még nincs fiókja? <Link href="/regisztracio" className="text-Orange">Regisztrálok</Link></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}