import Link from 'next/link'

export default function FeesPage() {
  const fees = [
    { method: 'PromptPay QR',        rate: '1.65%', icon: '📱' },
    { method: 'บัตรเครดิต/เดบิต',     rate: '3.65%', icon: '💳' },
    { method: 'Internet Banking',     rate: '1.65%', icon: '🏦' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#06060f', color:'#f1f0ff', fontFamily:'system-ui' }}>
      <div style={{ padding:'14px 28px', borderBottom:'1px solid rgba(124,58,237,.2)' }}>
        <Link href="/" style={{ fontSize:'.85rem', color:'#9ca3af', textDecoration:'none' }}>← กลับหน้าหลัก</Link>
      </div>

      <div style={{ maxWidth:600, margin:'0 auto', padding:'48px 24px' }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:900, marginBottom:8 }}>💰 ค่าธรรมเนียมการชำระเงิน</h1>
        <p style={{ fontSize:'.88rem', color:'#9ca3af', marginBottom:32, lineHeight:1.7 }}>
          ModMerce หักค่าธรรมเนียมจากยอดขายตามช่องทางการชำระเงินที่ Buyer เลือกใช้ ดังนี้
        </p>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {fees.map(f => (
            <div key={f.method} style={{ background:'#111124', border:'1px solid rgba(124,58,237,.2)', borderRadius:14, padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:'1.8rem' }}>{f.icon}</span>
                <span style={{ fontSize:'.95rem', fontWeight:700 }}>{f.method}</span>
              </div>
              <span style={{ fontSize:'1.1rem', fontWeight:900, color:'#c084fc', fontFamily:'monospace' }}>{f.rate}</span>
            </div>
          ))}
        </div>

        <div style={{ background:'rgba(124,58,237,.06)', border:'1px solid rgba(124,58,237,.18)', borderRadius:12, padding:'16px 20px', marginTop:24, fontSize:'.82rem', color:'#9ca3af', lineHeight:1.7 }}>
          💡 <strong style={{ color:'#c084fc' }}>ตัวอย่าง:</strong> ขาย Mod ราคา ฿100 ผ่าน PromptPay<br />
          ค่าธรรมเนียม ฿1.65 → Seller ได้รับเงินจริง ฿98.35
        </div>
      </div>
    </div>
  )
}