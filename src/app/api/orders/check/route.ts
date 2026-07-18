import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const modId   = searchParams.get('modId')
  const buyerId = searchParams.get('buyerId')

  if (!modId || !buyerId) {
    return NextResponse.json({ paid: false })
  }

  const { data } = await supabaseAdmin
    .from('orders')
    .select('id, status')
    .eq('mod_id', modId)
    .eq('buyer_id', buyerId)
    .eq('status', 'paid')
    .single()

  return NextResponse.json({ paid: !!data })
}