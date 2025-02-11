import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function roleValidationMiddleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value


  if(token === undefined){
    return NextResponse.redirect(new URL('/bejelentkezes', request.url))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    if (typeof decoded !== 'string' && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/bejelentkezes', request.url))
    }
  } catch (error) {
    return NextResponse.json({ error: 'Érvénytelen token' }, { status: 401 })
  }

  return null 
}