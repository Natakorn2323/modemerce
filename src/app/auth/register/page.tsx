'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './register.module.css'

type Step = 1 | 2 | 3

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  displayName: string
  role: 'buyer' | 'seller' | ''
  agreeTerms: boolean
  agreeAge: boolean
}

const STRENGTH_LABELS = ['', 'อ่อนแอ', 'พอใช้', 'ดี', 'แข็งแกร่ง']
const STRENGTH_COLORS = ['', '#ef4444', '#f59e0b', '#22c55e', '#a855f7']

function getStrength(pw: string): number {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>({
    username: '', email: '', password: '', confirmPassword: '',
    displayName: '', role: '', agreeTerms: false, agreeAge: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const up = (k: keyof FormData, v: string | boolean) =>
    setForm(p => ({ ...p, [k]: v }))

  const strength = getStrength(form.password)

  function validateStep(s: Step): Record<string, string> {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (!form.email) e.email = 'กรุณากรอก Email'
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'รูปแบบ Email ไม่ถูกต้อง'
      if (!form.username) e.username = 'กรุณากรอก Username'
      else if (form.username.length < 3) e.username = 'Username ต้องมีอย่างน้อย 3 ตัวอักษร'
      else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'ใช้ได้เฉพาะ a-z, 0-9, _'
    }
    if (s === 2) {
      if (!form.password) e.password = 'กรุณากรอกรหัสผ่าน'
      else if (form.password.length < 8) e.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
      if (!form.confirmPassword) e.confirmPassword = 'กรุณายืนยันรหัสผ่าน'
      else if (form.password !== form.confirmPassword) e.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
      if (!form.displayName) e.displayName = 'กรุณากรอกชื่อที่แสดง'
    }
    if (s === 3) {
      if (!form.role) e.role = 'กรุณาเลือกประเภทบัญชี'
      if (!form.agreeTerms) e.agreeTerms = 'กรุณายอมรับข้อกำหนดและเงื่อนไข'
      if (!form.agreeAge) e.agreeAge = 'กรุณายืนยันอายุ'
    }
    return e
  }

async function next() {
  const e = validateStep(step)
  if (Object.keys(e).length) { setErrors(e); return }
  setErrors({})
  if (step < 3) { setStep((step + 1) as Step); return }

  setLoading(true)

  const res = await fetch('/api/auth/register', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email:       form.email,
      password:    form.password,
      username:    form.username,
      displayName: form.displayName,
      role:        form.role,
    }),
  })

  const data = await res.json()
  setLoading(false)

  if (!res.ok) {
    // ถ้า error เกี่ยวกับ email/username ให้กลับ step 1
    setErrors({ email: data.error })
    setStep(1)
    return
  }

  setSuccess(true)
}

  function back() {
    setErrors({})
    setStep((step - 1) as Step)
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.gridBg} />
        <div className={styles.successCard}>
          <div className={styles.successAnim}>
            <div className={styles.successRing} />
            <span className={styles.successCheck}>✓</span>
          </div>
        <h2 className={styles.successTitle}>เช็ค Email ของคุณ!</h2>
        <p className={styles.successText}>
          เราส่งลิงก์ยืนยันไปที่<br />
          <strong>{form.email}</strong><br /><br />
          กดลิงก์ในอีเมลเพื่อยืนยันบัญชี<br />
          แล้วค่อย Login ครับ
        </p>
        <div className={styles.successBadge}>
          📧 เช็ค Spam folder ด้วยนะครับ
        </div>
        <div className={styles.successActions}>
          <Link href="/auth/login" className={styles.successPrimary}>
            ไปหน้า Login →
          </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.gridBg} />

      <div className={styles.topBar}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>MOD<em>MERCE</em></span>
        </Link>
        <span className={styles.topBarText}>
          มีบัญชีแล้ว?{' '}
          <Link href="/auth/login" className={styles.topBarLink}>เข้าสู่ระบบ</Link>
        </span>
      </div>

      <div className={styles.container}>
        {/* Steps sidebar */}
        <div className={styles.stepsPanel}>
          <h2 className={styles.stepsTitle}>สร้างบัญชีใหม่</h2>
          <p className={styles.stepsSub}>เพียง 3 ขั้นตอนง่ายๆ</p>
          <div className={styles.stepsList}>
            {[
              { n: 1, label: 'ข้อมูลบัญชี', desc: 'Email & Username' },
              { n: 2, label: 'ตั้งรหัสผ่าน', desc: 'ชื่อที่แสดง & Password' },
              { n: 3, label: 'เลือกประเภท', desc: 'Buyer หรือ Seller' },
            ].map(s => (
              <div
                key={s.n}
                className={`${styles.stepItem} ${step === s.n ? styles.stepActive : ''} ${step > s.n ? styles.stepDone : ''}`}
              >
                <div className={styles.stepDot}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <div className={styles.stepInfo}>
                  <span className={styles.stepLabel}>{s.label}</span>
                  <span className={styles.stepDesc}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sideNote}>
            <div className={styles.sideNoteTitle}>🛡️ ความปลอดภัย</div>
            <p className={styles.sideNoteText}>
              ข้อมูลของคุณถูกเข้ารหัสและจัดเก็บอย่างปลอดภัย ไม่มีการแชร์ให้บุคคลที่สาม
            </p>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formArea}>
          <div className={styles.formCard}>

            {/* ─── Step 1 ─── */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>01</span>
                  <h3 className={styles.stepTitle}>ข้อมูลบัญชี</h3>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Email <span className={styles.req}>*</span></label>
                  <div className={styles.inputWrap}>
                    <span className={styles.icon}>✉</span>
                    <input
                      className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => up('email', e.target.value)}
                    />
                  </div>
                  {errors.email && <span className={styles.err}>{errors.email}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Username <span className={styles.req}>*</span></label>
                  <div className={styles.inputWrap}>
                    <span className={styles.icon}>@</span>
                    <input
                      className={`${styles.input} ${errors.username ? styles.inputErr : ''}`}
                      placeholder="modder_username"
                      value={form.username}
                      onChange={e => up('username', e.target.value.toLowerCase())}
                    />
                    {form.username.length >= 3 && !errors.username && (
                      <span className={styles.validIcon}>✓</span>
                    )}
                  </div>
                  {errors.username
                    ? <span className={styles.err}>{errors.username}</span>
                    : <span className={styles.hint}>ใช้ a–z, 0–9 และ _ เท่านั้น</span>
                  }
                </div>

                {/* Social register */}
                <div className={styles.dividerOr}><span>หรือสมัครด้วย</span></div>
                <div className={styles.socials}>
                  <button className={styles.socialBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button className={styles.socialBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    Discord
                  </button>
                  <button className={styles.socialBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.11.819-.26.819-.578 0-.284-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </button>
                </div>
              </div>
            )}

            {/* ─── Step 2 ─── */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>02</span>
                  <h3 className={styles.stepTitle}>ตั้งรหัสผ่าน</h3>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>ชื่อที่แสดง (Display Name) <span className={styles.req}>*</span></label>
                  <div className={styles.inputWrap}>
                    <span className={styles.icon}>👤</span>
                    <input
                      className={`${styles.input} ${errors.displayName ? styles.inputErr : ''}`}
                      placeholder="ชื่อที่คนอื่นจะเห็น"
                      value={form.displayName}
                      onChange={e => up('displayName', e.target.value)}
                    />
                  </div>
                  {errors.displayName && <span className={styles.err}>{errors.displayName}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>รหัสผ่าน <span className={styles.req}>*</span></label>
                  <div className={styles.inputWrap}>
                    <span className={styles.icon}>🔒</span>
                    <input
                      className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
                      type={showPw ? 'text' : 'password'}
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      value={form.password}
                      onChange={e => up('password', e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setShowPw(v => !v)}
                    >
                      {showPw ? '🙈' : '👁'}
                    </button>
                  </div>
                  {form.password && (
                    <div className={styles.strengthWrap}>
                      <div className={styles.strengthBar}>
                        {[1, 2, 3, 4].map(n => (
                          <div
                            key={n}
                            className={styles.strengthSeg}
                            style={{ background: n <= strength ? STRENGTH_COLORS[strength] : undefined }}
                          />
                        ))}
                      </div>
                      <span className={styles.strengthLabel} style={{ color: STRENGTH_COLORS[strength] }}>
                        {STRENGTH_LABELS[strength]}
                      </span>
                    </div>
                  )}
                  {errors.password && <span className={styles.err}>{errors.password}</span>}
                  <div className={styles.pwRules}>
                    {[
                      { ok: form.password.length >= 8,  text: 'อย่างน้อย 8 ตัวอักษร' },
                      { ok: /[A-Z]/.test(form.password), text: 'ตัวพิมพ์ใหญ่' },
                      { ok: /[0-9]/.test(form.password), text: 'ตัวเลข' },
                      { ok: /[^A-Za-z0-9]/.test(form.password), text: 'อักขระพิเศษ' },
                    ].map((r, i) => (
                      <span key={i} className={`${styles.pwRule} ${r.ok ? styles.pwRuleOk : ''}`}>
                        {r.ok ? '✓' : '○'} {r.text}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>ยืนยันรหัสผ่าน <span className={styles.req}>*</span></label>
                  <div className={styles.inputWrap}>
                    <span className={styles.icon}>🔑</span>
                    <input
                      className={`${styles.input} ${errors.confirmPassword ? styles.inputErr : ''}`}
                      type="password"
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      value={form.confirmPassword}
                      onChange={e => up('confirmPassword', e.target.value)}
                    />
                    {form.confirmPassword && form.password === form.confirmPassword && (
                      <span className={styles.validIcon}>✓</span>
                    )}
                  </div>
                  {errors.confirmPassword && <span className={styles.err}>{errors.confirmPassword}</span>}
                </div>
              </div>
            )}

            {/* ─── Step 3 ─── */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>03</span>
                  <h3 className={styles.stepTitle}>เลือกประเภทบัญชี</h3>
                </div>

                <p className={styles.roleSubtitle}>คุณต้องการใช้งาน ModVault ในฐานะ?</p>

                <div className={styles.roleGrid}>
                  <button
                    type="button"
                    className={`${styles.roleCard} ${form.role === 'buyer' ? styles.roleActive : ''}`}
                    onClick={() => up('role', 'buyer')}
                  >
                    <span className={styles.roleEmoji}>🎮</span>
                    <span className={styles.roleName}>Buyer</span>
                    <span className={styles.roleDesc}>ซื้อและดาวน์โหลด Mods สำหรับเกมที่คุณชอบ</span>
                    <ul className={styles.rolePerks}>
                      <li>ค้นหาและซื้อ Mods ได้ทันที</li>
                      <li>บันทึก Wishlist ส่วนตัว</li>
                      <li>รับการแจ้งเตือนอัปเดต</li>
                    </ul>
                    {form.role === 'buyer' && <span className={styles.roleCheck}>✓</span>}
                  </button>

                  <button
                    type="button"
                    className={`${styles.roleCard} ${form.role === 'seller' ? styles.roleActive : styles.roleSellerIdle}`}
                    onClick={() => up('role', 'seller')}
                  >
                    <span className={styles.roleEmoji}>⚡</span>
                    <span className={styles.roleName}>Seller</span>
                    <span className={styles.roleDesc}>สร้างและขาย Mods ให้กับชุมชนผู้เล่น</span>
                    <ul className={styles.rolePerks}>
                      <li>อัปโหลดและขาย Mods ได้ไม่จำกัด</li>
                      <li>ดู Analytics และรายได้</li>
                      <li>เข้าถึง Seller Dashboard</li>
                    </ul>
                    <span className={styles.sellerBadge}>รายได้ไม่จำกัด</span>
                    {form.role === 'seller' && <span className={styles.roleCheck}>✓</span>}
                  </button>
                </div>
                {errors.role && <span className={styles.err}>{errors.role}</span>}

                <div className={styles.checkboxGroup}>
                  <label className={`${styles.checkRow} ${errors.agreeTerms ? styles.checkRowErr : ''}`}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={form.agreeTerms}
                      onChange={e => up('agreeTerms', e.target.checked)}
                    />
                    <span className={styles.checkText}>
                      ฉันยอมรับ{' '}
                      <Link href="#" className={styles.checkLink}>ข้อกำหนดการใช้งาน</Link>
                      {' '}และ{' '}
                      <Link href="#" className={styles.checkLink}>นโยบายความเป็นส่วนตัว</Link>
                    </span>
                  </label>
                  {errors.agreeTerms && <span className={styles.err} style={{ paddingLeft: 28 }}>{errors.agreeTerms}</span>}

                  <label className={`${styles.checkRow} ${errors.agreeAge ? styles.checkRowErr : ''}`}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={form.agreeAge}
                      onChange={e => up('agreeAge', e.target.checked)}
                    />
                    <span className={styles.checkText}>ฉันยืนยันว่ามีอายุ 13 ปีขึ้นไป</span>
                  </label>
                  {errors.agreeAge && <span className={styles.err} style={{ paddingLeft: 28 }}>{errors.agreeAge}</span>}
                </div>
              </div>
            )}

            {/* Nav */}
            <div className={styles.formNav}>
              {step > 1 && (
                <button className={styles.backBtn} onClick={back}>
                  ← ย้อนกลับ
                </button>
              )}
              <div className={styles.progressPills}>
                {[1, 2, 3].map(n => (
                  <div
                    key={n}
                    className={`${styles.pill} ${step === n ? styles.pillActive : ''} ${step > n ? styles.pillDone : ''}`}
                  />
                ))}
              </div>
              <button
                className={styles.nextBtn}
                onClick={next}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.loadingRow}>
                    <span className={styles.spinner} />
                    กำลังสร้างบัญชี...
                  </span>
                ) : step < 3 ? 'ถัดไป →' : '🚀 สร้างบัญชี'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
