import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json({ order: null }, { status: 400 })
  }

  const { data } = await supabaseAdmin
    .from('orders')
    .select('*, mods(id, title, thumbnail_url, game, category, description, install_guide, mod_file_url)')
    .eq('id', orderId)
    .eq('status', 'paid')
    .single()

  if (!data) {
    return NextResponse.json({ order: null }, { status: 404 })
  }

  // ใช้ snapshot ถ้า mod ถูกลบ
  const order = {
    ...data,
    mods: data.mods || data.mod_snapshot || null,
  }

  return NextResponse.json({ order })
}