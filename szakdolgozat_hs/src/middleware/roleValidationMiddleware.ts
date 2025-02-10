import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function roleValidationMiddleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Nincs' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    if (typeof decoded !== 'string' && decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 403 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Érvénytelen token' }, { status: 401 })
  }

  return null 
}