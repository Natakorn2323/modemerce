import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ใช้ service role — bypass RLS ได้เลย
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const {
      userId,
      bankName,
      bankAccount,
      accountName,
      qrCodeUrl,
    } = await req.json()

    if (!userId || !bankName || !bankAccount || !accountName) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบ' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('seller_profiles')
      .upsert({
        id:           userId,
        bank_name:    bankName,
        bank_account: bankAccount,
        account_name: accountName,
        qr_code_url:  qrCodeUrl || null,
        is_seller:    true,
      })

    if (error) {
      console.error('DB Error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Server Error:', err)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}