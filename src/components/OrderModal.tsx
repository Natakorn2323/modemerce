'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  mod: any
  seller: any
  user: any
  onClose: () => void
}

export default function OrderModal({ mod, seller, user, onClose }: Props) {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'creating' | 'waiting' | 'paid' | 'error'>('idle')
  const [unlocked, setUnlocked] = useState(false)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  // ถ้า mod ฟรี — ปลดล็อคทันที
  useEffect(() => {
    if (mod.is_free) setUnlocked(true)
  }, [])

  // สร้าง Order
  async function createOrder() {
    setStatus('creating')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modId:    mod.id,
          sellerId: mod.seller_id,
          amount:   mod.price,
          buyerId:  user.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrderId(data.orderId)
      setStatus('waiting')
      startPolling(data.orderId)
    } catch {
      setStatus('error')
    }
  }

  // Polling ทุก 5 วินาที
  function startPolling(oid: string) {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${oid}/poll`)
        const data = await res.json()
        if (data.status === 'paid') {
          clearInterval(pollRef.current!)
          setStatus('paid')
          setUnlocked(true)
        }
      } catch {}
    }, 5000)
  }

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:200,
      background:'rgba(0,0,0,.75)', backdropFilter:'blur(6px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:16,
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div style={{
        background:'#111124', border:'1px solid rgba(168,85,247,.45)',
        borderRadius:20, width:'100%', maxWidth:560,
        maxHeight:'90vh', overflowY:'auto',
        boxShadow:'0 0 60px rgba(124,58,237,.25)',
        animation:'popIn .35s cubic-bezier(.34,1.56,.64,1)',
      }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:'1px solid rgba(124,58,237,.15)' }}>
          <h2 style={{ fontSize:'1rem', fontWeight:800 }}>🛒 สั่งซื้อ Mod</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9ca3af', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
        </div>

        <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Mod Info */}
          <div style={{ display:'flex', gap:14, background:'rgba(124,58,237,.06)', border:'1px solid rgba(124,58,237,.18)', borderRadius:12, padding:'14px 16px' }}>
            <div style={{ width:56, height:56, borderRadius:8, background:'linear-gradient(135deg,#0d0d1a,#2d1458)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0, overflow:'hidden' }}>
              {mod.thumbnail_url ? <img src={mod.thumbnail_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🎮'}
            </div>
            <div>
              <div style={{ fontSize:'.65rem', color:'#a855f7', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em' }}>{mod.game}</div>
              <div style={{ fontSize:'.95rem', fontWeight:800, marginBottom:2 }}>{mod.title}</div>
              <div style={{ fontSize:'.75rem', color:'#9ca3af' }}>by {mod.profiles?.display_name || 'Unknown'}</div>
            </div>
            <div style={{ marginLeft:'auto', textAlign:'right' }}>
              <div style={{ fontSize:'1.2rem', fontWeight:900, color: mod.is_free ? '#22c55e' : '#c084fc' }}>
                {mod.is_free ? 'Free' : `฿${mod.price}`}
              </div>
            </div>
          </div>

          {/* ── ฟรี: ปลดล็อคทันที ── */}
          {mod.is_free && (
            <div style={{ background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.3)', borderRadius:12, padding:'16px' }}>
              <div style={{ fontSize:'.88rem', fontWeight:700, color:'#22c55e', marginBottom:8 }}>✅ Mod ฟรี — ดาวน์โหลดได้เลย!</div>
              {mod.mod_file_url && (
                <a href={mod.mod_file_url} download style={{
                  display:'inline-block', fontSize:'.88rem', fontWeight:700,
                  color:'#fff', background:'linear-gradient(135deg,#16a34a,#22c55e)',
                  textDecoration:'none', padding:'10px 24px', borderRadius:8,
                  boxShadow:'0 0 16px rgba(34,197,94,.3)',
                }}>
                  ⬇️ ดาวน์โหลด Mod
                </a>
              )}
            </div>
          )}

          {/* ── มีราคา ── */}
          {!mod.is_free && (
            <>
              {/* Install guide เบลอ */}
              <div style={{ position:'relative', borderRadius:12, overflow:'hidden', border:'1px solid rgba(124,58,237,.18)' }}>
                <div style={{ padding:'14px 16px', background:'#0d0d1a' }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:'#a855f7', marginBottom:8, letterSpacing:'.06em', textTransform:'uppercase' }}>📋 วิธีการติดตั้ง</div>
                  <pre style={{
                    fontSize:'.8rem', color:'#9ca3af', lineHeight:1.7,
                    whiteSpace:'pre-wrap', fontFamily:'system-ui',
                    filter: unlocked ? 'none' : 'blur(5px)',
                    userSelect: unlocked ? 'auto' : 'none',
                  }}>
                    {mod.install_guide || 'ไม่มีข้อมูล'}
                  </pre>
                </div>
                {!unlocked && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(6,6,15,.5)', backdropFilter:'blur(2px)' }}>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:'1.4rem', marginBottom:6 }}>🔒</div>
                      <p style={{ fontSize:'.82rem', fontWeight:700, color:'#c084fc' }}>ชำระเงินเพื่อปลดล็อค</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mod file เบลอ */}
              <div style={{ position:'relative', borderRadius:12, overflow:'hidden', border:'1px solid rgba(124,58,237,.18)', padding:'14px 16px', background:'#0d0d1a' }}>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:'#a855f7', marginBottom:8, letterSpacing:'.06em', textTransform:'uppercase' }}>📦 ไฟล์ Mod</div>
                {unlocked && mod.mod_file_url ? (
                  <a href={mod.mod_file_url} download style={{
                    display:'inline-flex', alignItems:'center', gap:8,
                    fontSize:'.88rem', fontWeight:700, color:'#fff',
                    background:'linear-gradient(135deg,#16a34a,#22c55e)',
                    textDecoration:'none', padding:'10px 20px', borderRadius:8,
                  }}>
                    ⬇️ ดาวน์โหลดไฟล์ Mod
                  </a>
                ) : (
                  <div style={{ filter:'blur(4px)', fontSize:'.85rem', color:'#9ca3af' }}>
                    mod_file_v1.0.zip — 45.2 MB
                  </div>
                )}
                {!unlocked && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(6,6,15,.5)' }}>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:'1.4rem', marginBottom:6 }}>🔒</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment section */}
              {status === 'idle' && (
                <button onClick={createOrder} style={{
                  width:'100%', fontSize:'.95rem', fontWeight:700,
                  color:'#fff', background:'linear-gradient(135deg,#7c3aed,#a855f7)',
                  border:'none', padding:'13px', borderRadius:10, cursor:'pointer',
                  boxShadow:'0 0 20px rgba(168,85,247,.35)',
                }}>
                  💳 ดำเนินการชำระเงิน
                </button>
              )}

              {status === 'creating' && (
                <div style={{ textAlign:'center', padding:'20px', color:'#a855f7', fontSize:'.88rem' }}>
                  ⏳ กำลังสร้างคำสั่งซื้อ...
                </div>
              )}

              {status === 'waiting' && seller && (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ background:'rgba(124,58,237,.06)', border:'1px solid rgba(124,58,237,.2)', borderRadius:12, padding:'16px', textAlign:'center' }}>
                    <div style={{ fontSize:'.82rem', fontWeight:700, color:'#c084fc', marginBottom:12 }}>
                      💳 โอนเงิน ฿{mod.price} ไปที่
                    </div>

                    {/* QR Code */}
                    {seller.qr_code_url && (
                      <div style={{ marginBottom:14 }}>
                        <img
                          src={seller.qr_code_url}
                          alt="QR Payment"
                          style={{ width:180, height:180, objectFit:'contain', background:'white', borderRadius:12, padding:8, margin:'0 auto', display:'block' }}
                        />
                        <p style={{ fontSize:'.72rem', color:'#4b5563', marginTop:6 }}>สแกน QR Code เพื่อชำระเงิน</p>
                      </div>
                    )}

                    {/* Bank Info */}
                    <div style={{ background:'rgba(13,13,26,.8)', borderRadius:10, padding:'12px 16px', textAlign:'left', display:'flex', flexDirection:'column', gap:6 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem' }}>
                        <span style={{ color:'#4b5563' }}>ธนาคาร</span>
                        <span style={{ color:'#f1f0ff', fontWeight:600 }}>{seller.bank_name}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem' }}>
                        <span style={{ color:'#4b5563' }}>เลขบัญชี</span>
                        <span style={{ color:'#f1f0ff', fontWeight:600, fontFamily:'monospace' }}>{seller.bank_account}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem' }}>
                        <span style={{ color:'#4b5563' }}>ชื่อบัญชี</span>
                        <span style={{ color:'#f1f0ff', fontWeight:600 }}>{seller.account_name}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem' }}>
                        <span style={{ color:'#4b5563' }}>จำนวน</span>
                        <span style={{ color:'#c084fc', fontWeight:800, fontSize:'1rem' }}>฿{mod.price}</span>
                      </div>
                    </div>

                    <div style={{ marginTop:12, display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:'.78rem', color:'#9ca3af' }}>
                      <span style={{ display:'inline-block', width:8, height:8, background:'#a855f7', borderRadius:'50%', animation:'pulse 1.5s ease infinite' }} />
                      รอการยืนยันการชำระเงิน...
                    </div>
                    <p style={{ fontSize:'.72rem', color:'#4b5563', marginTop:6 }}>
                      ระบบจะตรวจสอบอัตโนมัติทุก 5 วินาที
                    </p>
                  </div>

                  {/* ปุ่มสำหรับ test (dev เท่านั้น) */}
                  {process.env.NODE_ENV === 'development' && (
                    <button
                      onClick={async () => {
                        await fetch(`/api/orders/${orderId}/confirm`, { method: 'POST' })
                      }}
                      style={{ fontSize:'.75rem', color:'#4b5563', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', padding:'7px', borderRadius:8, cursor:'pointer' }}
                    >
                      🔧 [DEV] จำลองการจ่ายเงิน
                    </button>
                  )}
                </div>
              )}

              {status === 'paid' && (
                <div style={{ background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.35)', borderRadius:12, padding:'18px', textAlign:'center' }}>
                  <div style={{ fontSize:'2rem', marginBottom:8 }}>🎉</div>
                  <div style={{ fontSize:'1rem', fontWeight:800, color:'#22c55e', marginBottom:4 }}>ชำระเงินสำเร็จ!</div>
                  <p style={{ fontSize:'.82rem', color:'#9ca3af' }}>วิธีติดตั้งและไฟล์ Mod ถูกปลดล็อคแล้วครับ</p>
                </div>
              )}

              {status === 'error' && (
                <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.3)', borderRadius:12, padding:'14px', textAlign:'center', fontSize:'.85rem', color:'#f87171' }}>
                  เกิดข้อผิดพลาด กรุณาลองใหม่
                </div>
              )}
            </>
          )}

        </div>
      </div>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}