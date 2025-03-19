import { NextResponse, NextRequest } from 'next/server'
//import { roleValidationMiddleware } from '@/middleware/roleValidationMiddleware'
import { pool } from '@/_lib/db'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {

    const token = req.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const [rows] = await (await pool).execute('SELECT id, name, email, role FROM user WHERE id = ?', [decoded.userId])


    const user = (rows as any[])[0]

    if (!user) {
      return NextResponse.json({ message: "Nem található felhasználó", status: 404 })
    }

    return NextResponse.json({
      name: user.name,
      email: user.email
    })

  } catch (e) {
    console.error(e)
    return NextResponse.json(e)
  }
}


export async function POST() {
  const res = NextResponse.json({ status: 200})
  res.cookies.delete('auth_token')
  
  return res
}

export async function PUT(req: NextRequest){

  try{
    const token = req.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ status: 401 })
    }

    const {name, email} = await req.json()
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId: number}

    if(name){
      if(name.length < 3 || name.length > 20){
        return NextResponse.json({
          message: "A névnek 3 és 20 karakter között kell legyen",
          status: 400
        })
      }
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-.']+$/
    if(!nameRegex.test(name)){
      return NextResponse.json({
        message: "Nem megfelelő névformátum",
        status: 400
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Érvénytelen email cím vagy helytelen formátum' }, { status: 400 })
    }

  
    await (await pool).execute(
      'UPDATE user SET name = ?, email = ? WHERE ID = ?', [name, email, decoded.userId]
    )
  
    return NextResponse.json({
      message: "Sikeres",
      status: 200,
      user: {name, email}
    })
  }catch(e){
    console.error(e)
  }
}