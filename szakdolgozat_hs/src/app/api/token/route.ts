import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { jwtVerify } from 'jose'

export async function POST(request: Request) {
    try {
        const token = request.headers.get('auth_token')?.split(' ')[1]
        
        if (!token) {
            return NextResponse.json({ error: 'nem vagy bejelentkezve' }, { status: 401 })
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)

        const newToken = await new SignJWT({ 
            userId: payload.userId,
            role: payload.role 
            })
            .setExpirationTime('1d')
            .sign(secret)

        return NextResponse.json({ token: newToken })
    } catch (e) {
        console.error(e)
    }
}