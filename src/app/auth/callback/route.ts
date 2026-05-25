import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type')

  if (token_hash && type) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      // Confirm สำเร็จ → ไปหน้า login
      return NextResponse.redirect(
        new URL('/auth/confirmed', request.url)
      )
    }
  }

  // ถ้า error → ไปหน้าแจ้ง error
  return NextResponse.redirect(
    new URL('/auth/error', request.url)
  )
}