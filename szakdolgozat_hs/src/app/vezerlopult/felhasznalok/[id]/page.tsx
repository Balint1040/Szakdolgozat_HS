'use client'

import ProductSwiper from "@/components/ProductSwiper"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
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
            setUser(data)
        }
        fetchUser()
    }, [id])

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="container productContainer">
                <div className="mb-2">
                    <a className='pointer' onClick={() => { router.back() }}>
                        <FontAwesomeIcon icon={faAnglesLeft as IconProp} /> Vissza
                    </a>
                </div>
            </div>
        </>
    )
}