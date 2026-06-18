'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUser,supabase } from '@/lib/supabase'
import styles from './seller.module.css'

export default function SellerPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const u = await getUser()
    if (!u) {
      router.push('/auth/login')
      return
    }
    setUser(u)

    const { data } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('id', u.id)
      .single()

    setSeller(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#06060f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a855f7',
        fontFamily: 'system-ui',
      }}>
        กำลังโหลด...
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>← กลับหน้าหลัก</Link>
        <span className={styles.logo}>⬡ MOD<em>MERCE</em> Seller Portal</span>
        <span className={styles.userBadge}>👤 {user?.displayName}</span>
      </div>

      <div className={styles.container}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeIcon}>⚡</div>
          <div>
            <h1 className={styles.welcomeTitle}>
              ยินดีต้อนรับ, {user?.displayName}
            </h1>
            <p className={styles.welcomeSub}>
              {seller?.is_seller ? 'คุณพร้อมขาย Mod แล้ว!' : 'ตั้งค่าบัญชีเพื่อเริ่มขาย Mod'}
            </p>
          </div>
        </div>

        {!seller?.is_seller && (
          <div className={styles.setupBanner}>
            <span>⚠️ ยังไม่ได้ตั้งค่าบัญชีรับเงิน</span>
            <Link href="/seller/setup" className={styles.setupBtn}>
              ตั้งค่าเลย →
            </Link>
          </div>
        )}

        <div className={styles.menuGrid}>
          <Link href="/seller/mod/new" className={styles.menuCard}>
            <span className={styles.menuIcon}>➕</span>
            <span className={styles.menuLabel}>ลง Mod ใหม่</span>
          </Link>
          <Link href="/seller/dashboard" className={styles.menuCard}>
            <span className={styles.menuIcon}>📊</span>
            <span className={styles.menuLabel}>Dashboard</span>
          </Link>
          <Link href="/seller/mods" className={styles.menuCard}>
            <span className={styles.menuIcon}>🎮</span>
            <span className={styles.menuLabel}>จัดการ Mods</span>
          </Link>
          <Link href="/seller/setup" className={styles.menuCard}>
            <span className={styles.menuIcon}>⚙️</span>
            <span className={styles.menuLabel}>ตั้งค่าบัญชี</span>
          </Link>
        </div>
      </div>
    </div>
  )
}