'use client'
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowRightFromBracket, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import jwt from 'jsonwebtoken'
import { NextRequest } from "next/server";
import RoleValidation from "@/components/RoleValidation";
import { useEffect, useState } from "react";

export default function DashBoardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [role, setRole] = useState('')
    const activeTab = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                credentials: 'include'
            })
    
            if (res.ok) {
                enqueueSnackbar('Sikeres kijelentkezés', {variant: 'success', autoHideDuration: 2000})
                router.push('/')
                router.refresh()
            }
        } catch (e) {
            console.error(e)
        }
    }


    function handleSideBarCollapse() {
        document.getElementById("dashboardButtonWrap")?.classList.toggle("open") 
        document.getElementById("dashboardButtonToggle")?.classList.toggle("open") 
    }

    return (
        <>
            

            <div className="container-fluid position-relative">
                <div className="row">
                    <div className="col-0 col-lg-2 p-0">
                        <div className="d-flex flex-column py-3 dashboardButtonWrap" id="dashboardButtonWrap">
                            <ul className="nav nav-pills flex-column mb-auto">
                                <li>
                                    <Link
                                        href="/vezerlopult/profil"
                                        className={`nav-link ${activeTab === '/vezerlopult/profil' ? 'active' : ''}`}
                                    >
                                        Profil
                                    </Link>
                                </li>
                                <li className="valid">
                                    <Link
                                        href="/vezerlopult/termekek"
                                        className={`nav-link ${activeTab === '/vezerlopult/termekek' ? 'active' : ''}`}
                                    >
                                        Termékek
                                    </Link>
                                </li>
                                <li className="valid">
                                    <Link
                                        href="/vezerlopult/felhasznalok"
                                        className={`nav-link ${activeTab === '/vezerlopult/felhasznalok' ? 'active' : ''}`}
                                    >
                                        Felhasználók
                                    </Link>
                                </li>
                                <li className="valid">
                                    <Link
                                        href="/vezerlopult/megrendelesek"
                                        className={`nav-link ${activeTab === '/vezerlopult/megrendelesek' ? 'active' : ''}`}
                                    >
                                        Megrendelések
                                    </Link>
                                </li>
                                <li className="valid">
                                    <Link
                                        href="/vezerlopult/kuponok"
                                        className={`nav-link ${activeTab === '/vezerlopult/kuponok' ? 'active' : ''}`}
                                    >
                                        Kuponok
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/"
                                        className={`nav-link logout`}
                                        onClick={handleLogout}
                                    >
                                        Kijelentkezés
                                        <FontAwesomeIcon icon={faArrowRightFromBracket as IconProp} style={{fontSize: '15px'}}/>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-lg-10 p-3">
                        <a 
                            className="dashboardButtonToggle" 
                            id="dashboardButtonToggle"
                            onClick={handleSideBarCollapse}
                        >
                            <FontAwesomeIcon icon={faBars as IconProp} className="bashboardOpen" />
                            <FontAwesomeIcon icon={faXmark as IconProp} className="bashboardClose" />
                        </a>
                        <div id="dashboardButtonToggleMask" onClick={handleSideBarCollapse}></div>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}