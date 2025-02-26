import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const protectedRoutes = [
        "/vezerlopult",
        "/kosar"
    ]

    if (protectedRoutes) {
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
        "/kosar/:path*"
    ]
}