'use client'

import { useState } from "react"
import bcrypt from 'bcryptjs'

export default function Page() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const hashedPassword = await bcrypt.hash(password, 10)
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password: hashedPassword }),
            })

            if (res.ok) {
                const data = await res.json()
                setMessage(data.message)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <div className="loginWrap d-flex justify-content-center align-items-center">
                <div className="loginCard d-flex justify-content-center align-items-center">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center mb-4">Regisztráció</h2>
                        <div className="mb-3">
                            <label htmlFor="name">Név</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">E-mail cím</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">Jelszó</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="mb-3 px-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <input type="checkbox" id="rememberMe"/>
                                <label htmlFor="rememberMe" className="ps-1 mb-0">Emlékezz rám</label>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="orangeButton">Regisztráció</button>
                        </div>
                        {message && <p className="mt-5 text-danger">{message}</p>}
                    </form>
                </div>
            </div>
        </>
    )
}