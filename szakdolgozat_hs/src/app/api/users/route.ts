import { NextResponse, NextRequest } from 'next/server'
import { pool } from '@/_lib/db'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {

    const token = req.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const [rows] = await (await pool).execute('SELECT id, name, email, role, profilePicture FROM user WHERE id = ?', [decoded.userId])


    const user = rows[0]

    return NextResponse.json({
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
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

    const {name, email, profilePicture} = await req.json()
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId: number}

    if(name){
      if(name.length < 3 || name.length > 20){
        return NextResponse.json({
          message: "A névnek 3 és 20 karakter között kell legyen",
          status: 400
        })
      }
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s\-.']+$/
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
      'UPDATE user SET name = ?, email = ?, profilePicture = ? WHERE ID = ?', [name, email, profilePicture, decoded.userId]
    )
  
    return NextResponse.json({
      message: "Sikeres",
      status: 200,
      user: {name, email, profilePicture}
    })
  }catch(e){
    console.error(e)
  }
}