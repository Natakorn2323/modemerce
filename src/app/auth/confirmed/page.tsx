import Link from 'next/link'

export default function ConfirmedPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#06060f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui',
    }}>
      <div style={{
        background: '#111124',
        border: '1px solid rgba(168,85,247,.5)',
        borderRadius: 20,
        padding: '56px 48px',
        textAlign: 'center',
        maxWidth: 420,
        boxShadow: '0 0 60px rgba(124,58,237,.2)',
      }}>
        <div style={{
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          color: 'white',
          margin: '0 auto 20px',
          boxShadow: '0 0 30px rgba(168,85,247,.5)',
        }}>
          ✓
        </div>

        <h1 style={{
          fontFamily: 'monospace',
          fontSize: '1.6rem',
          fontWeight: 900,
          color: '#f1f0ff',
          marginBottom: 10,
        }}>
          ยืนยัน Email สำเร็จ!
        </h1>

        <p style={{
          fontSize: '0.9rem',
          color: '#9ca3af',
          lineHeight: 1.7,
          marginBottom: 28,
        }}>
          บัญชีของคุณพร้อมใช้งานแล้ว<br />
          กดปุ่มด้านล่างเพื่อเข้าสู่ระบบ
        </p>

        <Link
          href="/auth/login"
          style={{
            display: 'inline-block',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'white',
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            textDecoration: 'none',
            padding: '12px 32px',
            borderRadius: 10,
            boxShadow: '0 0 20px rgba(168,85,247,.35)',
          }}
        >
          เข้าสู่ระบบ →
        </Link>
      </div>
    </div>
  )
}