import React from 'react'
import { redirect } from 'next/navigation'

// 售后管理系统入口页面
const ServicePortal: React.FC = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  
  if (!token) {
    redirect('/login')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 72, marginBottom: 24 }}>🔧</h1>
        <h2 style={{ fontSize: 48, marginBottom: 16 }}>售后管理</h2>
        <p style={{ fontSize: 20, marginBottom: 48, opacity: 0.9 }}>
          服务请求 · 工单管理 · 客户反馈
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          <a 
            href="/service/tickets"
            style={{
              padding: '16px 48px',
              background: '#fff',
              color: '#52c41a',
              borderRadius: 28,
              textDecoration: 'none',
              fontSize: 18,
              fontWeight: 600
            }}
          >
            我的工单
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

export default ServicePortal
