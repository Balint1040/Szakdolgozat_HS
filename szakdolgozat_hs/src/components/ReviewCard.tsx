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

    function timeAgo(createdAt: string) {
        const currentTime = new Date()
        const reviewTime = new Date(createdAt)
        const timeDifference = currentTime.getTime() - reviewTime.getTime()

        const seconds = Math.floor(timeDifference / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)

        if (seconds < 60) {
            return "Épp most"
        } else if (minutes < 60) {
            return `${minutes} perce`
        } else if (hours < 24) {
            return `${hours} órája`
        } else {
            return reviewTime.toLocaleDateString()
        }
    }


    return (
        <div className="reviewCard position-relative d-flex flex-column justify-content-center align-items-center py-5 p-3 p-sm-5" key={data.id}>
            <p className="text-center fs-3 text-break">"{data.text}"</p>
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
            <span className="reviewDate">{timeAgo(data.createdAt)}</span>
        </div>
    )
}