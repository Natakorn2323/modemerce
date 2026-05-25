'use client'

import { useEffect, useRef } from 'react'
import styles from './HeroSection.module.css'

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let start = 0
    const duration = 1800
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        start = end
        clearInterval(timer)
      }
      if (ref.current) {
        ref.current.textContent =
          start >= 1000
            ? (start / 1000).toFixed(1) + 'K' + suffix
            : start + suffix
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end, suffix])

  return <span ref={ref}>0</span>
}

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Grid lines bg */}
      <div className={styles.gridBg} />

      <div className={styles.content}>
        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Game Mod Marketplace #1 in Thailand
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          <span className={styles.titleLine1}>DISCOVER &amp; INSTALL</span>
          <span className={styles.titleLine2}>
            GAME <em>MODS</em>
          </span>
          <span className={styles.titleLine3}>ง่าย รวดเร็ว ครบครัน</span>
        </h1>

        <p className={styles.subtitle}>
          รวม Game Mods คุณภาพสูงจากทั่วโลก พร้อมคำแนะนำการติดตั้งโดยละเอียด
          <br />ซื้อ ขาย แชร์ ในชุมชนเดียว
        </p>

        {/* CTA */}
        <div className={styles.cta}>
          <button className={styles.ctaPrimary}>
            🎮 เริ่มต้นดู Mods
          </button>
          <button className={styles.ctaSecondary}>
            ⚡ เป็น Seller
          </button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statValue}>
              <Counter end={48200} />
            </div>
            <div className={styles.statLabel}>Mods ในระบบ</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}>⬇️</div>
            <div className={styles.statValue}>
              <Counter end={3600000} />
            </div>
            <div className={styles.statLabel}>ยอด Download</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}>💼</div>
            <div className={styles.statValue}>
              <Counter end={12400} />
            </div>
            <div className={styles.statLabel}>Sellers</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}>🛒</div>
            <div className={styles.statValue}>
              <Counter end={20} />
            </div>
            <div className={styles.statLabel}>ออเดอร์วันนี้</div>
          </div>
        </div>
      </div>
    </section>
  )
}
