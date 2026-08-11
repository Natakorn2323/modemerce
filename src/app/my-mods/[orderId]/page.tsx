'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MyModPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('mv_user')
    if (!raw) { router.push('/auth/login'); return }
    fetchOrder()
  }, [])

  async function fetchOrder() {
    const res  = await fetch(`/api/user/orders/detail?orderId=${orderId}`)
    const data = await res.json()
    if (!data.order) { router.push('/dashboard'); return }
    setOrder(data.order)
    setLoading(false)
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#06060f', display:'flex', alignItems:'center', justifyContent:'center', color:'#a855f7', fontFamily:'system-ui' }}>
      กำลังโหลด...
    </div>
  )

  // ใช้ข้อมูลจาก mod จริง หรือ snapshot ถ้า mod ถูกลบ
  const mod = order.mods || order.mod_snapshot

  if (!mod) return (
    <div style={{ minHeight:'100vh', background:'#06060f', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui' }}>
      <div style={{ textAlign:'center', color:'#9ca3af' }}>
        <div style={{ fontSize:'3rem', marginBottom:12 }}>📦</div>
        <p>ไม่พบข้อมูล Mod</p>
        <Link href="/dashboard" style={{ color:'#a855f7' }}>กลับ Dashboard</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#06060f', color:'#f1f0ff', fontFamily:'system-ui' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', background:'rgba(13,13,26,.9)', borderBottom:'1px solid rgba(124,58,237,.2)', position:'sticky', top:0, zIndex:50 }}>
        <Link href="/dashboard" style={{ fontSize:'.85rem', color:'#9ca3af', textDecoration:'none' }}>← Dashboard</Link>
        <span style={{ fontFamily:'monospace', fontSize:'.95rem', fontWeight:800 }}>⬡ MOD<span style={{ color:'#a855f7' }}>MERCE</span></span>
        {!order.mod_id && (
          <span style={{ fontSize:'.75rem', color:'#f59e0b', background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.3)', padding:'4px 10px', borderRadius:6 }}>
            Mod ถูกลบแล้ว (ยังเข้าถึงได้)
          </span>
        )}
      </div>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'36px 24px', display:'flex', flexDirection:'column', gap:24 }}>

        {/* Mod Info */}
        <div style={{ display:'flex', gap:16, background:'#111124', border:'1px solid rgba(124,58,237,.2)', borderRadius:14, padding:'20px' }}>
          <div style={{ width:80, height:80, borderRadius:10, overflow:'hidden', background:'linear-gradient(135deg,#0d0d1a,#2d1458)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {mod.thumbnail_url
              ? <img src={mod.thumbnail_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <span style={{ fontSize:'2rem' }}>🎮</span>
            }
          </div>
          <div>
            <div style={{ fontSize:'.7rem', fontWeight:700, color:'#a855f7', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4 }}>{mod.game}</div>
            <h1 style={{ fontSize:'1.3rem', fontWeight:900, marginBottom:6 }}>{mod.title}</h1>
            <div style={{ display:'flex', gap:8 }}>
              <span style={{ fontSize:'.72rem', color:'#a855f7', background:'rgba(124,58,237,.12)', padding:'2px 8px', borderRadius:3 }}>{mod.category}</span>
              <span style={{ fontSize:'.78rem', fontWeight:700, color:'#22c55e' }}>✅ ซื้อแล้ว</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {mod.description && (
          <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, padding:'20px 22px' }}>
            <h2 style={{ fontSize:'.88rem', fontWeight:700, color:'#a855f7', marginBottom:12, letterSpacing:'.06em', textTransform:'uppercase' }}>รายละเอียด</h2>
            <p style={{ fontSize:'.88rem', color:'#9ca3af', lineHeight:1.7 }}>{mod.description}</p>
          </div>
        )}

        {/* Install Guide — ปลดล็อคเพราะซื้อแล้ว */}
        {mod.install_guide && (
          <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, padding:'20px 22px' }}>
            <h2 style={{ fontSize:'.88rem', fontWeight:700, color:'#a855f7', marginBottom:12, letterSpacing:'.06em', textTransform:'uppercase' }}>📋 วิธีการติดตั้ง</h2>
            <pre style={{ fontSize:'.85rem', color:'#9ca3af', lineHeight:1.8, whiteSpace:'pre-wrap', fontFamily:'system-ui' }}>
              {mod.install_guide}
            </pre>
          </div>
        )}

        {/* Download */}
        {mod.mod_file_url && (
          <div style={{ background:'#111124', border:'1px solid rgba(34,197,94,.3)', borderRadius:14, padding:'20px 22px' }}>
            <h2 style={{ fontSize:'.88rem', fontWeight:700, color:'#22c55e', marginBottom:12, letterSpacing:'.06em', textTransform:'uppercase' }}>📦 ไฟล์ Mod</h2>
            <a href={mod.mod_file_url} download style={{
              display:'inline-flex', alignItems:'center', gap:8,
              fontSize:'.9rem', fontWeight:700, color:'#fff',
              background:'linear-gradient(135deg,#16a34a,#22c55e)',
              textDecoration:'none', padding:'11px 24px', borderRadius:8,
              boxShadow:'0 0 16px rgba(34,197,94,.3)',
            }}>
              ⬇️ ดาวน์โหลดไฟล์ Mod
            </a>
          </div>
        )}

      </div>
    </div>
  )
}