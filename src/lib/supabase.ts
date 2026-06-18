import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key, {
  auth: {
    persistSession:    false,  // ← ไม่เก็บ session
    autoRefreshToken:  false,  // ← ไม่ refresh อัตโนมัติ
    detectSessionInUrl: false, // ← ไม่เช็ค URL
  },
})

// ดึง user จาก localStorage เฉยๆ ไม่ต้อง set session
export function getUser() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('mv_user')
  return raw ? JSON.parse(raw) : null
}

// ใช้แทน setSession เดิม
export async function setSession() {
  return getUser()
}