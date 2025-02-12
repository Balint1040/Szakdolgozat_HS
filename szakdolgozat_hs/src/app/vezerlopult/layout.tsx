'use client'
import Link from "next/link"
import { usePathname } from "next/navigation";


export default function DashBoardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const activeTab = usePathname()
    return (
        <>
            <div className="row">
                <div className="col-2">
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
                    </ul>
                </div>
                </div>
                <div className="col-10 p-3">
                    {children}
                </div>
            </div>
        </>
    );
}