'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
export default function Page() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [rememberMe, setRememberMe] = useState(false)


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name, email, password, rememberMe
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Hiba:', errorData)
                setMessage(errorData.error || 'Sikertelen regisztráció')
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
                                        <input 
                                            type="checkbox" 
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label htmlFor="rememberMe" className="ps-1 mb-0">
                                            Emlékezz rám
                                        </label>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="orangeButton">Regisztráció</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}