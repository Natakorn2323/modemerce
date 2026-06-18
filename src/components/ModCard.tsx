import styles from './ModCard.module.css'
import Link from 'next/link'

interface ModCardProps {
  id: string
  title: string
  game: string
  category: string
  price: string
  downloads: string
  seller: string
  thumbnailUrl: string | null
}

export default function ModCard({
  id, title, game, category, price, downloads, seller, thumbnailUrl
}: ModCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.thumb}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span className={styles.emoji}>🎮</span>
        )}
        <span className={styles.categoryTag}>{category}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.game}>{game}</div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.seller}>by {seller}</div>
        <div className={styles.meta}>
          <span className={styles.downloads}>⬇️ {downloads}</span>
        </div>
        <div className={styles.footer}>
          <span className={price === 'Free' ? styles.free : styles.price}>
            {price}
          </span>
          <Link href={`/mods/${id}`} className={styles.cartBtn}>
            {price === 'Free' ? '⬇️ ดาวน์โหลด' : '🛒 ซื้อ'}
          </Link>
        </div>
      </div>
    </div>
  )
}