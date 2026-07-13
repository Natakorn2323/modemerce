import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculateFee, PaymentMethod } from '@/lib/fees'

const Omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { orderId, amount, method } = await req.json() as {
      orderId: string
      amount: number
      method: PaymentMethod
    }

    if (!orderId || !amount || !method) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบ' }, { status: 400 })
    }

    const fee = calculateFee(amount, method)

    // สร้าง source (PromptPay)
    const source = await Omise.sources.create({
      type:     'promptpay',
      amount:   Math.round(amount * 100), // หน่วยเป็นสตางค์
      currency: 'thb',
    })

    // สร้าง charge
    const charge = await Omise.charges.create({
      amount:   Math.round(amount * 100),
      currency: 'thb',
      source:   source.id,
      metadata: { orderId },
    })

    // บันทึกข้อมูล fee ลง order
    await supabaseAdmin
      .from('orders')
      .update({
        payment_method:   fee.label,
        platform_fee:     fee.platformFee,
        seller_payout:    fee.sellerPayout,
        omise_charge_id:  charge.id,
      })
      .eq('id', orderId)

    return NextResponse.json({
      chargeId:     charge.id,
      qrCodeUri:    charge.source?.scannable_code?.image?.download_uri || null,
      fee,
    })

  } catch (err: any) {
    console.error('Omise error:', err)
    return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}