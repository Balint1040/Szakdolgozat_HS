'use client'
import { Product } from "@/app/termekek/page"
import { useEffect, useState } from "react"

export interface User {
    id: number,
    email: string,
    password: string,
    role: string,
    name: string
}
export default function Page() {
    const [users, setUsers] = useState<User[]>([])
    
        useEffect(() => {
            async function fetchRecipes() {
                const data = await fetch(`/api/users`)
                const init = (await data.json()) as User[]
    
                setUsers([...init])
            }
    
            fetchRecipes()
        }, [])
    return (
        <div className="pe-4 position-relative">
            <div className="row dashboardRowHeader">
                <div className="col-1">
                    ID
                </div>
                <div className="col-4">
                    Név
                </div>
                <div className="col-4">
                    Email
                </div>
                <div className="col-3">
                    Role
                </div>
            </div>
            {users.map((user) => (
                <div className="row dashboardRow" key={user.id}>
                    <div className="col-1">
                        {user.id}
                    </div>
                    <div className="col-4">
                        {user.name}
                    </div>
                    <div className="col-4">
                        {user.email}
                    </div>
                    <div className="col-3">
                        {user.role}
                    </div>
                </div>
            ))}
        </div>
    )
}