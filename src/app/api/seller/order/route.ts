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

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      mods(title, thumbnail_url),
      buyer:buyer_id(display_name)
    `)
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders: data })
}