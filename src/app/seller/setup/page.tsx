'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, getUser } from '@/lib/supabase'

export default function SellerSetupPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    bankName: '',
    bankAccount: '',
    accountName: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const BANKS = [
    'ธนาคารกสิกรไทย (KBANK)',
    'ธนาคารไทยพาณิชย์ (SCB)',
    'ธนาคารกรุงเทพ (BBL)',
    'ธนาคารกรุงไทย (KTB)',
    'ธนาคารกรุงศรีอยุธยา (BAY)',
    'ธนาคารทหารไทยธนชาต (TTB)',
    'ธนาคารออมสิน (GSB)',
    'PromptPay (พร้อมเพย์)',
  ]

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const u = await getUser()
    if (!u) { router.push('/auth/login'); return }
    setUser(u)

    // โหลดข้อมูลเดิม (ถ้ามี)
    const { data } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('id', u.id)
      .single()

    if (data) {
      setForm({
        bankName:    data.bank_name    || '',
        bankAccount: data.bank_account || '',
        accountName: data.account_name || '',
      })
      if (data.qr_code_url) setQrPreview(data.qr_code_url)
    }

    setLoading(false)
  }

  function handleQrChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setQrFile(file)
    setQrPreview(URL.createObjectURL(file))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.bankName)    e.bankName    = 'กรุณาเลือกธนาคาร'
    if (!form.bankAccount) e.bankAccount = 'กรุณากรอกเลขบัญชี'
    if (!form.accountName) e.accountName = 'กรุณากรอกชื่อบัญชี'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSaving(true)

    try {
     let qrUrl = qrPreview

     // Upload QR ผ่าน API route
     if (qrFile) {
      const formData = new FormData()
      formData.append('file', qrFile)
      formData.append('userId', user.id)

      const uploadRes = await fetch('/api/seller/upload-qr', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        setErrors({ general: 'อัปโหลด QR Code ไม่สำเร็จ' })
        setSaving(false)
        return
      }

      qrUrl = uploadData.url
    }

    // บันทึกข้อมูลผ่าน API route
    const res = await fetch('/api/seller/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId:      user.id,
        bankName:    form.bankName,
        bankAccount: form.bankAccount,
        accountName: form.accountName,
        qrCodeUrl:   qrUrl,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setErrors({ general: data.error || 'บันทึกไม่สำเร็จ' })
      setSaving(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/seller'), 1500)

   } catch {
    setErrors({ general: 'เกิดข้อผิดพลาด กรุณาลองใหม่' })
    setSaving(false)
   }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#06060f',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#a855f7',
        fontFamily: 'system-ui',
      }}>
        กำลังโหลด...
      </div>
    )
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#0d0d1a',
    border: '1px solid rgba(124,58,237,.25)',
    borderRadius: 8, padding: '10px 14px',
    color: '#f1f0ff', fontSize: '.88rem',
    outline: 'none', fontFamily: 'system-ui',
  }

  const lab: React.CSSProperties = {
    display: 'block', fontSize: '.8rem',
    fontWeight: 600, color: '#9ca3af', marginBottom: 6,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06060f', color: '#f1f0ff', fontFamily: 'system-ui' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        background: 'rgba(13,13,26,.9)',
        borderBottom: '1px solid rgba(124,58,237,.2)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/seller" style={{ fontSize: '.82rem', color: '#9ca3af', textDecoration: 'none' }}>
          ← กลับ Seller Portal
        </Link>
        <span style={{ fontFamily: 'monospace', fontSize: '.95rem', fontWeight: 800 }}>
          ⬡ MOD<span style={{ color: '#a855f7' }}>MERCE</span> — ตั้งค่าบัญชี
        </span>
        <span style={{ fontSize: '.82rem', color: '#a855f7' }}>👤 {user?.displayName}</span>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '36px 24px' }}>

        {success ? (
          <div style={{
            background: '#111124', border: '1px solid rgba(168,85,247,.5)',
            borderRadius: 16, padding: '48px 32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>
              บันทึกสำเร็จ!
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '.88rem' }}>
              กำลังกลับไปหน้า Seller Portal...
            </p>
          </div>
        ) : (
          <div style={{
            background: '#111124',
            border: '1px solid rgba(124,58,237,.2)',
            borderRadius: 16, overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid rgba(124,58,237,.12)',
              background: 'linear-gradient(135deg,rgba(45,20,88,.6),transparent)',
            }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>
                ⚙️ ตั้งค่าบัญชีรับเงิน
              </h1>
              <p style={{ fontSize: '.82rem', color: '#9ca3af' }}>
                ข้อมูลนี้ใช้สำหรับรับเงินจาก Buyer ที่ซื้อ Mod ของคุณ
              </p>
            </div>

            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {errors.general && (
                <div style={{
                  background: 'rgba(239,68,68,.1)',
                  border: '1px solid rgba(239,68,68,.3)',
                  borderRadius: 8, padding: '10px 14px',
                  fontSize: '.82rem', color: '#f87171',
                }}>
                  {errors.general}
                </div>
              )}

              {/* ธนาคาร */}
              <div>
                <label style={lab}>ธนาคาร <span style={{ color: '#a855f7' }}>*</span></label>
                <select
                  style={{ ...inp, cursor: 'pointer' }}
                  value={form.bankName}
                  onChange={e => setForm(p => ({ ...p, bankName: e.target.value }))}
                >
                  <option value="">เลือกธนาคาร...</option>
                  {BANKS.map(b => (
                    <option key={b} value={b} style={{ background: '#0d0d1a' }}>{b}</option>
                  ))}
                </select>
                {errors.bankName && (
                  <span style={{ fontSize: '.75rem', color: '#f87171' }}>{errors.bankName}</span>
                )}
              </div>

              {/* เลขบัญชี */}
              <div>
                <label style={lab}>เลขบัญชี / เบอร์พร้อมเพย์ <span style={{ color: '#a855f7' }}>*</span></label>
                <input
                  style={inp}
                  placeholder="เช่น 0XX-X-XXXXX-X หรือ 08XXXXXXXX"
                  value={form.bankAccount}
                  onChange={e => setForm(p => ({ ...p, bankAccount: e.target.value }))}
                />
                {errors.bankAccount && (
                  <span style={{ fontSize: '.75rem', color: '#f87171' }}>{errors.bankAccount}</span>
                )}
              </div>

              {/* ชื่อบัญชี */}
              <div>
                <label style={lab}>ชื่อบัญชี <span style={{ color: '#a855f7' }}>*</span></label>
                <input
                  style={inp}
                  placeholder="ชื่อ-นามสกุล ตามบัญชีธนาคาร"
                  value={form.accountName}
                  onChange={e => setForm(p => ({ ...p, accountName: e.target.value }))}
                />
                {errors.accountName && (
                  <span style={{ fontSize: '.75rem', color: '#f87171' }}>{errors.accountName}</span>
                )}
              </div>

              {/* QR Code */}
              <div>
                <label style={lab}>QR Code PromptPay (ไม่บังคับ)</label>
                <p style={{ fontSize: '.75rem', color: '#4b5563', marginBottom: 8 }}>
                  รูป QR Code สำหรับให้ Buyer สแกนโอนเงิน
                </p>

                {/* Preview */}
                {qrPreview && (
                  <div style={{ marginBottom: 12, textAlign: 'center' }}>
                    <img
                      src={qrPreview}
                      alt="QR Preview"
                      style={{
                        width: 160, height: 160,
                        objectFit: 'contain',
                        background: 'white',
                        borderRadius: 12,
                        padding: 8,
                      }}
                    />
                  </div>
                )}

                {/* Upload zone */}
                <label style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8,
                  background: 'rgba(124,58,237,.04)',
                  border: '2px dashed rgba(124,58,237,.25)',
                  borderRadius: 10, padding: '24px 16px',
                  cursor: 'pointer', textAlign: 'center',
                }}>
                  <span style={{ fontSize: '1.8rem' }}>📷</span>
                  <span style={{ fontSize: '.82rem', fontWeight: 600, color: '#9ca3af' }}>
                    {qrFile ? qrFile.name : 'คลิกเพื่อเลือกรูป QR Code'}
                  </span>
                  <span style={{ fontSize: '.72rem', color: '#4b5563' }}>
                    PNG, JPG สูงสุด 2MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleQrChange}
                  />
                </label>
              </div>

              {/* Info box */}
              <div style={{
                background: 'rgba(124,58,237,.06)',
                border: '1px solid rgba(124,58,237,.18)',
                borderRadius: 10, padding: '14px 16px',
                fontSize: '.8rem', color: '#9ca3af',
                lineHeight: 1.6,
              }}>
                💡 ข้อมูลบัญชีจะแสดงให้ Buyer เห็นเฉพาะตอนชำระเงินเท่านั้น
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: '100%',
                  fontSize: '.95rem', fontWeight: 700,
                  color: 'white',
                  background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
                  border: 'none', padding: '12px',
                  borderRadius: 10, cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: saving ? 'none' : '0 0 20px rgba(168,85,247,.35)',
                }}
              >
                {saving ? 'กำลังบันทึก...' : '💾 บันทึกข้อมูล'}
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}