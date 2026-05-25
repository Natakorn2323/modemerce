'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './login.module.css'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  // ใน component
  const router = useRouter()

  const up = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  function validate() {
    const e: Record<string, string> = {}
    if (!form.email) e.email = 'กรุณากรอก Email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'รูปแบบ Email ไม่ถูกต้อง'
    if (!form.password) e.password = 'กรุณากรอกรหัสผ่าน'
    else if (form.password.length < 6) e.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    return e
  }

  async function handleSubmit(): Promise<void> {
  const e = validate()
  if (Object.keys(e).length) { setErrors(e); return }
  setErrors({})
  setLoading(true)

  const res = await fetch('/api/auth/login', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email:    form.email,
      password: form.password,
    }),
  })

  const data = await res.json()
  setLoading(false)

  if (!res.ok) {
    setErrors({ password: data.error })
    return
  }

  // เก็บ user ใน localStorage
  localStorage.setItem('mv_user', JSON.stringify(data.user))

  setSuccess(true)
  setTimeout(() => router.push('/'), 1200)
}
  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.gridBg} />
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>เข้าสู่ระบบสำเร็จ!</h2>
          <p className={styles.successText}>ยินดีต้อนรับกลับมา กำลังพาคุณไปหน้าหลัก...</p>
          <Link href="/" className={styles.successBtn}>ไปหน้าหลัก →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.gridBg} />

      <div className={styles.container}>
        {/* Left panel */}
        <div className={styles.leftPanel}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⬡</span>
            <span className={styles.logoText}>MOD<em>VAULT</em></span>
          </Link>
          <h1 className={styles.leftTitle}>
            เล่นเกมได้<br />
            <span className={styles.leftHighlight}>ดีกว่าเดิม</span>
          </h1>
          <p className={styles.leftSub}>
            เข้าถึง Mods คุณภาพสูงกว่า 48,000 รายการ
            จากคอมมูนิตี้นักพัฒนาทั่วโลก
          </p>
          <div className={styles.featureList}>
            {[
              { icon: '⚡', text: 'ดาวน์โหลดทันที ไม่จำกัดความเร็ว' },
              { icon: '🛡️', text: 'Mods ผ่านการตรวจสอบความปลอดภัย' },
              { icon: '🔄', text: 'อัปเดตอัตโนมัติเมื่อ Mod มี version ใหม่' },
              { icon: '💬', text: 'รับการสนับสนุนจากคอมมูนิตี้' },
            ].map((f, i) => (
              <div key={i} className={styles.feature}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
          <div className={styles.statsRow}>
            <div className={styles.stat}><span className={styles.statVal}>48K+</span><span className={styles.statLab}>Mods</span></div>
            <div className={styles.statDiv} />
            <div className={styles.stat}><span className={styles.statVal}>3.6M</span><span className={styles.statLab}>Downloads</span></div>
            <div className={styles.statDiv} />
            <div className={styles.stat}><span className={styles.statVal}>12K</span><span className={styles.statLab}>Sellers</span></div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className={styles.rightPanel}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>เข้าสู่ระบบ</h2>
              <p className={styles.formSub}>
                ยังไม่มีบัญชี?{' '}
                <Link href="/auth/register" className={styles.formLink}>สมัครสมาชิก</Link>
              </p>
            </div>

            {/* Social login */}
            <div className={styles.socials}>
              <button className={styles.socialBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                ด้วย Google
              </button>
              <button className={styles.socialBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="#5865F2"/>
                </svg>
                ด้วย Discord
              </button>
            </div>

            <div className={styles.divider}><span>หรือเข้าสู่ระบบด้วย Email</span></div>

            {/* Form fields */}
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>✉</span>
                <input
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => up('email', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label}>รหัสผ่าน</label>
                <Link href="/auth/forgot" className={styles.forgotLink}>ลืมรหัสผ่าน?</Link>
              </div>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => up('password', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              {errors.password && <span className={styles.errMsg}>{errors.password}</span>}
            </div>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={form.remember}
                onChange={e => up('remember', e.target.checked)}
              />
              <span className={styles.checkLabel}>จดจำการเข้าสู่ระบบ</span>
            </label>

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loadingRow}>
                  <span className={styles.spinner} /> กำลังเข้าสู่ระบบ...
                </span>
              ) : 'เข้าสู่ระบบ'}
            </button>

            <p className={styles.registerRow}>
              ต้องการขาย Mod?{' '}
              <Link href="/seller" className={styles.formLink}>เปิดบัญชี Seller →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
