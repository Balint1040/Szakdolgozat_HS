'use client'

import Link from "next/link"
import React, { useState } from "react"


export default function Page() {
    const [message, setMessage] = useState('')

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const name  = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })

        const result = await response.json()
        setMessage(result.message)
    }

    

    return (
        <>
            <div className="loginWrap d-flex justify-content-center align-items-center my-5">
                <div className="loginCard d-flex justify-content-center align-items-center">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center mb-4">Bejelentkezés</h2>
                        <div className="mb-3">
                            <label htmlFor="email">Felhasználónév</label>
                            <input 
                            type="name" 
                            id="name" required 
                            
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">E-mail cím</label>
                            <input 
                            type="email" 
                            id="email" required 
                            
                            />
                        </div>
                        <div className="mb-1">
                            <label htmlFor="password">Jelszó</label>
                            <input 
                            type="password" 
                            id="password" required 
                            
                            />
                        </div>
                        <div className="mb-3 px-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <input type="checkbox" id="rememberMe" />
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
                        {message && <div className="alert alert-info">{message}</div>}
                    </form>
                </div>
            </div>
        </>
    )
}