import React from 'react'
import { redirect } from 'next/navigation'

// ERP 系统入口页面
const ErpPortal: React.FC = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  
  if (!token) {
    redirect('/login')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 72, marginBottom: 24 }}>🏭</h1>
        <h2 style={{ fontSize: 48, marginBottom: 16 }}>ERP 系统</h2>
        <p style={{ fontSize: 20, marginBottom: 48, opacity: 0.9 }}>
          采购管理 · 生产管理 · 库存管理
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          <a 
            href="/erp/inventory"
            style={{
              padding: '16px 48px',
              background: '#fff',
              color: '#722ed1',
              borderRadius: 28,
              textDecoration: 'none',
              fontSize: 18,
              fontWeight: 600
            }}
          >
            进入库存管理
          </a>
          <a 
            href="/portal"
            style={{
              padding: '16px 48px',
              background: 'transparent',
              color: '#fff',
              borderRadius: 28,
              textDecoration: 'none',
              fontSize: 18,
              fontWeight: 600,
              border: '2px solid #fff'
            }}
          >
            返回门户
          </a>
        </div>
      </div>
    </div>
  )
}

export default ErpPortal
