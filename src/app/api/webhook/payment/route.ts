import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Webhook received:', body)

    // รับข้อมูลจากธนาคาร/payment gateway
    const { orderId, status, amount, ref } = body

    if (!orderId) {
      return NextResponse.json({ error: 'ไม่มี orderId' }, { status: 400 })
    }

    if (status === 'success' || status === 'paid') {
      // อัปเดต order เป็น paid
      const { error } = await supabaseAdmin
        .from('orders')
        .update({
          status:      'paid',
          paid_at:     new Date().toISOString(),
          payment_ref: ref || null,
        })
        .eq('id', orderId)

      if (error) {
        console.error('Update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // เพิ่ม download count
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('mod_id')
        .eq('id', orderId)
        .single()

      if (order?.mod_id) {
        await supabaseAdmin.rpc('increment_downloads', {
          mod_id: order.mod_id
        })
      }
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}