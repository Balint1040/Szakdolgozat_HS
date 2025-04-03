import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/_lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia'
})

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.metadata?.couponCode) {
      const couponCode = session.metadata.couponCode
        
        await (await pool).execute(
          `UPDATE coupon 
           SET currentUsage = currentUsage + 1
           WHERE code = ?`,
          [couponCode]
        )
      }
    
    return NextResponse.json({status: 200})
    
  } catch (e) {
    console.error(e)
    return NextResponse.json({message: e, status: 500})
  }
}