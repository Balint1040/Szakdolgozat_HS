'use client'
import { Product } from "@/app/termekek/page"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { Button, ButtonGroup } from "react-bootstrap"

export interface UserDashboard {
    id: number,
    email: string,
    role: "admin" | "guest" | string,
    name: string,
    profilePicture?: string
}
export default function Page() {
    const [users, setUsers] = useState<UserDashboard[]>([])

    useEffect(() => {
        async function fetchUsers() {
            const data = await fetch(`/api/users/admin`)
            const init = (await data.json()) as UserDashboard[]

            setUsers([...init])
        }

        fetchUsers()
    }, [])

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])


    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/users/admin`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify({ id })
            })

            if (res.ok) {
                setUsers(users.filter(user => user.id !== id))
                enqueueSnackbar('Felhasználó sikeresen törölve', { variant: "success", autoHideDuration: 2000 })
                const closeButton = document.querySelector(`#deleteModal${id} .btn-close`)
                closeButton?.dispatchEvent(new Event('click'))
            }
        } catch (e) {
            console.error(e)
            enqueueSnackbar('A felhasználót nem sikerült törölni', { variant: "error", autoHideDuration: 2000 })
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
                                data-bs-toggle="modal"
                                data-bs-target={`#deleteModal${user.id}`}
                            >
                                <FontAwesomeIcon icon={faTrash as IconProp} />
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div className="modal fade" id={`deleteModal${user.id}`} tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Felhasználó törlése</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    Biztosan törölni szeretnéd <strong>{user.name}</strong> felhasználót?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="blueButton" data-bs-dismiss="modal">Mégsem</button>
                                    <button type="button" className="orangeButton" onClick={() => handleDelete(user.id)}>Törlés</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}