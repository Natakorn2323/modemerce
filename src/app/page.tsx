import Navbar from '@/src/components/Navbar'
import HeroSection from '@/src/components/HeroSection'
import SemiCircleCarousel from '@/src/components/SemiCircleCarousel'
import ModGrid from '@/src/components/ModGrid'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SemiCircleCarousel />
        <ModGrid />
      </main>

      <footer className={styles.footer}>
        © 2025 ModMerce — Game Mod Marketplace · All rights reserved
      </footer>
    </>
  )
}
