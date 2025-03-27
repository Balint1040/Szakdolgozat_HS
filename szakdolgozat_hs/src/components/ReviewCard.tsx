"use client"

import { UserDashboard } from "@/app/vezerlopult/felhasznalok/page"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faStar, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"

type Star = 1|2|3|4|5
export interface IReviewCard {
    id: number
    name: string,
    text: string,
    rating: Star,
    createdAt: string
    userId: number
}

export default function ReviewCard({
    data
} : {
    data: IReviewCard
}) {

    const [user, setUser] = useState<UserDashboard | null>(null)
    
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/users/${data.userId}`, {
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                }
            })
            const userData = await res.json()
            if (Array.isArray(userData)) {
                setUser(userData[0])
            }
        }
        fetchUser()
    }, [])


    return (
        <div className="reviewCard position-relative d-flex flex-column justify-content-center align-items-center p-5" key={data.id}>
            <p className="text-center fs-3">"{data.text}"</p>
            <span>
                {[...Array(data.rating).keys()].map((i = 1) => (
                    <FontAwesomeIcon icon={faStar as IconProp}  key={"star-" + i++}/>
                ))}
            </span>
            <div className="d-flex align-items-center mt-3">
                <div className="reviewPfp">
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="navbarPfp" />
                    ) : (
                        <FontAwesomeIcon icon={faUser as IconProp} />
                    )}
                </div>
                <span className="ms-3 fs-4 text-Orange">- {data.name}</span>
            </div>
            <span className="reviewDate">{data.createdAt}</span>
        </div>
    )
}