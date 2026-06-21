import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data: mods, error } = await supabaseAdmin
    .from('mods')
    .select('*')
    .eq('is_published', true)
    .order('downloads', { ascending: false })
    .limit(7)

  if (error) {
    console.error('Fetch featured error:', error)
    return NextResponse.json({ mods: [] })
  }

  if (!mods || mods.length === 0) {
    return NextResponse.json({ mods: [] })
  }

  const sellerIds = [...new Set(mods.map(m => m.seller_id))]
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, display_name')
    .in('id', sellerIds)

  const profileMap = new Map(profiles?.map(p => [p.id, p.display_name]) || [])

  const result = mods.map(m => ({
    ...m,
    profiles: { display_name: profileMap.get(m.seller_id) || 'Unknown' }
  }))

  return NextResponse.json({ mods: result })
}