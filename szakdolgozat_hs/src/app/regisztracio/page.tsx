'use client'

import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
export default function Page() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if(!name){
            enqueueSnackbar("A név megadása kötelező", {variant: 'error', autoHideDuration: 2000})
            return
        }

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
        if(password.length < 6){
            enqueueSnackbar("A jelszónak legalább 6 karakter hosszúnak kell lennie", {variant: 'error', autoHideDuration: 2000})
            return
        }

        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name, email, password, rememberMe
                }),
            })

            if(res.ok){
                enqueueSnackbar('Sikeres regisztráció! Átirányítás...', {variant: "success", autoHideDuration: 2000}) 
                setTimeout(()=> {
                    router.push('/')
                    router.refresh()
                }, 1500)
            }


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
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email">E-mail cím</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password">Jelszó</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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