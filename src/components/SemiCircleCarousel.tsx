'use client'

import { useState, useEffect } from 'react'
import styles from './SemiCircleCarousel.module.css'


interface ModItem {
  id: string
  title: string
  game: string
  category: string
  price: number
  is_free: boolean
  thumbnail_url: string | null
  description: string
  downloads: number
  install_guide: string
  profiles: { display_name: string } | null
}

export default function SemiCircleCarousel() {
  const [mods, setMods] = useState<ModItem[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatured()
  }, [])

  async function fetchFeatured() {
    const res = await fetch('/api/mods/featured')
    const json = await res.json()
    const data = json.mods || []

    if (data.length > 0) {
      setMods(data)
      setActiveIndex(Math.floor(data.length /2))

    }
    setLoading(false)
  }

  if (loading) return (
    <section style={{ padding:'60px 24px', textAlign:'center', color:'var(--text-muted)' }}>
      กำลังโหลด Mods แนะนำ...
    </section>
  )

  if (mods.length === 0) return (
    <section style={{ padding:'60px 24px', textAlign:'center', color:'var(--text-muted)' }}>
      ยังไม่มี Mod แนะนำ
    </section>
  )

  const active = mods[activeIndex]
  const count  = mods.length
  const R      = 340

  function getCardStyle(i: number): React.CSSProperties {
    const offset      = i - activeIndex
    const maxOffset   = Math.floor(count / 2)
    const clamped     = Math.max(-maxOffset, Math.min(maxOffset, offset))
    const angleDeg    = 270 + clamped * (130 / count)
    const angleRad    = (angleDeg * Math.PI) / 180
    const x           = R * Math.cos(angleRad)
    const y           = R * Math.sin(angleRad)
    const isActive    = i === activeIndex
    const dist        = Math.abs(offset)
    const scale       = isActive ? 1 : Math.max(0.6, 1 - dist * 0.13)
    const opacity     = isActive ? 1 : Math.max(0.2, 1 - dist * 0.28)
    const rotateZ     = isActive ? 0 : clamped * 8
    const zIndex      = isActive ? 10 : 10 - dist

    return {
      position:   'absolute',
      left:       `calc(50% + ${x}px - 100px)`,
      top:        `calc(50% + ${y}px - 130px)`,
      width:      '200px',
      transform:  `scale(${scale}) rotateZ(${rotateZ}deg)`,
      opacity,
      zIndex,
      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      cursor:     isActive ? 'default' : 'pointer',
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className="section-title">✨ Mod แนะนำ</h2>
        <p className={styles.subtitle}>อัปเดตล่าสุด</p>
      </div>

      {/* Active detail */}
      <div className={styles.activeDetail}>
        <div className={styles.activeImage}>
          {active.thumbnail_url
            ? <img src={active.thumbnail_url} alt={active.title} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:12 }} />
            : '🎮'
          }
        </div>
        <div className={styles.activeInfo}>
          <div className={styles.activeMeta}>
            <span className={styles.activeCategory}>{active.category}</span>
            <span className={styles.activeGame}>{active.game}</span>
          </div>
          <h3 className={styles.activeTitle}>{active.title}</h3>
          <p className={styles.activeDesc}>{active.description?.slice(0, 100)}...</p>
          <div className={styles.activeStats}>
            <span>⬇️ {active.downloads}</span>
            <span>by {active.profiles?.display_name}</span>
          </div>
          <div className={styles.activeActions}>
            <span className={active.is_free ? styles.freeTag : styles.priceTag}>
              {active.is_free ? 'Free' : `฿${active.price}`}
            </span>
            <a href={`/mods/${active.id}`} className={styles.detailBtn}>
              ดูรายละเอียด →
            </a>
          </div>
        </div>
      </div>

      {/* Arc */}
      <div className={styles.arenaWrapper}>
        <div className={styles.arena}>
          {mods.map((mod, i) => (
            <div
              key={mod.id}
              style={getCardStyle(i)}
              onClick={() => i !== activeIndex && setActiveIndex(i)}
              className={`${styles.arcCard} ${i === activeIndex ? styles.arcCardActive : ''}`}
            >
              <div className={styles.arcCardEmoji}>
                {mod.thumbnail_url
                  ? <img src={mod.thumbnail_url} alt={mod.title} style={{ width:50, height:50, objectFit:'cover', borderRadius:8 }} />
                  : '🎮'
                }
              </div>
              <div className={styles.arcCardGame}>{mod.game}</div>
              <div className={styles.arcCardTitle}>{mod.title}</div>
              {i === activeIndex && <div className={styles.activeRing} />}
            </div>
          ))}
        </div>

        <button
          className={`${styles.navArrow} ${styles.navLeft}`}
          onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
          disabled={activeIndex === 0}
        >‹</button>
        <button
          className={`${styles.navArrow} ${styles.navRight}`}
          onClick={() => setActiveIndex(i => Math.min(mods.length - 1, i + 1))}
          disabled={activeIndex === mods.length - 1}
        >›</button>
      </div>

      <div className={styles.dots}>
        {mods.map((_, i) => (
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