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
  const { id } = await params

  const { data: mod, error } = await supabaseAdmin
    .from('mods')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !mod) {
    return NextResponse.json({ mod: null, seller: null }, { status: 404 })
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('display_name')
    .eq('id', mod.seller_id)
    .single()

  const { data: seller } = await supabaseAdmin
    .from('seller_profiles')
    .select('bank_name, bank_account, account_name, qr_code_url')
    .eq('id', mod.seller_id)
    .single()

  return NextResponse.json({
    mod: { ...mod, profiles: { display_name: profile?.display_name || 'Unknown' } },
    seller: seller || null,
  })
}