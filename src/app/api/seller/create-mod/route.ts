import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      sellerId, title, game, category,
      price, isFree, description, installGuide,
      requirements, tags, thumbnailUrl, modFileUrl,
    } = body

    if (!sellerId || !title || !game || !category) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบ' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('mods')
      .insert({
        seller_id:     sellerId,
        title,
        game,
        category,
        price:         isFree ? 0 : Number(price),
        is_free:       isFree,
        description,
        install_guide: installGuide,
        requirements,
        tags:          tags || [],
        thumbnail_url: thumbnailUrl || null,
        mod_file_url:  modFileUrl || null,
        is_published:  true,
        downloads:     0,
      })
      .select('id')
      .single()

    if (error) {
      console.error('DB Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, modId: data.id })

  } catch (err) {
    console.error('Server Error:', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}