import styles from './ModCard.module.css'

interface ModCardProps {
  title: string
  game: string
  emoji: string
  price: string
  rating: number
  downloads: string
  category: string
  seller: string
}

export default function ModCard({
  title, game, emoji, price, rating, downloads, category, seller
}: ModCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.thumb}>
        <span className={styles.emoji}>{emoji}</span>
        <span className={styles.categoryTag}>{category}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.game}>{game}</div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.seller}>by {seller}</div>

        <div className={styles.meta}>
          <span className={styles.rating}>⭐ {rating}</span>
          <span className={styles.downloads}>⬇️ {downloads}</span>
        </div>

        <div className={styles.footer}>
          <span className={price === 'Free' ? styles.free : styles.price}>{price}</span>
          <button className={styles.cartBtn}>+ Cart</button>
        </div>
      </div>
    </div>
  )
}
