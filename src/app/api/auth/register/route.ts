import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ใช้ Service Role สำหรับ server-side เท่านั้น
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password, username, displayName, role } = await req.json()
    // ✅ LOG จุดที่ 1 — เช็คว่า request เข้ามาถูกไหม
    console.log('=== REGISTER REQUEST ===')
    console.log('email:', email)
    console.log('username:', username)
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    // validate
    if (!email || !password || !username || !displayName) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบ' },
        { status: 400 }
      )
    }

    // เช็ค username ซ้ำ
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Username นี้มีคนใช้แล้ว' },
        { status: 409 }
      )
    }

    // สร้าง user ใน Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName, role },
      },
    })
      // ✅ LOG จุดที่ 2 — นี่แหละตัวสำคัญสุด
    console.log('=== SIGNUP RESULT ===')
    console.log('error:', error)
    console.log('error.message:', error?.message)
    console.log('data.user:', data?.user?.id)
    console.log('====================')
    if (error) {
      // email ซ้ำ
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Email นี้มีบัญชีอยู่แล้ว' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // บันทึก profile
    if (data.user) {
      await supabaseAdmin.from('profiles').insert({
        id:           data.user.id,
        username,
        display_name: displayName,
        role:         role || 'buyer',
      })

    
    }
     
    return NextResponse.json({ success: true }, { status: 201 })

  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
      { status: 500 }
    )
  }
}