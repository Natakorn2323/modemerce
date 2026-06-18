'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import OrderModal from '@/components/OrderModal'

export default function ModDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [mod, setMod] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showOrder, setShowOrder] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const raw = localStorage.getItem('mv_user')
    if (raw) setUser(JSON.parse(raw))
    fetchMod()
  }, [])

  async function fetchMod() {
    const { data } = await supabase
      .from('mods')
      .select('*, profiles(display_name)')
      .eq('id', id)
      .single()

    if (!data) { router.push('/'); return }
    setMod(data)

    // ดึง seller bank info
    const { data: sellerData } = await supabase
      .from('seller_profiles')
      .select('bank_name, bank_account, account_name, qr_code_url')
      .eq('id', data.seller_id)
      .single()

    setSeller(sellerData)
    setLoading(false)
  }

  function handleBuy() {
    if (!user) { router.push('/auth/login'); return }
    setShowOrder(true)
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#06060f', display:'flex', alignItems:'center', justifyContent:'center', color:'#a855f7', fontFamily:'system-ui' }}>
      กำลังโหลด...
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#06060f', color:'#f1f0ff', fontFamily:'system-ui' }}>

      {/* Navbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', background:'rgba(13,13,26,.9)', borderBottom:'1px solid rgba(124,58,237,.2)', position:'sticky', top:0, zIndex:50 }}>
        <Link href="/" style={{ fontSize:'.85rem', color:'#9ca3af', textDecoration:'none' }}>← กลับหน้าหลัก</Link>
        <span style={{ fontFamily:'monospace', fontSize:'.95rem', fontWeight:800 }}>⬡ MOD<span style={{ color:'#a855f7' }}>MERCE</span></span>
        {user
          ? <span style={{ fontSize:'.82rem', color:'#a855f7' }}>👤 {user.displayName}</span>
          : <Link href="/auth/login" style={{ fontSize:'.82rem', color:'#c084fc', textDecoration:'none' }}>Sign In</Link>
        }
      </div>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'36px 24px', display:'grid', gridTemplateColumns:'1fr 360px', gap:32, alignItems:'start' }}>

        {/* Left — Mod Info */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

          {/* Thumbnail */}
          <div style={{ borderRadius:16, overflow:'hidden', background:'linear-gradient(135deg,#0d0d1a,#2d1458)', aspectRatio:'16/9', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {mod.thumbnail_url
              ? <img src={mod.thumbnail_url} alt={mod.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <span style={{ fontSize:'6rem' }}>🎮</span>
            }
          </div>

          {/* Tags */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:'.72rem', fontWeight:700, color:'#a855f7', background:'rgba(124,58,237,.15)', border:'1px solid rgba(168,85,247,.4)', padding:'3px 10px', borderRadius:4 }}>{mod.category}</span>
            <span style={{ fontSize:'.72rem', fontWeight:700, color:'#4b5563', background:'rgba(255,255,255,.04)', padding:'3px 10px', borderRadius:4 }}>{mod.game}</span>
            {mod.tags?.map((t: string) => (
              <span key={t} style={{ fontSize:'.72rem', color:'#4b5563', background:'rgba(255,255,255,.03)', padding:'3px 10px', borderRadius:4 }}>#{t}</span>
            ))}
          </div>

          {/* Description */}
          <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, padding:'20px 22px' }}>
            <h2 style={{ fontSize:'.88rem', fontWeight:700, color:'#a855f7', marginBottom:12, letterSpacing:'.06em', textTransform:'uppercase' }}>รายละเอียด</h2>
            <p style={{ fontSize:'.88rem', color:'#9ca3af', lineHeight:1.7 }}>{mod.description}</p>
          </div>

          {/* Requirements */}
          {mod.requirements && (
            <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, padding:'20px 22px' }}>
              <h2 style={{ fontSize:'.88rem', fontWeight:700, color:'#a855f7', marginBottom:12, letterSpacing:'.06em', textTransform:'uppercase' }}>System Requirements</h2>
              <pre style={{ fontSize:'.85rem', color:'#9ca3af', lineHeight:1.7, whiteSpace:'pre-wrap', fontFamily:'system-ui' }}>{mod.requirements}</pre>
            </div>
          )}

          {/* Install Guide — เบลอถ้าไม่ได้ซื้อ */}
          <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, padding:'20px 22px', position:'relative', overflow:'hidden' }}>
            <h2 style={{ fontSize:'.88rem', fontWeight:700, color:'#a855f7', marginBottom:12, letterSpacing:'.06em', textTransform:'uppercase' }}>
              📋 วิธีการติดตั้ง
            </h2>
            <div style={{ filter: mod.is_free ? 'none' : 'blur(6px)', userSelect: mod.is_free ? 'auto' : 'none', pointerEvents: mod.is_free ? 'auto' : 'none' }}>
              <pre style={{ fontSize:'.85rem', color:'#9ca3af', lineHeight:1.8, whiteSpace:'pre-wrap', fontFamily:'system-ui' }}>
                {mod.install_guide}
              </pre>
            </div>
            {!mod.is_free && (
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(6,6,15,.6)', backdropFilter:'blur(2px)' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'1.5rem', marginBottom:8 }}>🔒</div>
                  <p style={{ fontSize:'.85rem', fontWeight:700, color:'#c084fc' }}>ซื้อ Mod เพื่อดูวิธีติดตั้ง</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right — Buy Panel */}
        <div style={{ position:'sticky', top:80 }}>
          <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.25)', borderRadius:16, overflow:'hidden' }}>

            {/* Thumbnail small */}
            <div style={{ padding:'20px 20px 0' }}>
              <div style={{ fontSize:'.7rem', fontWeight:700, color:'#a855f7', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>{mod.game}</div>
              <h1 style={{ fontSize:'1.2rem', fontWeight:900, lineHeight:1.2, marginBottom:8 }}>{mod.title}</h1>
              <p style={{ fontSize:'.8rem', color:'#9ca3af', marginBottom:12 }}>{mod.description?.slice(0, 80)}...</p>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <span style={{ fontSize:'.78rem', color:'#9ca3af' }}>by {mod.profiles?.display_name}</span>
                <span style={{ fontSize:'.75rem', color:'#4b5563' }}>⬇️ {mod.downloads}</span>
              </div>
            </div>

            <div style={{ padding:'0 20px 20px', display:'flex', flexDirection:'column', gap:12 }}>
              {/* Price */}
              <div style={{ background:'rgba(124,58,237,.08)', border:'1px solid rgba(124,58,237,.2)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:'.85rem', color:'#9ca3af' }}>ราคา</span>
                <span style={{ fontSize:'1.4rem', fontWeight:900, color: mod.is_free ? '#22c55e' : '#c084fc' }}>
                  {mod.is_free ? 'Free' : `฿${mod.price}`}
                </span>
              </div>

              {/* Buy Button */}
              <button onClick={handleBuy} style={{
                width:'100%', fontSize:'.95rem', fontWeight:700,
                color:'#fff', border:'none', padding:'13px',
                borderRadius:10, cursor:'pointer',
                background: mod.is_free
                  ? 'linear-gradient(135deg,#16a34a,#22c55e)'
                  : 'linear-gradient(135deg,#7c3aed,#a855f7)',
                boxShadow: mod.is_free
                  ? '0 0 20px rgba(34,197,94,.3)'
                  : '0 0 20px rgba(168,85,247,.35)',
              }}>
                {mod.is_free ? '⬇️ ดาวน์โหลดฟรี' : '🛒 ซื้อ Mod นี้'}
              </button>

              <div style={{ fontSize:'.72rem', color:'#4b5563', textAlign:'center', lineHeight:1.5 }}>
                🔒 ปลอดภัย · ได้รับไฟล์ทันทีหลังชำระเงิน
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrder && (
        <OrderModal
          mod={mod}
          seller={seller}
          user={user}
          onClose={() => setShowOrder(false)}
        />
      )}
    </div>
  )
}