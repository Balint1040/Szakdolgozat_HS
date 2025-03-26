'use client'

import Loading from "@/components/Loading"
import ProductSwiper from "@/components/ProductSwiper"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faAnglesLeft, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import React, { useEffect, useState } from "react"
import { UserDashboard } from "../page"
import { User } from "../../profil/page"

export default function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const router = useRouter()
    const { id } = React.use(params)
    const [user, setUser] = useState<UserDashboard | null>(null)

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
        return <Loading />
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

            if (!res.ok) {
                enqueueSnackbar('Nem sikerült végrahajtani a folyamatot', { variant: "error" })
            }

            enqueueSnackbar('Sikeres módosítás', { variant: "success", autoHideDuration: 2000 })
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <div className="container productContainer">
                <div className="mb-2">
                    <a className='pointer' onClick={() => { router.push('/vezerlopult/felhasznalok') }}>
                        <FontAwesomeIcon icon={faAnglesLeft as IconProp} /> Vissza
                    </a>
                </div>
                <div className="row orderHistoryRow fs-5">
                    <h2>Felhasználó adatai</h2>
                    <hr />
                    <div className="col-12 col-md-6 col-lg-5 col-xxl-3 d-flex justify-content-center justify-content-md-start">
                        <div className="usersProfilePicWrap mb-3">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="usersProfilePic" />
                            ) : (
                                <FontAwesomeIcon icon={faUser as IconProp} />
                            )}
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-7 col-xxl-9 d-flex align-items-center">
                        <div className="row">
                            <div className="col-12">
                                <div>Név: <span className="text-break">{user.name}</span></div>
                            </div>
                            <div className="col-12">
                                <div>Email: <span className="text-break">{user.email}</span></div>
                            </div>
                            <div className="col-12">
                                <label htmlFor="role" className="form-label">Szerepkör:</label>
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
                                    className="orangeButton"
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