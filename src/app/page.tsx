import Navbar from '@/src/components/Navbar'
import HeroSection from '@/src/components/HeroSection'
import SemiCircleCarousel from '@/src/components/SemiCircleCarousel'
import ModGrid from '@/src/components/ModGrid'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SemiCircleCarousel />
        <ModGrid />
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
      }}>
        © 2025 ModMerce — Game Mod Marketplace · All rights reserved
      </footer>
    </>
  )
}
