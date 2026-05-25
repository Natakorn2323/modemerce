import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Modmerce — Game Mod Marketplace',
  description: 'ค้นหา ดาวน์โหลด และแชร์ Game Mods คุณภาพสูงจากคอมมูนิตี้',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <div className="bg-ambient" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}