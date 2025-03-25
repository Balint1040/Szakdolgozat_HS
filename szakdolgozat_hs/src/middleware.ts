import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"


export async function middleware(req: NextRequest) {
    const protectedRoutes = [
        "/vezerlopult",
        "/kosar"
    ]

    const path = req.nextUrl.pathname
    const token = req.cookies.get('auth_token')?.value

    if (token && (path === "/regisztracio" || path === "/bejelentkezes")) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    if (path.startsWith("/vezerlopult/termekek") || path.startsWith("/vezerlopult/felhasznalok") || path.startsWith("/vezerlopult/kuponok") || path.startsWith("/vezerlopult/megrendelesek")) {
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url))
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role?: string }
            
            if (!decoded || decoded.role !== 'admin') {
                return NextResponse.redirect(new URL("/", req.url))
            }
        } catch (error) {
            console.error('Token verification failed:', error)
            return NextResponse.redirect(new URL("/", req.url))
        }

    }

    const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith("/vezerlopult") || path.startsWith("/kosar")

    if (isProtectedRoute) {
        const token = req.cookies.get('auth_token')?.value

        if (!token) {
            return NextResponse.redirect(new URL("/", req.url))
        }

        if (!process.env.JWT_SECRET) {
            return NextResponse.redirect(new URL("/", req.url))
        }

        try {
            const reqHeaders = new Headers(req.headers)

            return NextResponse.next({
                headers: reqHeaders
            })

        } catch (e) {
            console.error(e)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/vezerlopult/:path*",
        "/kosar/:path*",
        "/regisztracio",
        "/bejelentkezes"
    ]
}