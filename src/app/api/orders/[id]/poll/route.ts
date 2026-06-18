import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // ← เพิ่ม await

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('status, paid_at, mod_id')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ status: 'pending' })
  }

  return NextResponse.json({
    status:  data.status,
    paid_at: data.paid_at,
    mod_id:  data.mod_id,
  })
}