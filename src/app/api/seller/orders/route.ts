import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sellerId = searchParams.get('sellerId')

  if (!sellerId) {
    return NextResponse.json({ error: 'ไม่มี sellerId' }, { status: 400 })
  }

  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch orders error:', error)
    return NextResponse.json({ orders: [] })
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ orders: [] })
  }

  // ดึงข้อมูล mod และ buyer แยก ไม่ join ตรง
  const modIds   = [...new Set(orders.map(o => o.mod_id))]
  const buyerIds = [...new Set(orders.map(o => o.buyer_id))]

  const { data: mods } = await supabaseAdmin
    .from('mods')
    .select('id, title, thumbnail_url')
    .in('id', modIds)

  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, display_name')
    .in('id', buyerIds)

  const modMap     = new Map(mods?.map(m => [m.id, m]) || [])
  const profileMap = new Map(profiles?.map(p => [p.id, p.display_name]) || [])

  const result = orders.map(o => ({
    ...o,
    mods:     modMap.get(o.mod_id) || null,
    profiles: { display_name: profileMap.get(o.buyer_id) || 'Unknown' },
  }))

  return NextResponse.json({ orders: result })
}