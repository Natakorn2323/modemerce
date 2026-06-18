import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('mods')
    .select('*, profiles(display_name)')
    .eq('is_published', true)
    .order('downloads', { ascending: false })
    .limit(7)

  if (error) {
    return NextResponse.json({ mods: [] })
  }

  return NextResponse.json({ mods: data })
}