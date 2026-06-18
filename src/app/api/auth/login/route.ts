import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอก Email และรหัสผ่าน' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log('ERROR:', JSON.stringify(error))
    console.log('EMAIL:', email)
    console.log('DATA:', data?.user?.id)

    if (error) {
      return NextResponse.json(
        { error: 'Email หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // ดึง profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, display_name, role')
      .eq('id', data.user.id)
      .single()

    return NextResponse.json({
      success: true,
      user: {
        id:          data.user.id,
        email:       data.user.email,
        displayName: profile?.display_name,
        username:    profile?.username,
        role:        profile?.role,
        token:       data.session?.access_token,
        refreshToken: data.session?.refresh_token,
      },
    })

  } catch {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
      { status: 500 }
    )
  }
}