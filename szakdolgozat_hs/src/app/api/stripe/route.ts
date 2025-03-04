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
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
})

export async function POST(req: NextRequest) {
  try {

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
        p.price
       FROM cart c 
       JOIN cartItem ci ON c.id = ci.cartId
       JOIN product p ON ci.productId = p.id
       WHERE c.userId = ?`,
      [decoded.userId] 
    )

    const cartItems = rows as CartItem[]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'HUF',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100)
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/sikeres?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/kosar`,
    })


    console.log('uj session sikeres:', {
      sessionId: session.id,
      amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      items: cartItems
    })


    return NextResponse.json({ sessionId: session.id })
  } catch (e) {
    console.error(e);
  }
}


export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ status: 401 })
    }

    const payments = await stripe.paymentIntents.list({
      limit: 100000,
    });

    console.log('History:', payments.data)

    return NextResponse.json({ 
      status: 200,
      payments: payments.data.map(payment => ({
        id: payment.id,
        amount: payment.amount / 100,
        status: payment.status,
        created: new Date(payment.created * 1000),
        currency: payment.currency
      }))
    })

  } catch (e) {
    console.error(e)
  }
}