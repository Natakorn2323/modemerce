'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './seller.module.css'

const CATEGORIES = ['Graphics', 'Gameplay', 'Performance', 'Content', 'Combat', 'NPC', 'Map', 'Total Conversion', 'Utility', 'Cosmetic', 'Multiplayer', 'Survival']
const GAMES = ['GTA V', 'Skyrim SE', 'Cyberpunk 2077', 'Elden Ring', 'Minecraft', 'Project Zomboid', 'Fallout 4', 'The Witcher 3', 'DOOM', 'RimWorld', 'Stardew Valley', 'Dark Souls 3', 'อื่นๆ']

export default function SellerPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    modName: '',
    game: '',
    customGame: '',
    version: '',
    category: '',
    price: '',
    isFree: true,
    shortDesc: '',
    fullDesc: '',
    installGuide: '',
    usageGuide: '',
    requirements: '',
    tags: '',
  })

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h1 className={styles.successTitle}>ส่ง Mod สำเร็จ!</h1>
          <p className={styles.successText}>
            Mod ของคุณอยู่ระหว่างการตรวจสอบ ทีมงานจะอนุมัติภายใน 24–48 ชั่วโมง
          </p>
          <div className={styles.successActions}>
            <button className={styles.successBtn} onClick={() => { setSubmitted(false); setStep(1) }}>
              เพิ่ม Mod ใหม่
            </button>
            <Link href="/" className={styles.successLink}>กลับหน้าหลัก</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>← กลับหน้าหลัก</Link>
        <div className={styles.logo}>⬡ MOD<em>MERCE</em> Seller Portal</div>
      </div>

      <div className={styles.container}>
        {/* Sidebar info */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideIcon}>⚡</div>
            <h2 className={styles.sideTitle}>Seller Dashboard</h2>
            <p className={styles.sideText}>สร้างรายการ Mod และเริ่มขายในชุมชน ModVault</p>
          </div>

          {/* Progress */}
          <div className={styles.progress}>
            {['ข้อมูลพื้นฐาน', 'รายละเอียด', 'คู่มือการใช้งาน'].map((s, i) => (
              <div key={i} className={`${styles.progressItem} ${step > i ? styles.done : ''} ${step === i + 1 ? styles.active : ''}`}>
                <div className={styles.progressDot}>{step > i + 1 ? '✓' : i + 1}</div>
                <span className={styles.progressLabel}>{s}</span>
              </div>
            ))}
          </div>

          <div className={styles.tips}>
            <div className={styles.tipsTitle}>💡 Tips สำหรับ Seller</div>
            <ul className={styles.tipsList}>
              <li>ใส่รูปภาพ Thumbnail คุณภาพสูง</li>
              <li>อธิบายขั้นตอนการติดตั้งให้ละเอียด</li>
              <li>ระบุ Requirements ของระบบที่ต้องการ</li>
              <li>ตั้งราคาที่เหมาะสมกับคุณภาพ</li>
            </ul>
          </div>
        </aside>

        {/* Form */}
        <main className={styles.formArea}>
          <div className={styles.formCard}>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>
                  <span className={styles.stepNum}>01</span> ข้อมูลพื้นฐาน
                </h2>

                <div className={styles.field}>
                  <label className={styles.label}>ชื่อ Mod <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    placeholder="เช่น NaturalVision Evolved v4.0"
                    value={form.modName}
                    onChange={e => update('modName', e.target.value)}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>เกม <span className={styles.req}>*</span></label>
                    <select
                      className={styles.select}
                      value={form.game}
                      onChange={e => update('game', e.target.value)}
                    >
                      <option value="">เลือกเกม...</option>
                      {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Version</label>
                    <input
                      className={styles.input}
                      placeholder="เช่น 1.0.0"
                      value={form.version}
                      onChange={e => update('version', e.target.value)}
                    />
                  </div>
                </div>

                {form.game === 'อื่นๆ' && (
                  <div className={styles.field}>
                    <label className={styles.label}>ชื่อเกม (ระบุ)</label>
                    <input
                      className={styles.input}
                      placeholder="กรอกชื่อเกม..."
                      value={form.customGame}
                      onChange={e => update('customGame', e.target.value)}
                    />
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.label}>หมวดหมู่ <span className={styles.req}>*</span></label>
                  <div className={styles.categoryGrid}>
                    {CATEGORIES.map(c => (
                      <button
                        key={c}
                        type="button"
                        className={`${styles.catBtn} ${form.category === c ? styles.catActive : ''}`}
                        onClick={() => update('category', c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>ราคา</label>
                  <div className={styles.priceRow}>
                    <button
                      type="button"
                      className={`${styles.priceToggle} ${form.isFree ? styles.priceActive : ''}`}
                      onClick={() => update('isFree', true)}
                    >
                      🆓 ฟรี
                    </button>
                    <button
                      type="button"
                      className={`${styles.priceToggle} ${!form.isFree ? styles.priceActive : ''}`}
                      onClick={() => update('isFree', false)}
                    >
                      💰 มีราคา
                    </button>
                    {!form.isFree && (
                      <input
                        className={styles.priceInput}
                        placeholder="ราคา (฿)"
                        value={form.price}
                        onChange={e => update('price', e.target.value)}
                        type="number"
                        min="1"
                      />
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Tags (คั่นด้วย , )</label>
                  <input
                    className={styles.input}
                    placeholder="เช่น graphics, reshade, 4K, photorealistic"
                    value={form.tags}
                    onChange={e => update('tags', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Description */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>
                  <span className={styles.stepNum}>02</span> รายละเอียด Mod
                </h2>

                <div className={styles.field}>
                  <label className={styles.label}>คำอธิบายสั้น <span className={styles.req}>*</span></label>
                  <input
                    className={styles.input}
                    placeholder="อธิบาย Mod ใน 1–2 ประโยค"
                    value={form.shortDesc}
                    onChange={e => update('shortDesc', e.target.value)}
                    maxLength={150}
                  />
                  <span className={styles.charCount}>{form.shortDesc.length}/150</span>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>รายละเอียดเต็ม <span className={styles.req}>*</span></label>
                  <textarea
                    className={styles.textarea}
                    placeholder="อธิบาย feature ทั้งหมดของ Mod ความเข้ากันได้ การเปลี่ยนแปลงจาก version เดิม ฯลฯ"
                    value={form.fullDesc}
                    onChange={e => update('fullDesc', e.target.value)}
                    rows={8}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>System Requirements</label>
                  <textarea
                    className={styles.textarea}
                    placeholder={`เช่น:\n- OS: Windows 10/11 64-bit\n- RAM: 16GB\n- GPU: GTX 1080 / RX 580\n- เกม Version: 1.0.7 ขึ้นไป`}
                    value={form.requirements}
                    onChange={e => update('requirements', e.target.value)}
                    rows={5}
                  />
                </div>

                {/* Image upload placeholder */}
                <div className={styles.field}>
                  <label className={styles.label}>รูปภาพ / Thumbnail</label>
                  <div className={styles.uploadZone}>
                    <div className={styles.uploadIcon}>📸</div>
                    <p className={styles.uploadText}>ลากไฟล์มาวาง หรือคลิกเพื่อเลือกรูป</p>
                    <p className={styles.uploadHint}>PNG, JPG สูงสุด 5MB · แนะนำ 1280×720px</p>
                    <button type="button" className={styles.uploadBtn}>เลือกไฟล์</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Install & Usage Guide */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>
                  <span className={styles.stepNum}>03</span> คู่มือการใช้งาน
                </h2>

                <div className={styles.field}>
                  <label className={styles.label}>วิธีการติดตั้ง Mod <span className={styles.req}>*</span></label>
                  <div className={styles.fieldHint}>อธิบายขั้นตอนการติดตั้งอย่างละเอียด ใช้ตัวเลขหรือ - นำหน้าแต่ละขั้นตอน</div>
                  <textarea
                    className={styles.textarea}
                    placeholder={`เช่น:\n1. ดาวน์โหลดไฟล์ .zip และแตกไฟล์\n2. คัดลอกโฟลเดอร์ไปที่ Documents/GTA V/mods\n3. เปิด OpenIV และติดตั้ง OIV package\n4. เปิดเกมและกด F5 เพื่อเปิด menu\n\nหมายเหตุ: ต้องมี OpenIV และ Script Hook V ติดตั้งก่อน`}
                    value={form.installGuide}
                    onChange={e => update('installGuide', e.target.value)}
                    rows={10}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>วิธีใช้งาน / How to Use</label>
                  <div className={styles.fieldHint}>อธิบายวิธีใช้ feature ต่างๆ ของ Mod ใน gameplay</div>
                  <textarea
                    className={styles.textarea}
                    placeholder={`เช่น:\n- กด F5 ในเกมเพื่อเปิด/ปิด Mod\n- ใช้ F6 เพื่อเปิด Settings menu\n- ปรับ intensity ได้ตั้งแต่ 0–100%\n- รองรับ ENB Series และ ReShade\n\nTips: แนะนำ preset 'Cinematic' สำหรับมือใหม่`}
                    value={form.usageGuide}
                    onChange={e => update('usageGuide', e.target.value)}
                    rows={8}
                  />
                </div>

                {/* Preview */}
                <div className={styles.previewCard}>
                  <div className={styles.previewHeader}>👁 Preview Card ที่จะแสดงใน Marketplace</div>
                  <div className={styles.previewBody}>
                    <div className={styles.previewThumb}>🎮</div>
                    <div className={styles.previewInfo}>
                      <div className={styles.previewGame}>{form.game || 'ชื่อเกม'}</div>
                      <div className={styles.previewTitle}>{form.modName || 'ชื่อ Mod'}</div>
                      <div className={styles.previewDesc}>{form.shortDesc || 'คำอธิบายสั้น...'}</div>
                      <div className={styles.previewMeta}>
                        <span className={styles.previewCat}>{form.category || 'Category'}</span>
                        <span className={form.isFree ? styles.previewFree : styles.previewPrice}>
                          {form.isFree ? 'Free' : (form.price ? `฿${form.price}` : '฿??')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className={styles.formNav}>
              {step > 1 && (
                <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>
                  ← ย้อนกลับ
                </button>
              )}
              <div style={{ flex: 1 }} />
              {step < 3 ? (
                <button className={styles.nextBtn} onClick={() => setStep(s => s + 1)}>
                  ถัดไป →
                </button>
              ) : (
                <button className={styles.submitBtn} onClick={() => setSubmitted(true)}>
                  🚀 เผยแพร่ Mod
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
