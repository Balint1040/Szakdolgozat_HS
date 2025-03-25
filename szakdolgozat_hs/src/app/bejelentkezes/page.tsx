'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import React, { useState } from "react"


export default function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email) {
            enqueueSnackbar("Az email cím megadása kötelező", { variant: 'error', autoHideDuration: 2000 })
            return
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            enqueueSnackbar("Érvénytelen email formátum", { variant: 'error', autoHideDuration: 2000 })
            return
        }
        
        if (!password) {
            enqueueSnackbar("A jelszó megadása kötelező!", { variant: 'error', autoHideDuration: 2000 })
            return
        }

        try {

            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, rememberMe})
            })

            const data = await res.json()

            if (!res.ok || data.status == 401) {
                enqueueSnackbar("Helytelen email vagy jelszó", { variant: 'error', autoHideDuration: 2000 })
                return
            }

            enqueueSnackbar("Sikeres bejelentkezés! Átirányítás...", { variant: 'success', autoHideDuration: 2000})
            setTimeout(()=> {
                router.push('/')
                router.refresh()
            }, 1500)
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
                                        id="email"
                                        className="form-control"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="password">Jelszó</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 px-2 d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="d-flex align-items-center">
                                        <input 
                                        type="checkbox" 
                                        id="rememberMe" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label htmlFor="rememberMe" className="ps-1 mb-0">Emlékezz rám</label>
                                    </div>
                                    <a href="#" className="forgotPassword text-Blue">Elfelejtett jelszó?</a>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="orangeButton">Bejelentkezés</button>
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