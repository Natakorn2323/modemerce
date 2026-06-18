'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, getUser } from '@/lib/supabase'

const CATEGORIES = ['Graphics','Gameplay','Performance','Content','Combat','NPC','Map','Total Conversion','Utility','Cosmetic','Multiplayer','Survival']
const GAMES = ['GTA V','Skyrim SE','Cyberpunk 2077','Elden Ring','Minecraft','Project Zomboid','Fallout 4','The Witcher 3','DOOM','RimWorld','Stardew Valley','Dark Souls 3','อื่นๆ']

export default function EditModPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    title:'', game:'', category:'', isFree:true,
    price:'', shortDesc:'', fullDesc:'',
    requirements:'', installGuide:'', usageGuide:'', tags:'',
  })

  const up = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))

  useEffect(() => {
   async function init() {
    const u = await getUser()
    if (!u) { router.push('/auth/login'); return }
    setUser(u)
    setLoading(false)
  }
  init()
  }, [])

  async function fetchMod() {
    const { data } = await supabase
      .from('mods')
      .select('*')
      .eq('id', id)
      .single()

    if (!data) { router.push('/seller/dashboard'); return }

    setForm({
      title:        data.title || '',
      game:         data.game  || '',
      category:     data.category || '',
      isFree:       data.is_free,
      price:        data.price?.toString() || '',
      shortDesc:    data.description?.split('\n')[0] || '',
      fullDesc:     data.description || '',
      requirements: data.requirements || '',
      installGuide: data.install_guide || '',
      usageGuide:   data.usage_guide || '',
      tags:         (data.tags || []).join(', '),
    })
    if (data.thumbnail_url) setThumbPreview(data.thumbnail_url)
    setLoading(false)
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title)    e.title    = 'กรุณากรอกชื่อ Mod'
    if (!form.game)     e.game     = 'กรุณาเลือกเกม'
    if (!form.category) e.category = 'กรุณาเลือกหมวดหมู่'
    if (!form.isFree && !form.price) e.price = 'กรุณากรอกราคา'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSaving(true)

    try {
      let thumbUrl = thumbPreview

      if (thumbFile) {
        const ext = thumbFile.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        await supabase.storage.from('mod-thumbnails').upload(path, thumbFile, { upsert:true })
        const { data } = supabase.storage.from('mod-thumbnails').getPublicUrl(path)
        thumbUrl = data.publicUrl
      }

      await supabase.from('mods').update({
        title:         form.title,
        game:          form.game,
        category:      form.category,
        price:         form.isFree ? 0 : Number(form.price),
        is_free:       form.isFree,
        description:   form.fullDesc,
        install_guide: form.installGuide,
        requirements:  form.requirements,
        tags:          form.tags.split(',').map(t => t.trim()).filter(Boolean),
        thumbnail_url: thumbUrl,
        updated_at:    new Date().toISOString(),
      }).eq('id', id)

      setSuccess(true)
      setTimeout(() => router.push('/seller/dashboard'), 1500)

    } catch {
      setErrors({ general: 'บันทึกไม่สำเร็จ กรุณาลองใหม่' })
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#06060f', display:'flex', alignItems:'center', justifyContent:'center', color:'#a855f7', fontFamily:'system-ui' }}>
      กำลังโหลด...
    </div>
  )

  const inp: React.CSSProperties = { width:'100%', background:'#0d0d1a', border:'1px solid rgba(124,58,237,.25)', borderRadius:8, padding:'10px 14px', color:'#f1f0ff', fontSize:'.88rem', outline:'none', fontFamily:'system-ui' }
  const lab: React.CSSProperties = { display:'block', fontSize:'.8rem', fontWeight:600, color:'#9ca3af', marginBottom:6 }
  const errStyle: React.CSSProperties = { fontSize:'.75rem', color:'#f87171', marginTop:4, display:'block' }

  return (
    <div style={{ minHeight:'100vh', background:'#06060f', color:'#f1f0ff', fontFamily:'system-ui' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', background:'rgba(13,13,26,.9)', borderBottom:'1px solid rgba(124,58,237,.2)', position:'sticky', top:0, zIndex:50 }}>
        <Link href="/seller/dashboard" style={{ fontSize:'.82rem', color:'#9ca3af', textDecoration:'none' }}>← Dashboard</Link>
        <span style={{ fontFamily:'monospace', fontSize:'.95rem', fontWeight:800 }}>⬡ MOD<span style={{ color:'#a855f7' }}>MERCE</span> — แก้ไข Mod</span>
        <span style={{ fontSize:'.82rem', color:'#a855f7' }}>👤 {user?.displayName}</span>
      </div>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'32px 24px' }}>

        {success ? (
          <div style={{ background:'#111124', border:'1px solid rgba(34,197,94,.4)', borderRadius:16, padding:'48px', textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>✅</div>
            <h2 style={{ fontSize:'1.2rem', fontWeight:800, marginBottom:6 }}>บันทึกสำเร็จ!</h2>
            <p style={{ fontSize:'.88rem', color:'#9ca3af' }}>กำลังกลับไป Dashboard...</p>
          </div>
        ) : (
          <div style={{ background:'#111124', border:'1px solid rgba(124,58,237,.2)', borderRadius:16, overflow:'hidden' }}>

            <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(124,58,237,.12)', background:'linear-gradient(135deg,rgba(45,20,88,.4),transparent)' }}>
              <h1 style={{ fontSize:'1.1rem', fontWeight:800 }}>✏️ แก้ไข Mod</h1>
              <p style={{ fontSize:'.8rem', color:'#9ca3af', marginTop:3 }}>แก้ไขข้อมูล Mod แล้วกดบันทึก</p>
            </div>

            <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:18 }}>

              {errors.general && (
                <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', borderRadius:8, padding:'10px 14px', fontSize:'.82rem', color:'#f87171' }}>
                  {errors.general}
                </div>
              )}

              {/* ชื่อ */}
              <div>
                <label style={lab}>ชื่อ Mod *</label>
                <input style={inp} value={form.title} onChange={e => up('title', e.target.value)} />
                {errors.title && <span style={errStyle}>{errors.title}</span>}
              </div>

              {/* เกม + Category */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <label style={lab}>เกม *</label>
                  <select style={{ ...inp, cursor:'pointer' }} value={form.game} onChange={e => up('game', e.target.value)}>
                    <option value="">เลือกเกม...</option>
                    {GAMES.map(g => <option key={g} value={g} style={{ background:'#0d0d1a' }}>{g}</option>)}
                  </select>
                  {errors.game && <span style={errStyle}>{errors.game}</span>}
                </div>
                <div>
                  <label style={lab}>หมวดหมู่ *</label>
                  <select style={{ ...inp, cursor:'pointer' }} value={form.category} onChange={e => up('category', e.target.value)}>
                    <option value="">เลือกหมวดหมู่...</option>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background:'#0d0d1a' }}>{c}</option>)}
                  </select>
                  {errors.category && <span style={errStyle}>{errors.category}</span>}
                </div>
              </div>

              {/* ราคา */}
              <div>
                <label style={lab}>ราคา</label>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  {[true, false].map(isFree => (
                    <button key={String(isFree)} type="button" onClick={() => up('isFree', isFree)} style={{
                      fontSize:'.85rem', fontWeight:700, padding:'8px 18px', borderRadius:8, cursor:'pointer', border:'1px solid',
                      borderColor: form.isFree === isFree ? 'rgba(168,85,247,.6)' : 'rgba(124,58,237,.2)',
                      background: form.isFree === isFree ? 'rgba(124,58,237,.15)' : '#0d0d1a',
                      color: form.isFree === isFree ? '#c084fc' : '#9ca3af',
                    }}>
                      {isFree ? '🆓 ฟรี' : '💰 มีราคา'}
                    </button>
                  ))}
                  {!form.isFree && (
                    <input type="number" style={{ ...inp, width:110 }} placeholder="฿" value={form.price} onChange={e => up('price', e.target.value)} />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={lab}>รายละเอียด</label>
                <textarea style={{ ...inp, minHeight:100, resize:'vertical', lineHeight:1.6 }} value={form.fullDesc} onChange={e => up('fullDesc', e.target.value)} />
              </div>

              {/* Requirements */}
              <div>
                <label style={lab}>System Requirements</label>
                <textarea style={{ ...inp, minHeight:80, resize:'vertical', lineHeight:1.6 }} value={form.requirements} onChange={e => up('requirements', e.target.value)} />
              </div>

              {/* Install Guide */}
              <div>
                <label style={lab}>วิธีการติดตั้ง</label>
                <textarea style={{ ...inp, minHeight:110, resize:'vertical', lineHeight:1.7 }} value={form.installGuide} onChange={e => up('installGuide', e.target.value)} />
              </div>

              {/* Tags */}
              <div>
                <label style={lab}>Tags (คั่นด้วย ,)</label>
                <input style={inp} value={form.tags} onChange={e => up('tags', e.target.value)} />
              </div>

              {/* Thumbnail */}
              <div>
                <label style={lab}>รูปภาพ / Thumbnail</label>
                {thumbPreview && (
                  <img src={thumbPreview} alt="preview" style={{ width:'100%', maxHeight:180, objectFit:'cover', borderRadius:8, marginBottom:8 }} />
                )}
                <label style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, background:'rgba(124,58,237,.04)', border:'2px dashed rgba(124,58,237,.25)', borderRadius:10, padding:'18px', cursor:'pointer', textAlign:'center' }}>
                  <span style={{ fontSize:'1.4rem' }}>📸</span>
                  <span style={{ fontSize:'.8rem', color:'#9ca3af', fontWeight:600 }}>
                    {thumbFile ? thumbFile.name : 'คลิกเพื่อเปลี่ยนรูป'}
                  </span>
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) { setThumbFile(f); setThumbPreview(URL.createObjectURL(f)) }
                  }} />
                </label>
              </div>

            </div>

            {/* Footer */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderTop:'1px solid rgba(124,58,237,.1)', background:'rgba(13,13,26,.5)' }}>
              <Link href="/seller/dashboard" style={{ fontSize:'.88rem', color:'#9ca3af', textDecoration:'none' }}>ยกเลิก</Link>
              <button onClick={handleSave} disabled={saving} style={{
                fontSize:'.92rem', fontWeight:700, color:'#fff',
                background: saving ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
                border:'none', padding:'10px 28px', borderRadius:8,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: saving ? 'none' : '0 0 20px rgba(168,85,247,.3)',
              }}>
                {saving ? '⏳ กำลังบันทึก...' : '💾 บันทึกการแก้ไข'}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}