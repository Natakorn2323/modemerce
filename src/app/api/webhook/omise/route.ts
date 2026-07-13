import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Omise webhook:', body.key)

    // Omise ส่ง event มาหลายแบบ เราสนใจ charge.complete
    if (body.key === 'charge.complete' && body.data?.status === 'successful') {
      const chargeId = body.data.id
      const orderId  = body.data.metadata?.orderId

      if (!orderId) {
        return NextResponse.json({ received: true })
      }

      const { data: order } = await supabaseAdmin
        .from('orders')
        .update({
          status:  'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select('mod_id')
        .single()

      if (order?.mod_id) {
        await supabaseAdmin.rpc('increment_downloads', {
          mod_id: order.mod_id,
        })
      }
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}