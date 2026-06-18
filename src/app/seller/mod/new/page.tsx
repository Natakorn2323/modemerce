'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, getUser } from '@/lib/supabase'

const CATEGORIES = ['Graphics','Gameplay','Performance','Content','Combat','NPC','Map','Total Conversion','Utility','Cosmetic','Multiplayer','Survival']
const GAMES = ['GTA V','Skyrim SE','Cyberpunk 2077','Elden Ring','Minecraft','Project Zomboid','Fallout 4','The Witcher 3','DOOM','RimWorld','Stardew Valley','Dark Souls 3','อื่นๆ']

export default function NewModPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [modFile, setModFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    title: '', game: '', customGame: '', version: '',
    category: '', isFree: true, price: '', tags: '',
    shortDesc: '', fullDesc: '', requirements: '',
    installGuide: '', usageGuide: '',
  })

  const up = (k: string, v: string | boolean) =>
    setForm(p => ({ ...p, [k]: v }))

  useEffect(() => {
    async function init() {
    const u = await getUser()
    if (!u) { router.push('/auth/login'); return }
    setUser(u)
    setLoading(false)
  }
  init()
  }, [])

  function validateStep() {
    const e: Record<string, string> = {}
    if (step === 1) {
      if (!form.title)    e.title    = 'กรุณากรอกชื่อ Mod'
      if (!form.game)     e.game     = 'กรุณาเลือกเกม'
      if (!form.category) e.category = 'กรุณาเลือกหมวดหมู่'
      if (!form.isFree && !form.price) e.price = 'กรุณากรอกราคา'
    }
    if (step === 2) {
      if (!form.shortDesc) e.shortDesc = 'กรุณากรอกคำอธิบายสั้น'
      if (!form.fullDesc)  e.fullDesc  = 'กรุณากรอกรายละเอียดเต็ม'
    }
    if (step === 3) {
      if (!form.installGuide) e.installGuide = 'กรุณากรอกวิธีติดตั้ง'
      if (!modFile)           e.modFile      = 'กรุณาแนบไฟล์ Mod'
    }
    return e
  }

  function nextStep() {
    const e = validateStep()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(s => s + 1)
  }

  async function handleSubmit() {
   const e = validateStep()
   if (Object.keys(e).length) { setErrors(e); return }
   setErrors({})
   setSubmitting(true)

   try {
    let thumbUrl  = null
    let modFileUrl = null
    const gameName = form.game === 'อื่นๆ' ? form.customGame : form.game

    // Upload Thumbnail
    if (thumbFile) {
      const fd = new FormData()
      fd.append('file',   thumbFile)
      fd.append('userId', user.id)
      fd.append('bucket', 'mod-thumbnails')

      const res  = await fetch('/api/seller/upload-mod', { method:'POST', body:fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      thumbUrl = data.url
    }

    // Upload Mod File
    if (modFile) {
      const fd = new FormData()
      fd.append('file',   modFile)
      fd.append('userId', user.id)
      fd.append('bucket', 'mod-files')

      const res  = await fetch('/api/seller/upload-mod', { method:'POST', body:fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      modFileUrl = data.url
    }

    // บันทึก mod
    const res = await fetch('/api/seller/create-mod', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellerId:     user.id,
        title:        form.title,
        game:         gameName,
        category:     form.category,
        price:        form.price,
        isFree:       form.isFree,
        description:  form.fullDesc,
        installGuide: form.installGuide,
        requirements: form.requirements,
        tags:         form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        thumbnailUrl: thumbUrl,
        modFileUrl,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    router.push('/seller?published=1')

   } catch (err: any) {
    setErrors({ general: err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่' })
    setSubmitting(false)
  }
}

  const inp: React.CSSProperties = {
    width:'100%', background:'#0d0d1a',
    border:'1px solid rgba(124,58,237,.25)',
    borderRadius:8, padding:'10px 14px',
    color:'#f1f0ff', fontSize:'.88rem',
    outline:'none', fontFamily:'system-ui',
  }
  const lab: React.CSSProperties = {
    display:'block', fontSize:'.8rem',
    fontWeight:600, color:'#9ca3af', marginBottom:6,
  }
  const err: React.CSSProperties = {
    fontSize:'.75rem', color:'#f87171', marginTop:4,
  }

  const steps = ['ข้อมูลพื้นฐาน', 'รายละเอียด', 'คู่มือ & ไฟล์']

  return (
    <div style={{ minHeight:'100vh', background:'#06060f', color:'#f1f0ff', fontFamily:'system-ui' }}>

      {/* Top bar */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 28px', background:'rgba(13,13,26,.9)',
        borderBottom:'1px solid rgba(124,58,237,.2)',
        position:'sticky', top:0, zIndex:50,
      }}>
        <Link href="/seller" style={{ fontSize:'.82rem', color:'#9ca3af', textDecoration:'none' }}>
          ← กลับ Seller Portal
        </Link>
        <span style={{ fontFamily:'monospace', fontSize:'.95rem', fontWeight:800 }}>
          ⬡ MOD<span style={{ color:'#a855f7' }}>MERCE</span> — ลง Mod ใหม่
        </span>
        <span style={{ fontSize:'.82rem', color:'#a855f7' }}>👤 {user?.displayName}</span>
      </div>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'32px 24px' }}>

        {/* Progress */}
        <div style={{ display:'flex', gap:0, marginBottom:28 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{
                width:32, height:32, borderRadius:'50%',
                background: step > i+1 ? '#22c55e' : step === i+1 ? '#7c3aed' : '#0d0d1a',
                border: `1px solid ${step > i+1 ? '#22c55e' : step === i+1 ? '#a855f7' : 'rgba(124,58,237,.25)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'.75rem', fontWeight:700,
                color: step >= i+1 ? '#fff' : '#4b5563',
                boxShadow: step === i+1 ? '0 0 12px #a855f7' : 'none',
              }}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span style={{ fontSize:'.72rem', color: step === i+1 ? '#c084fc' : '#4b5563' }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{
          background:'#111124', border:'1px solid rgba(124,58,237,.2)',
          borderRadius:16, overflow:'hidden',
        }}>
          <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:18 }}>

            {errors.general && (
              <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:8, padding:'10px 14px', fontSize:'.82rem', color:'#f87171' }}>
                {errors.general}
              </div>
            )}

            {/* ── Step 1 ── */}
            {step === 1 && <>
              <h2 style={{ fontSize:'1.1rem', fontWeight:800, display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontFamily:'monospace', fontSize:'.78rem', color:'#a855f7', background:'rgba(124,58,237,.12)', border:'1px solid rgba(168,85,247,.4)', padding:'2px 8px', borderRadius:4 }}>01</span>
                ข้อมูลพื้นฐาน
              </h2>

              <div>
                <label style={lab}>ชื่อ Mod <span style={{ color:'#a855f7' }}>*</span></label>
                <input style={inp} placeholder="เช่น NaturalVision Evolved v4.0" value={form.title} onChange={e => up('title', e.target.value)} />
                {errors.title && <span style={err}>{errors.title}</span>}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label style={lab}>เกม <span style={{ color:'#a855f7' }}>*</span></label>
                  <select style={{ ...inp, cursor:'pointer' }} value={form.game} onChange={e => up('game', e.target.value)}>
                    <option value="">เลือกเกม...</option>
                    {GAMES.map(g => <option key={g} value={g} style={{ background:'#0d0d1a' }}>{g}</option>)}
                  </select>
                  {errors.game && <span style={err}>{errors.game}</span>}
                </div>
                <div>
                  <label style={lab}>Version</label>
                  <input style={inp} placeholder="เช่น 1.0.0" value={form.version} onChange={e => up('version', e.target.value)} />
                </div>
              </div>

              {form.game === 'อื่นๆ' && (
                <div>
                  <label style={lab}>ชื่อเกม (ระบุ)</label>
                  <input style={inp} placeholder="กรอกชื่อเกม..." value={form.customGame} onChange={e => up('customGame', e.target.value)} />
                </div>
              )}

              <div>
                <label style={lab}>หมวดหมู่ <span style={{ color:'#a855f7' }}>*</span></label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => up('category', c)} style={{
                      fontSize:'.75rem', fontWeight:600, padding:'5px 12px', borderRadius:99,
                      cursor:'pointer', border:'1px solid',
                      borderColor: form.category === c ? 'rgba(168,85,247,.6)' : 'rgba(124,58,237,.2)',
                      background: form.category === c ? 'rgba(124,58,237,.15)' : 'rgba(255,255,255,.03)',
                      color: form.category === c ? '#c084fc' : '#9ca3af',
                    }}>{c}</button>
                  ))}
                </div>
                {errors.category && <span style={err}>{errors.category}</span>}
              </div>

              <div>
                <label style={lab}>ราคา</label>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  {[true, false].map(isFree => (
                    <button key={String(isFree)} type="button" onClick={() => up('isFree', isFree)} style={{
                      fontSize:'.85rem', fontWeight:700, padding:'8px 18px', borderRadius:8, cursor:'pointer',
                      border:'1px solid', transition:'all .2s',
                      borderColor: form.isFree === isFree ? 'rgba(168,85,247,.6)' : 'rgba(124,58,237,.2)',
                      background: form.isFree === isFree ? 'rgba(124,58,237,.15)' : '#0d0d1a',
                      color: form.isFree === isFree ? '#c084fc' : '#9ca3af',
                    }}>
                      {isFree ? '🆓 ฟรี' : '💰 มีราคา'}
                    </button>
                  ))}
                  {!form.isFree && (
                    <input type="number" min="1" style={{ ...inp, width:120 }} placeholder="฿" value={form.price} onChange={e => up('price', e.target.value)} />
                  )}
                </div>
                {errors.price && <span style={err}>{errors.price}</span>}
              </div>

              <div>
                <label style={lab}>Tags (คั่นด้วย ,)</label>
                <input style={inp} placeholder="เช่น graphics, reshade, 4K" value={form.tags} onChange={e => up('tags', e.target.value)} />
              </div>
            </>}

            {/* ── Step 2 ── */}
            {step === 2 && <>
              <h2 style={{ fontSize:'1.1rem', fontWeight:800, display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontFamily:'monospace', fontSize:'.78rem', color:'#a855f7', background:'rgba(124,58,237,.12)', border:'1px solid rgba(168,85,247,.4)', padding:'2px 8px', borderRadius:4 }}>02</span>
                รายละเอียด Mod
              </h2>

              <div>
                <label style={lab}>คำอธิบายสั้น <span style={{ color:'#a855f7' }}>*</span></label>
                <input style={inp} placeholder="อธิบาย Mod ใน 1–2 ประโยค" maxLength={150} value={form.shortDesc} onChange={e => up('shortDesc', e.target.value)} />
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  {errors.shortDesc && <span style={err}>{errors.shortDesc}</span>}
                  <span style={{ fontSize:'.72rem', color:'#4b5563', marginLeft:'auto' }}>{form.shortDesc.length}/150</span>
                </div>
              </div>

              <div>
                <label style={lab}>รายละเอียดเต็ม <span style={{ color:'#a855f7' }}>*</span></label>
                <textarea style={{ ...inp, minHeight:120, resize:'vertical', lineHeight:1.6 }} placeholder="อธิบาย feature ทั้งหมด ความเข้ากันได้ การเปลี่ยนแปลง..." value={form.fullDesc} onChange={e => up('fullDesc', e.target.value)} />
                {errors.fullDesc && <span style={err}>{errors.fullDesc}</span>}
              </div>

              <div>
                <label style={lab}>System Requirements</label>
                <textarea style={{ ...inp, minHeight:90, resize:'vertical', lineHeight:1.6 }} placeholder={'OS: Windows 10/11\nRAM: 16GB\nGPU: GTX 1080'} value={form.requirements} onChange={e => up('requirements', e.target.value)} />
              </div>

              {/* Thumbnail */}
              <div>
                <label style={lab}>รูปภาพ / Thumbnail</label>
                {thumbPreview && (
                  <img src={thumbPreview} alt="preview" style={{ width:'100%', maxHeight:200, objectFit:'cover', borderRadius:8, marginBottom:8 }} />
                )}
                <label style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                  background:'rgba(124,58,237,.04)', border:'2px dashed rgba(124,58,237,.25)',
                  borderRadius:10, padding:'20px 16px', cursor:'pointer', textAlign:'center',
                }}>
                  <span style={{ fontSize:'1.6rem' }}>📸</span>
                  <span style={{ fontSize:'.82rem', color:'#9ca3af', fontWeight:600 }}>
                    {thumbFile ? thumbFile.name : 'คลิกเพื่อเลือกรูป Thumbnail'}
                  </span>
                  <span style={{ fontSize:'.72rem', color:'#4b5563' }}>PNG, JPG สูงสุด 5MB · แนะนำ 1280×720px</span>
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) { setThumbFile(f); setThumbPreview(URL.createObjectURL(f)) }
                  }} />
                </label>
              </div>
            </>}

            {/* ── Step 3 ── */}
            {step === 3 && <>
              <h2 style={{ fontSize:'1.1rem', fontWeight:800, display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontFamily:'monospace', fontSize:'.78rem', color:'#a855f7', background:'rgba(124,58,237,.12)', border:'1px solid rgba(168,85,247,.4)', padding:'2px 8px', borderRadius:4 }}>03</span>
                คู่มือ & ไฟล์ Mod
              </h2>

              <div>
                <label style={lab}>วิธีการติดตั้ง <span style={{ color:'#a855f7' }}>*</span></label>
                <p style={{ fontSize:'.75rem', color:'#4b5563', marginBottom:6 }}>อธิบายขั้นตอนการติดตั้งอย่างละเอียด</p>
                <textarea style={{ ...inp, minHeight:130, resize:'vertical', lineHeight:1.7 }}
                  placeholder={'1. ดาวน์โหลดไฟล์ .zip และแตกไฟล์\n2. คัดลอกโฟลเดอร์ไปที่ ...\n3. เปิดเกมและกด F5'}
                  value={form.installGuide} onChange={e => up('installGuide', e.target.value)} />
                {errors.installGuide && <span style={err}>{errors.installGuide}</span>}
              </div>

              <div>
                <label style={lab}>วิธีใช้งาน</label>
                <textarea style={{ ...inp, minHeight:100, resize:'vertical', lineHeight:1.7 }}
                  placeholder={'- กด F5 เพื่อเปิด/ปิด Mod\n- ปรับค่าได้ใน Settings menu'}
                  value={form.usageGuide} onChange={e => up('usageGuide', e.target.value)} />
              </div>

              {/* Mod File Upload */}
              <div>
                <label style={lab}>ไฟล์ Mod <span style={{ color:'#a855f7' }}>*</span></label>
                <p style={{ fontSize:'.75rem', color:'#4b5563', marginBottom:6 }}>
                  ไฟล์ที่ Buyer จะได้รับหลังชำระเงิน (.zip, .rar, .7z)
                </p>
                <label style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                  background: modFile ? 'rgba(34,197,94,.05)' : 'rgba(124,58,237,.04)',
                  border: `2px dashed ${modFile ? 'rgba(34,197,94,.4)' : 'rgba(124,58,237,.25)'}`,
                  borderRadius:10, padding:'24px 16px', cursor:'pointer', textAlign:'center',
                }}>
                  <span style={{ fontSize:'1.8rem' }}>{modFile ? '✅' : '📦'}</span>
                  <span style={{ fontSize:'.85rem', fontWeight:600, color: modFile ? '#22c55e' : '#9ca3af' }}>
                    {modFile ? modFile.name : 'คลิกเพื่อเลือกไฟล์ Mod'}
                  </span>
                  {modFile && (
                    <span style={{ fontSize:'.72rem', color:'#4b5563' }}>
                      ขนาด: {(modFile.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  )}
                  <span style={{ fontSize:'.72rem', color:'#4b5563' }}>.zip, .rar, .7z สูงสุด 500MB</span>
                  <input type="file" accept=".zip,.rar,.7z" style={{ display:'none' }} onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) setModFile(f)
                  }} />
                </label>
                {errors.modFile && <span style={err}>{errors.modFile}</span>}
              </div>

              {/* Preview card */}
              <div style={{ background:'#0d0d1a', border:'1px solid rgba(124,58,237,.2)', borderRadius:10, overflow:'hidden' }}>
                <div style={{ fontSize:'.7rem', fontWeight:700, letterSpacing:'.08em', color:'#a855f7', padding:'8px 14px', borderBottom:'1px solid rgba(124,58,237,.12)' }}>
                  👁 PREVIEW CARD
                </div>
                <div style={{ display:'flex', gap:12, padding:14 }}>
                  {thumbPreview
                    ? <img src={thumbPreview} style={{ width:64, height:64, objectFit:'cover', borderRadius:8, flexShrink:0 }} />
                    : <div style={{ width:64, height:64, background:'linear-gradient(135deg,#111124,#2d1458)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>🎮</div>
                  }
                  <div>
                    <div style={{ fontSize:'.65rem', fontWeight:700, color:'#a855f7', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:2 }}>
                      {form.game || 'ชื่อเกม'}
                    </div>
                    <div style={{ fontSize:'.9rem', fontWeight:800, color:'#f1f0ff', marginBottom:3 }}>
                      {form.title || 'ชื่อ Mod'}
                    </div>
                    <div style={{ fontSize:'.75rem', color:'#9ca3af', marginBottom:5 }}>
                      {form.shortDesc || 'คำอธิบายสั้น...'}
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span style={{ fontSize:'.65rem', fontWeight:700, color:'#a855f7', background:'rgba(124,58,237,.15)', padding:'2px 7px', borderRadius:3 }}>
                        {form.category || 'Category'}
                      </span>
                      <span style={{ fontSize:'.78rem', fontWeight:700, color: form.isFree ? '#22c55e' : '#c084fc' }}>
                        {form.isFree ? 'Free' : (form.price ? `฿${form.price}` : '฿??')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>}

          </div>

          {/* Nav */}
          <div style={{
            display:'flex', alignItems:'center', gap:12,
            padding:'18px 32px', borderTop:'1px solid rgba(124,58,237,.1)',
            background:'rgba(13,13,26,.5)',
          }}>
            {step > 1 && (
              <button onClick={() => { setErrors({}); setStep(s => s-1) }} style={{
                fontSize:'.88rem', fontWeight:600, color:'#9ca3af',
                background:'none', border:'1px solid rgba(124,58,237,.2)',
                padding:'9px 20px', borderRadius:8, cursor:'pointer',
              }}>
                ← ย้อนกลับ
              </button>
            )}
            <div style={{ flex:1 }} />
            {step < 3 ? (
              <button onClick={nextStep} style={{
                fontSize:'.92rem', fontWeight:700, color:'#fff',
                background:'linear-gradient(135deg,#7c3aed,#a855f7)',
                border:'none', padding:'10px 28px', borderRadius:8, cursor:'pointer',
                boxShadow:'0 0 20px rgba(168,85,247,.3)',
              }}>
                ถัดไป →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} style={{
                fontSize:'.92rem', fontWeight:700, color:'#fff',
                background: submitting ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#6d28d9,#a855f7,#ec4899)',
                border:'none', padding:'10px 28px', borderRadius:8,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 0 30px rgba(168,85,247,.4)',
              }}>
                {submitting ? '⏳ กำลังเผยแพร่...' : '🚀 เผยแพร่ Mod'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}