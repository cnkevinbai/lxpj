import React from 'react'
import { redirect } from 'next/navigation'

// CRM 系统入口页面
const CrmPortal: React.FC = () => {
  // 检查登录状态
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  
  if (!token) {
    redirect('/login')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 72, marginBottom: 24 }}>📊</h1>
        <h2 style={{ fontSize: 48, marginBottom: 16 }}>CRM 系统</h2>
        <p style={{ fontSize: 20, marginBottom: 48, opacity: 0.9 }}>
          客户管理 · 订单管理 · 经销商管理
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          <a 
            href="/crm/customers"
            style={{
              padding: '16px 48px',
              background: '#fff',
              color: '#1890ff',
              borderRadius: 28,
              textDecoration: 'none',
              fontSize: 18,
              fontWeight: 600
            }}
          >
            进入客户管理
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

export default CrmPortal
