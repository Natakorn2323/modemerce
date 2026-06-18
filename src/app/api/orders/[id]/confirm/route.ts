import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  _req: Request,
  {params}: {params: Promise<{id: string}> }
){
  const {id} = await params 

  const {data: order,error}= await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('mod_id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (order?.mod_id) {
    await supabaseAdmin.rpc('increment_downloads', {
      mod_id: order.mod_id,
    
    })
 }

  return NextResponse.json({ success: true })
}