'use client'
import { Product } from "@/app/termekek/page"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Button, ButtonGroup } from "react-bootstrap"

export interface User {
    id: number,
    email: string,
    password: string,
    role: "admin" | "guest",
    name: string
}
export default function Page() {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        async function fetchUsers() {
            const data = await fetch(`/api/users/admin`)
            const init = (await data.json()) as User[]

            setUsers([...init])
        }

        fetchUsers()
    }, [])

    const handleDelete = async (id: number) => {
        if (confirm("Biztosan törölni szeretnéd ezt a terméket?")) {
            await fetch(`/api/users/admin`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify({ id })
            })
            setUsers(users.filter(users => users.id !== id))
            alert("Termék törölve!")
        }
    }
    return (
        <div className="container-fluid position-relative px-0">
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
                    <div className="col-2">
                        {user.role}
                    </div>
                    <div className="col-1 d-flex justify-content-end dashboardButtons">
                        <ButtonGroup>
                            <Button
                                variant="warning"
                                href={`/vezerlopult/felhasznalok/${user.id}`}
                            >
                                <FontAwesomeIcon icon={faPen as IconProp} />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleDelete(user.id)}
                            >
                                <FontAwesomeIcon icon={faTrash as IconProp} />
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            ))}
        </div>
    )
}