import { pool } from "@/_lib/db"
import { NextRequest, NextResponse } from "next/server"
import Stripe from 'stripe'



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
      [1] 
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
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/kosar`,
    });

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error(error);
  }
}