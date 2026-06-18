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
            <div className={styles.statIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" aria-label="Mods icon"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z"/></svg></div>
            <div className={styles.statValue}>
              <Counter end={48200} />
            </div>
            <div className={styles.statLabel}>Mods ในระบบ</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" aria-label="Downloads icon"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg></div>
            <div className={styles.statValue}>
              <Counter end={3600000} />
            </div>
            <div className={styles.statLabel}>ยอด Download</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" aria-label="Sellers icon"><path d="M841-518v318q0 33-23.5 56.5T761-120H201q-33 0-56.5-23.5T121-200v-318q-23-21-35.5-54t-.5-72l42-136q8-26 28.5-43t47.5-17h556q27 0 47 16.5t29 43.5l42 136q12 39-.5 71T841-518Zm-272-42q27 0 41-18.5t11-41.5l-22-140h-78v148q0 21 14 36.5t34 15.5Zm-180 0q23 0 37.5-15.5T441-612v-148h-78l-22 140q-4 24 10.5 42t37.5 18Zm-178 0q18 0 31.5-13t16.5-33l22-154h-78l-40 134q-6 20 6.5 43t41.5 23Zm540 0q29 0 42-23t6-43l-42-134h-76l22 154q3 20 16.5 33t31.5 13ZM201-200h560v-282q-5 2-6.5 2H751q-27 0-47.5-9T663-518q-18 18-41 28t-49 10q-27 0-50.5-10T481-518q-17 18-39.5 28T393-480q-29 0-52.5-10T299-518q-21 21-41.5 29.5T211-480h-4.5q-2.5 0-5.5-2v282Zm560 0H201h560Z"/></svg></div>
            <div className={styles.statValue}>
              <Counter end={12400} />
            </div>
            <div className={styles.statLabel}>Sellers</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" aria-label="Orders icon"><path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg></div>
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
