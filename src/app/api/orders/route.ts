import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { modId, sellerId, amount, buyerId } = await req.json()

    if (!modId || !buyerId) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบ' }, { status: 400 })
    }

    // เช็คว่าซื้อไปแล้วหรือยัง
    const { data: existing } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('mod_id', modId)
      .eq('buyer_id', buyerId)
      .eq('status', 'paid')
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'คุณซื้อ Mod นี้ไปแล้ว' },
        { status: 409 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        mod_id:    modId,
        seller_id: sellerId,
        buyer_id:  buyerId,
        amount:    amount || 0,
        status:    'pending',
      })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orderId: data.id }, { status: 201 })

  } catch {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}