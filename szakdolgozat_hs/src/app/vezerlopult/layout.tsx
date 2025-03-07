'use client'
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";

export default function DashBoardLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
                router.push('/')
                router.refresh()
            }
        } catch (e) {
            console.error(e)
        }
    }
    

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2 p-0">
                        <div className="d-flex flex-column py-3 dashboardButtonWrap">
                            <ul className="nav nav-pills flex-column mb-auto">
                                <li className="nav-item">
                                    <Link
                                        href="/vezerlopult/profil"
                                        className={`nav-link ${activeTab === '/vezerlopult/profil' ? 'active' : ''}`}
                                    >
                                        Profil
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/vezerlopult/termekek"
                                        className={`nav-link ${activeTab === '/vezerlopult/termekek' ? 'active' : ''}`}
                                    >
                                        Termékek
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/vezerlopult/felhasznalok"
                                        className={`nav-link ${activeTab === '/vezerlopult/felhasznalok' ? 'active' : ''}`}
                                    >
                                        Felhasználók
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/vezerlopult/megrendelesek"
                                        className={`nav-link ${activeTab === '/vezerlopult/megrendelesek' ? 'active' : ''}`}
                                    >
                                        Megrendelések
                                    </Link>
                                </li>
                                <li>
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
                                        <FontAwesomeIcon icon={faArrowRightFromBracket as IconProp} />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-10 p-3">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}