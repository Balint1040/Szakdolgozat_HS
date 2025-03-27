import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from 'jose'

async function isTokenValid(token: string){
    try{
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const {payload} = await jwtVerify(token, secret)
        
        const tokenExp = payload.exp as number
        const now = Math.floor(Date.now() / 1000)

        return tokenExp - now < 6 * 24 * 60 * 60
    }catch{
        return false
    }
}


async function tokenExtend(currentToken: string): Promise<string | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
            },
        })

        const data = await response.json()
        return data.token
    } catch {
        return null
    }
}

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

    if (token) {
        try {
            if (await isTokenValid(token)) {
                const newToken = await tokenExtend(token)
                if (newToken) {
                    const response = NextResponse.next()
                    response.cookies.set('auth_token', newToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 7 * 24 * 60 * 60 
                    })
                    return response
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (path.startsWith("/vezerlopult/termekek") || path.startsWith("/vezerlopult/felhasznalok") || path.startsWith("/vezerlopult/kuponok") || path.startsWith("/vezerlopult/megrendelesek")) {
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url))
        }
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET)
            const { payload } = await jwtVerify(token, secret)
            
            if (!payload || payload.role !== 'admin') {
                return NextResponse.redirect(new URL("/", req.url))
            }
        } catch (error) {
            console.error('Hiba:', error)
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