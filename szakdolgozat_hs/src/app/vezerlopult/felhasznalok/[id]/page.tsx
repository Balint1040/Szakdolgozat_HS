'use client'

import ProductSwiper from "@/components/ProductSwiper"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import React, { useEffect, useState } from "react"


interface User {
    id: number,
    email: string,
    password: string,
    role: string,
    name: string
}

export default function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const router = useRouter()
    const { id } = React.use(params)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/users/${id}`, {
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                }
            })
            const data = await res.json()
            if (Array.isArray(data)) {
                setUser(data[0])
            }
        }
        fetchUser()
    }, [id])


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!user) return
        const newRole = e.target.value
        setUser({ ...user, role: newRole })
    }

    if (!user) {
        return <div>Loading...</div>
    }
    const handleSave = async () => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify({ role: user.role })
            })
    
            if(!res.ok) {
                enqueueSnackbar('Nem sikerült végrahajtani a folyamatot', {variant: "error"})
            }
    
            enqueueSnackbar('Sikeres módosítás', {variant: "success", autoHideDuration: 2000})
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <div className="container productContainer">
                <div className="mb-2">
                    <a className='pointer' onClick={() => { router.back() }}>
                        <FontAwesomeIcon icon={faAnglesLeft as IconProp} /> Vissza
                    </a>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h2>Felhasználó adatai</h2>
                        <div className="card mt-3">
                            <div className="card-body">
                                <p>Név: {user.name}</p>
                                <p>Email: {user.email}</p>
                            </div>
                            <div className="mb-3 px-3">
                                <label htmlFor="role" className="form-label"><strong>Szerepkör:</strong></label>
                                <select 
                                    id="role"
                                    className="form-select mb-3"
                                    value={user.role}
                                    onChange={handleChange}
                                    >
                                    <option value="guest">Guest</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button 
                                    className="btn btn-primary mb-3" 
                                    onClick={handleSave}
                                    >
                                    Mentés
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}