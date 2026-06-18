'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, getUser } from '@/lib/supabase'

export default function SellerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalMods: 0, totalOrders: 0, totalRevenue: 0 })
  const [orders, setOrders] = useState<any[]>([])
  const [mods, setMods] = useState<any[]>([])
  const [tab, setTab] = useState<'orders' | 'mods'>('orders')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
    const u = await getUser()
    if (!u) { router.push('/auth/login'); return }
    setUser(u)
    setLoading(false)
  }
  init()
  }, [])

  async function fetchAll(uid: string) {
   
   const modsRes = await fetch(`/api/seller/mods?sellerId=${uid}`)
   const modsJson = await modsRes.json()
   const modsData = modsJson.mods || []
   console.log('Mods:', modsData)
   
   const ordersRes  = await fetch(`/api/seller/orders?sellerId=${uid}`)
   const ordersJson = await ordersRes.json()
   const ordersData = ordersJson.orders || []
   console.log('Orders:', ordersData)

   const paidOrders = ordersData.filter((o: any) => o.status === 'paid')
   const revenue = paidOrders.reduce((sum: number, o: any) => sum + Number(o.amount), 0)

   setMods(modsData || [])
   setOrders(ordersData || [])
   setStats({
    totalMods:    modsData?.length || 0,
    totalOrders:  paidOrders.length,
    totalRevenue: revenue,
   })
   setLoading(false)
  } 

  async function handleDelete(modId: string) {
    if (!confirm('ลบ Mod นี้ออกจากระบบ?')) return
    setDeleting(modId)
    await supabase.from('mods').delete().eq('id', modId)
    setMods(prev => prev.filter(m => m.id !== modId))
    setStats(prev => ({ ...prev, totalMods: prev.totalMods - 1 }))
    setDeleting(null)
  }

  async function togglePublish(mod: any) {
    await supabase
      .from('mods')
      .update({ is_published: !mod.is_published })
      .eq('id', mod.id)
    setMods(prev => prev.map(m => m.id === mod.id ? { ...m, is_published: !m.is_published } : m))
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#06060f', display:'flex', alignItems:'center', justifyContent:'center', color:'#a855f7', fontFamily:'system-ui' }}>
      กำลังโหลด...
    </div>
  )

  const statCards = [
    { icon:'🎮', label:'Mods ทั้งหมด',   value: stats.totalMods,              color:'#a855f7' },
    { icon:'🛒', label:'ออเดอร์สำเร็จ',  value: stats.totalOrders,            color:'#22c55e' },
    { icon:'💰', label:'รายได้รวม (฿)',   value: stats.totalRevenue.toLocaleString(), color:'#f59e0b' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#06060f', color:'#f1f0ff', fontFamily:'system-ui' }}>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', background:'rgba(13,13,26,.9)', borderBottom:'1px solid rgba(124,58,237,.2)', position:'sticky', top:0, zIndex:50 }}>
        <Link href="/seller" style={{ fontSize:'.82rem', color:'#9ca3af', textDecoration:'none' }}>← Seller Portal</Link>
        <span style={{ fontFamily:'monospace', fontSize:'.95rem', fontWeight:800 }}>⬡ MOD<span style={{ color:'#a855f7' }}>MERCE</span> — Dashboard</span>
        <span style={{ fontSize:'.82rem', color:'#a855f7' }}>👤 {user?.displayName}</span>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px', display:'flex', flexDirection:'column', gap:24 }}>

        {/* Stat Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {statCards.map((s, i) => (
            <div key={i} style={{ background:'#111124', border:'1px solid rgba(124,58,237,.2)', borderRadius:14, padding:'20px 22px', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:52, height:52, background:'rgba(124,58,237,.1)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize:'1.6rem', fontWeight:900, color:s.color, fontFamily:'monospace' }}>{s.value}</div>
                <div style={{ fontSize:'.78rem', color:'#9ca3af', marginTop:2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, background:'#0d0d1a', borderRadius:10, padding:4, width:'fit-content' }}>
          {(['orders', 'mods'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontSize:'.85rem', fontWeight:700, padding:'8px 24px',
              borderRadius:8, border:'none', cursor:'pointer', transition:'all .2s',
              background: tab === t ? '#111124' : 'transparent',
              color: tab === t ? '#c084fc' : '#4b5563',
              boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,.3)' : 'none',
            }}>
              {t === 'orders' ? '🛒 ออเดอร์' : '🎮 Mods ของฉัน'}
            </button>
          ))}
        </div>

        {/* ── Orders Tab ── */}
        {tab === 'orders' && (
          <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, overflow:'hidden' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(124,58,237,.12)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h2 style={{ fontSize:'.95rem', fontWeight:800 }}>ออเดอร์ทั้งหมด</h2>
              <span style={{ fontSize:'.75rem', color:'#4b5563' }}>{orders.length} รายการ</span>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px', color:'#4b5563', fontSize:'.88rem' }}>
                ยังไม่มีออเดอร์
              </div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(124,58,237,.12)' }}>
                      {['Mod', 'Buyer', 'จำนวน', 'สถานะ', 'วันที่'].map(h => (
                        <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:'.72rem', fontWeight:700, color:'#4b5563', letterSpacing:'.06em', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={o.id} style={{ borderBottom: i < orders.length-1 ? '1px solid rgba(124,58,237,.07)' : 'none' }}>
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:36, height:36, borderRadius:6, background:'linear-gradient(135deg,#0d0d1a,#2d1458)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0, overflow:'hidden' }}>
                              {o.mods?.thumbnail_url
                                ? <img src={o.mods.thumbnail_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                : '🎮'}
                            </div>
                            <span style={{ fontSize:'.82rem', fontWeight:600, color:'#f1f0ff' }}>{o.mods?.title || '-'}</span>
                          </div>
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:'.82rem', color:'#9ca3af' }}>
                          {o.profiles?.display_name || '-'}
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:'.88rem', fontWeight:700, color:'#c084fc', fontFamily:'monospace' }}>
                          ฿{Number(o.amount).toLocaleString()}
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{
                            fontSize:'.72rem', fontWeight:700, padding:'3px 10px', borderRadius:99,
                            background: o.status === 'paid' ? 'rgba(34,197,94,.12)' : 'rgba(245,158,11,.12)',
                            color: o.status === 'paid' ? '#22c55e' : '#f59e0b',
                            border: `1px solid ${o.status === 'paid' ? 'rgba(34,197,94,.3)' : 'rgba(245,158,11,.3)'}`,
                          }}>
                            {o.status === 'paid' ? '✅ สำเร็จ' : '⏳ รอชำระ'}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:'.78rem', color:'#4b5563' }}>
                          {new Date(o.created_at).toLocaleDateString('th-TH')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Mods Tab ── */}
        {tab === 'mods' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h2 style={{ fontSize:'.95rem', fontWeight:800 }}>Mods ของฉัน ({mods.length})</h2>
              <Link href="/seller/mod/new" style={{
                fontSize:'.82rem', fontWeight:700, color:'#fff',
                background:'linear-gradient(135deg,#7c3aed,#a855f7)',
                textDecoration:'none', padding:'8px 18px', borderRadius:8,
              }}>
                ➕ ลง Mod ใหม่
              </Link>
            </div>

            {mods.length === 0 ? (
              <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, textAlign:'center', padding:'48px', color:'#4b5563', fontSize:'.88rem' }}>
                ยังไม่มี Mod — <Link href="/seller/mod/new" style={{ color:'#a855f7' }}>ลงตัวแรก</Link>
              </div>
            ) : (
              mods.map(mod => (
                <div key={mod.id} style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:12, padding:'16px 18px', display:'flex', alignItems:'center', gap:14 }}>

                  {/* Thumbnail */}
                  <div style={{ width:56, height:56, borderRadius:8, background:'linear-gradient(135deg,#0d0d1a,#2d1458)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0, overflow:'hidden' }}>
                    {mod.thumbnail_url ? <img src={mod.thumbnail_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🎮'}
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'.92rem', fontWeight:800, color:'#f1f0ff', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {mod.title}
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'.7rem', color:'#a855f7', background:'rgba(124,58,237,.12)', padding:'2px 8px', borderRadius:3 }}>{mod.category}</span>
                      <span style={{ fontSize:'.7rem', color:'#4b5563' }}>{mod.game}</span>
                      <span style={{ fontSize:'.75rem', fontWeight:700, color: mod.is_free ? '#22c55e' : '#c084fc' }}>
                        {mod.is_free ? 'Free' : `฿${mod.price}`}
                      </span>
                      <span style={{ fontSize:'.7rem', color:'#4b5563' }}>⬇️ {mod.downloads}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    {/* Publish toggle */}
                    <button onClick={() => togglePublish(mod)} style={{
                      fontSize:'.72rem', fontWeight:700, padding:'5px 12px', borderRadius:6, cursor:'pointer', border:'1px solid',
                      borderColor: mod.is_published ? 'rgba(34,197,94,.4)' : 'rgba(124,58,237,.3)',
                      background: mod.is_published ? 'rgba(34,197,94,.1)' : 'rgba(124,58,237,.08)',
                      color: mod.is_published ? '#22c55e' : '#9ca3af',
                    }}>
                      {mod.is_published ? '✅ เผยแพร่' : '⏸ ซ่อน'}
                    </button>

                    {/* Edit */}
                    <Link href={`/seller/mod/${mod.id}/edit`} style={{
                      fontSize:'.72rem', fontWeight:700, color:'#c084fc',
                      background:'rgba(124,58,237,.1)', border:'1px solid rgba(124,58,237,.25)',
                      padding:'5px 12px', borderRadius:6, textDecoration:'none',
                    }}>
                      ✏️ แก้ไข
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(mod.id)}
                      disabled={deleting === mod.id}
                      style={{
                        fontSize:'.72rem', fontWeight:700, padding:'5px 12px', borderRadius:6, cursor:'pointer',
                        border:'1px solid rgba(239,68,68,.3)',
                        background:'rgba(239,68,68,.08)', color:'#f87171',
                        opacity: deleting === mod.id ? .5 : 1,
                      }}>
                      {deleting === mod.id ? '...' : '🗑 ลบ'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}