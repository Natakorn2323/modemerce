'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [bestsellersOpen, setBestsellersOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropButtonRef = useRef<HTMLButtonElement>(null)

  // อ่าน user จาก localStorage ครั้งเดียวตอน mount
  useEffect(() => {
    const raw = localStorage.getItem('mv_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBestsellersOpen(false)
        dropButtonRef.current?.focus()
      }
    }
    if (bestsellersOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [bestsellersOpen])

  function handleLogout() {
    localStorage.removeItem('mv_user')
    setUser(null)
    router.push('/')
  }

  function toggleDropdown(e?: React.KeyboardEvent | React.MouseEvent) {
    if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return
    setBestsellersOpen(!bestsellersOpen)
  }

  const bestsellers = [
    { name: 'GTA V — NaturalVision Evolved', downloads: '2.4M', price: 'Free' },
    { name: 'Skyrim — Requiem Overhaul',     downloads: '1.8M', price: '฿59' },
    { name: 'Minecraft — Optifine Ultra',    downloads: '3.1M', price: 'Free' },
    { name: 'Cyberpunk 2077 — Cyber Engine', downloads: '980K', price: '฿39' },
    { name: 'Elden Ring — Seamless Coop',    downloads: '1.2M', price: 'Free' },
  ]

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>MOD<em>MERCE</em></span>
        </Link>

        {/* Nav links */}
        <div className={styles.links}>
          <div
            className={styles.dropdown}
            ref={dropdownRef}
            onMouseEnter={() => setBestsellersOpen(true)}
            onMouseLeave={() => setBestsellersOpen(false)}
          >
            <button
              ref={dropButtonRef}
              className={styles.navBtn}
              onClick={toggleDropdown}
              onKeyDown={toggleDropdown}
              aria-haspopup="menu"
              aria-expanded={bestsellersOpen}
            >
              <span className={styles.hotBadge}>🔥</span>
              สินค้าขายดี
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M6 8L1 3h10z" />
              </svg>
            </button>
            {bestsellersOpen && (
              <div className={styles.dropMenu} role="menu">
                <div className={styles.dropHeader}>Top Mods ประจำสัปดาห์</div>
                {bestsellers.map((item, i) => (
                  <Link key={i} href="#" className={styles.dropItem} role="menuitem">
                    <span className={styles.dropRank}>#{i + 1}</span>
                    <span className={styles.dropName}>{item.name}</span>
                    <span className={styles.dropMeta}>
                      <span className={styles.downloads}>↓{item.downloads}</span>
                      <span className={item.price === 'Free' ? styles.free : styles.price}>
                        {item.price}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/mods"  className={styles.navLink}>Browse All</Link>
          <Link href="/games" className={styles.navLink}>Games</Link>
        </div>

        {/* Right side */}
        <div className={styles.right}>
          
          <Link href="/seller" className={styles.sellerBtn}>
            <span>⚡</span> Login Seller
          </Link>

          {user ? (
            <>
              <span className={styles.userDisplay}>
                👤 {user.displayName}
                {user.role === 'seller' && (
                  <span className={styles.sellerBadge}>
                    ⚡ Seller
                  </span>
                )}
              </span>
              <div style={{ display:'flex', alignItems:'center',gap:10}}>
                <Link href="/dashboard" style={{ fontSize:'.82rem',}}>
                  คำสั่งซื้อ
                </Link>
                
                
              </div>
              <button className={styles.loginBtn} onClick={handleLogout}>
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link href="/auth/login" className={styles.loginBtn}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}