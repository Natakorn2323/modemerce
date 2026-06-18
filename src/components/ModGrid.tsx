'use client'

import { useEffect, useState } from 'react'
import ModCard from './ModCard'
import styles from './ModGrid.module.css'


interface Mod {
  id: string
  title: string
  game: string
  category: string
  price: number
  is_free: boolean
  thumbnail_url: string | null
  downloads: number
  profiles: { display_name: string } | null
}

export default function ModGrid() {
  const [mods, setMods] = useState<Mod[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('ทั้งหมด')

  useEffect(() => {
    fetchMods()
  }, [])

  async function fetchMods() {
    const res = await fetch('/api/mods')
    const json = await res.json()
    setMods(json.mods || [])
    setLoading(false)
  }

  const filtered = mods.filter(m => {
    if (activeFilter === 'ทั้งหมด') return true
    if (activeFilter === 'Free') return m.is_free
    return m.category === activeFilter
  })

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className="section-title">🎮 Mods ล่าสุด</h2>
        <div className={styles.filters}>
          {['ทั้งหมด', 'Graphics', 'Gameplay', 'Performance', 'Content', 'Free'].map(f => (
            <button
              key={f}
              className={`${styles.filter} ${activeFilter === f ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          กำลังโหลด...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          ยังไม่มี Mod ในหมวดนี้
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(mod => (
            <ModCard
              key={mod.id}
              id={mod.id}
              title={mod.title}
              game={mod.game}
              category={mod.category}
              price={mod.is_free ? 'Free' : `฿${mod.price}`}
              downloads={mod.downloads.toString()}
              seller={mod.profiles?.display_name || 'Unknown'}
              thumbnailUrl={mod.thumbnail_url}
            />
          ))}
        </div>
      )}

      <div className={styles.more}>
        <button className={styles.moreBtn}>
          ดู Mods เพิ่มเติม
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </section>
  )
}