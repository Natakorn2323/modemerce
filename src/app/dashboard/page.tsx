'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending'>('all')

  useEffect(() => {
    const raw = localStorage.getItem('mv_user')
    if (!raw) { router.push('/auth/login'); return }
    const u = JSON.parse(raw)
    setUser(u)
    fetchOrders(u.id)
  }, [])

  async function fetchOrders(uid: string) {
    const res  = await fetch(`/api/user/orders?buyerId=${uid}`)
    const json = await res.json()
    setOrders(json.orders || [])
    setLoading(false)
  }

  const filtered = orders.filter(o => {
    if (activeTab === 'all')     return true
    if (activeTab === 'paid')    return o.status === 'paid'
    if (activeTab === 'pending') return o.status === 'pending'
    return true
  })

  const totalSpent = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + Number(o.amount), 0)

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#06060f', display:'flex', alignItems:'center', justifyContent:'center', color:'#a855f7', fontFamily:'system-ui' }}>
      กำลังโหลด...
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#06060f', color:'#f1f0ff', fontFamily:'system-ui' }}>

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', background:'rgba(13,13,26,.9)', borderBottom:'1px solid rgba(124,58,237,.2)', position:'sticky', top:0, zIndex:50 }}>
        <Link href="/" style={{ fontSize:'.82rem', color:'#9ca3af', textDecoration:'none' }}>← หน้าหลัก</Link>
        <span style={{ fontFamily:'monospace', fontSize:'.95rem', fontWeight:800 }}>⬡ MOD<span style={{ color:'#a855f7' }}>MERCE</span> — My Dashboard</span>
        <span style={{ fontSize:'.82rem', color:'#a855f7' }}>👤 {user?.displayName}</span>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 24px', display:'flex', flexDirection:'column', gap:24 }}>

        {/* Welcome */}
        <div style={{ background:'linear-gradient(135deg,rgba(45,20,88,.6),rgba(13,13,26,.8))', border:'1px solid rgba(168,85,247,.35)', borderRadius:16, padding:'24px 28px', display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:56, height:56, background:'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0, boxShadow:'0 0 20px rgba(168,85,247,.4)' }}>
            👤
          </div>
          <div>
            <h1 style={{ fontSize:'1.2rem', fontWeight:800, marginBottom:4 }}>
              สวัสดี, {user?.displayName}
            </h1>
            <p style={{ fontSize:'.82rem', color:'#9ca3af' }}>
              {user?.email}
            </p>
          </div>
          <Link href="/seller" style={{ marginLeft:'auto', fontSize:'.82rem', fontWeight:700, color:'#c084fc', background:'rgba(124,58,237,.12)', border:'1px solid rgba(168,85,247,.35)', padding:'8px 18px', borderRadius:8, textDecoration:'none' }}>
            ⚡ Seller Portal →
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            { icon:'🛒', label:'Mods ที่ซื้อทั้งหมด', value: orders.filter(o => o.status === 'paid').length, color:'#a855f7' },
            { icon:'💰', label:'ยอดใช้จ่ายรวม (฿)',  value: totalSpent.toLocaleString(),                    color:'#f59e0b' },
            { icon:'⏳', label:'รอชำระเงิน',          value: orders.filter(o => o.status === 'pending').length, color:'#9ca3af' },
          ].map((s, i) => (
            <div key={i} style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, padding:'18px 20px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:44, height:44, background:'rgba(124,58,237,.1)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize:'1.4rem', fontWeight:900, color:s.color, fontFamily:'monospace' }}>{s.value}</div>
                <div style={{ fontSize:'.72rem', color:'#4b5563', marginTop:2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div>
          <div style={{ display:'flex', gap:0, background:'#0d0d1a', borderRadius:10, padding:4, width:'fit-content', marginBottom:16 }}>
            {([['all','ทั้งหมด'],['paid','ซื้อแล้ว'],['pending','รอชำระ']] as const).map(([val, label]) => (
              <button key={val} onClick={() => setActiveTab(val)} style={{
                fontSize:'.82rem', fontWeight:700, padding:'7px 20px',
                borderRadius:8, border:'none', cursor:'pointer', transition:'all .2s',
                background: activeTab === val ? '#111124' : 'transparent',
                color:      activeTab === val ? '#c084fc'  : '#4b5563',
                boxShadow:  activeTab === val ? '0 2px 8px rgba(0,0,0,.3)' : 'none',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filtered.length === 0 ? (
            <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:14, textAlign:'center', padding:'56px 24px' }}>
              <div style={{ fontSize:'3rem', marginBottom:12 }}>🎮</div>
              <p style={{ fontSize:'.88rem', color:'#4b5563', marginBottom:16 }}>
                {activeTab === 'all' ? 'ยังไม่มีประวัติการซื้อ' : activeTab === 'paid' ? 'ยังไม่มี Mod ที่ซื้อ' : 'ไม่มีรายการรอชำระ'}
              </p>
              <Link href="/" style={{ fontSize:'.88rem', fontWeight:700, color:'#fff', background:'linear-gradient(135deg,#7c3aed,#a855f7)', textDecoration:'none', padding:'10px 24px', borderRadius:8 }}>
                ไปดู Mods →
              </Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {filtered.map(order => (
                <div key={order.id} style={{ background:'#111124', border:'1px solid rgba(124,58,237,.18)', borderRadius:12, padding:'16px 18px', display:'flex', alignItems:'center', gap:14 }}>

                  {/* Thumbnail */}
                  <div style={{ width:56, height:56, borderRadius:8, background:'linear-gradient(135deg,#0d0d1a,#2d1458)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0, overflow:'hidden' }}>
                    {order.mods?.thumbnail_url
                      ? <img src={order.mods.thumbnail_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : '🎮'
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'.92rem', fontWeight:800, color:'#f1f0ff', marginBottom:3 }}>
                      {order.mods?.title || 'ไม่ทราบชื่อ'}
                    </div>
                    <div style={{ fontSize:'.75rem', color:'#4b5563' }}>
                      {new Date(order.created_at).toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric' })}
                    </div>
                  </div>

                  {/* Amount */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:'1rem', fontWeight:800, color:'#c084fc', fontFamily:'monospace', marginBottom:4 }}>
                      {Number(order.amount) === 0 ? 'Free' : `฿${Number(order.amount).toLocaleString()}`}
                    </div>
                    <span style={{
                      fontSize:'.7rem', fontWeight:700, padding:'3px 10px', borderRadius:99,
                      background: order.status === 'paid' ? 'rgba(34,197,94,.12)'  : 'rgba(245,158,11,.12)',
                      color:      order.status === 'paid' ? '#22c55e'              : '#f59e0b',
                      border:     `1px solid ${order.status === 'paid' ? 'rgba(34,197,94,.3)' : 'rgba(245,158,11,.3)'}`,
                    }}>
                      {order.status === 'paid' ? '✅ สำเร็จ' : '⏳ รอชำระ'}
                    </span>
                  </div>

                  {/* Action */}
                  {order.status === 'paid' && (
                    <Link href={`/mods/${order.mod_id}`} style={{ fontSize:'.75rem', fontWeight:700, color:'#c084fc', background:'rgba(124,58,237,.1)', border:'1px solid rgba(124,58,237,.25)', padding:'7px 14px', borderRadius:8, textDecoration:'none', flexShrink:0, whiteSpace:'nowrap' }}>
                      ดู Mod →
                    </Link>
                  )}

                  {order.status === 'pending' && (
                    <Link href={`/mods/${order.mod_id}`} style={{ fontSize:'.75rem', fontWeight:700, color:'#f59e0b', background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.3)', padding:'7px 14px', borderRadius:8, textDecoration:'none', flexShrink:0, whiteSpace:'nowrap' }}>
                      ชำระเงิน →
                    </Link>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}