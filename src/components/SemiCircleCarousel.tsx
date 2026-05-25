'use client'

import { useState } from 'react'
import styles from './SemiCircleCarousel.module.css'

interface ModItem {
  id: number
  title: string
  game: string
  image: string
  price: string
  rating: number
  downloads: string
  category: string
  description: string
}

const FEATURED_MODS: ModItem[] = [
  { id: 1, title: 'NaturalVision Evolved',  game: 'GTA V',         image: '🌆', price: 'Free', rating: 4.9, downloads: '2.4M', category: 'Graphics',   description: 'Reshade & texture overhaul ที่สวยที่สุดใน GTA V เพิ่มความสมจริงทุกด้าน' },
  { id: 2, title: 'Requiem 5.1 Overhaul',   game: 'Skyrim SE',     image: '⚔️', price: '฿59',  rating: 4.8, downloads: '1.8M', category: 'Gameplay',   description: 'Survival RPG overhaul ที่เปลี่ยนระบบเกมทั้งหมด ท้าทายและสมจริงมากขึ้น' },
  { id: 3, title: 'Cyberpunk Engine Tweaks',game: 'Cyberpunk 2077', image: '🤖', price: 'Free', rating: 4.7, downloads: '980K', category: 'Performance', description: 'เพิ่ม FPS และแก้ bug ในเกม รองรับ DLSS และ Ray Tracing เต็มรูปแบบ' },
  { id: 4, title: 'Seamless Co-op',          game: 'Elden Ring',    image: '🗡️', price: 'Free', rating: 4.9, downloads: '1.2M', category: 'Multiplayer', description: 'เล่น Co-op แบบ Seamless กับเพื่อนตลอดทั้งเกม ไม่มี session limit' },
  { id: 5, title: 'OptiFine Ultra 1.21',     game: 'Minecraft',     image: '⛏️', price: 'Free', rating: 4.8, downloads: '3.1M', category: 'Performance', description: 'เพิ่ม FPS แบบ Shader และ Texture Pack คุณภาพสูงพร้อมใน package เดียว' },
  { id: 6, title: 'Project Zomboid: Brita', game: 'Project Zomboid',image: '🧟', price: '฿29',  rating: 4.6, downloads: '650K', category: 'Content',    description: 'เพิ่มอาวุธ เสื้อผ้า และ item ใหม่กว่า 1,000 ชิ้น พร้อม animation สมจริง' },
  { id: 7, title: 'STALKER Anomaly',         game: 'S.T.A.L.K.E.R.',image: '☢️', price: 'Free', rating: 4.9, downloads: '420K', category: 'Total Conv', description: 'Total Conversion Mod ขนาดใหญ่ เปลี่ยนทุกอย่างใหม่หมด ถือว่าเป็นเกมใหม่' },
]

export default function SemiCircleCarousel() {
  const [activeIndex, setActiveIndex] = useState(3)

  const count = FEATURED_MODS.length
  // Spread cards over the top semi-arc
  const R = 340 // radius in px

  function getCardStyle(i: number): React.CSSProperties {
    const offset = i - activeIndex
    const maxOffset = Math.floor(count / 2)
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, offset))

    // Angle: center = 270deg (top), spread ±65deg
    const angleDeg = 270 + clampedOffset * (130 / count)
    const angleRad = (angleDeg * Math.PI) / 180
    const x = R * Math.cos(angleRad)
    const y = R * Math.sin(angleRad)

    const isActive = i === activeIndex
    const dist = Math.abs(offset)

    const scale = isActive ? 1 : Math.max(0.6, 1 - dist * 0.13)
    const opacity = isActive ? 1 : Math.max(0.2, 1 - dist * 0.28)
    const rotateZ = isActive ? 0 : clampedOffset * 8
    const zIndex = isActive ? 10 : 10 - dist

    return {
      position: 'absolute' as const,
      left: `calc(50% + ${x}px - 100px)`,
      top: `calc(50% + ${y}px - 130px)`,
      width: '200px',
      transform: `scale(${scale}) rotateZ(${rotateZ}deg)`,
      opacity,
      zIndex,
      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      cursor: isActive ? 'default' : 'pointer',
    }
  }

  const active = FEATURED_MODS[activeIndex]

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className="section-title">✨ Mod แนะนำ</h2>
        <p className={styles.subtitle}>คัดสรรจากทีมงาน — อัปเดตทุกสัปดาห์</p>
      </div>

      {/* Active card detail (center) */}
      <div className={styles.activeDetail}>
        <div className={styles.activeImage}>{active.image}</div>
        <div className={styles.activeInfo}>
          <div className={styles.activeMeta}>
            <span className={styles.activeCategory}>{active.category}</span>
            <span className={styles.activeGame}>{active.game}</span>
          </div>
          <h3 className={styles.activeTitle}>{active.title}</h3>
          <p className={styles.activeDesc}>{active.description}</p>
          <div className={styles.activeStats}>
            <span>⭐ {active.rating}</span>
            <span>⬇️ {active.downloads}</span>
          </div>
          <div className={styles.activeActions}>
            <span className={active.price === 'Free' ? styles.freeTag : styles.priceTag}>
              {active.price}
            </span>
            <button className={styles.addCartBtn}>🛒 เพิ่มลงตะกร้า</button>
            <button className={styles.detailBtn}>ดูรายละเอียด →</button>
          </div>
        </div>
      </div>

      {/* Arc carousel */}
      <div className={styles.arenaWrapper}>
        <div className={styles.arena}>
          {FEATURED_MODS.map((mod, i) => (
            <div
              key={mod.id}
              style={getCardStyle(i)}
              onClick={() => i !== activeIndex && setActiveIndex(i)}
              className={`${styles.arcCard} ${i === activeIndex ? styles.arcCardActive : ''}`}
            >
              <div className={styles.arcCardEmoji}>{mod.image}</div>
              <div className={styles.arcCardGame}>{mod.game}</div>
              <div className={styles.arcCardTitle}>{mod.title}</div>
              {i === activeIndex && <div className={styles.activeRing} />}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          className={`${styles.navArrow} ${styles.navLeft}`}
          onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
          disabled={activeIndex === 0}
        >
          ‹
        </button>
        <button
          className={`${styles.navArrow} ${styles.navRight}`}
          onClick={() => setActiveIndex(i => Math.min(FEATURED_MODS.length - 1, i + 1))}
          disabled={activeIndex === FEATURED_MODS.length - 1}
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {FEATURED_MODS.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
