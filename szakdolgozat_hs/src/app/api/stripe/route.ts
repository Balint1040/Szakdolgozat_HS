import { pool } from "@/_lib/db"
import { NextRequest, NextResponse } from "next/server"
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'



interface CartItem {
  id: number
  cartId: number
  quantity: number
  name: string
  price: number
  url: string
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
})

export async function POST(req: NextRequest) {
  try {
    const {coupon} = await req.json()

    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ status: 401 })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

    const [rows] = await (await pool).execute(
      `SELECT 
        ci.id,
        ci.cartId,
        ci.quantity,
        p.name,
        p.price,
        MIN(i.url) as url
       FROM cart c 
       JOIN cartItem ci ON c.id = ci.cartId
       JOIN product p ON ci.productId = p.id
       LEFT JOIN imageurl i ON p.id = i.productId
       WHERE c.userId = ?
       GROUP BY ci.id, ci.cartId, ci.quantity, p.name, p.price`,
      [decoded.userId] 
    )

    const cartItems = rows as CartItem[]

    const calculateDiscountedPrice = (price: number) => {
      if (coupon) {
        return Math.round(Number(price) * (1 - coupon.discount / 100) * 100)
      }
      return Math.round(Number(price) * 100)
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'HUF',
          product_data: {
            name: item.name,
            images: [item.url]
          },
          unit_amount: calculateDiscountedPrice(item.price)
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/sikeres?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/kosar`,
      metadata:{
        userId: decoded.userId.toString()
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (e) {
    console.error(e)
  }
}


export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

    const sessions = await stripe.checkout.sessions.list({
      limit: 10000,
      expand: ['data.line_items']
    })

    const userSessions = sessions.data.filter(session => 
      session.metadata && session.metadata.userId === decoded.userId.toString()
    )

    return NextResponse.json({ 
      status: 200,
      orders: userSessions.map(session => ({
        id: session.id,
        amount: session.amount_total !== null ? session.amount_total / 100 : null,
        status: session.payment_status,
        created: new Date(session.created * 1000),
        currency: session.currency,
        items: session.line_items?.data.map(item => {
          return {
            name: item.description,
            quantity: item.quantity
          }
        })
      }))
    })

  } catch (e) {
    console.error(e)
  }
}