import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Tag, Avatar, Breadcrumb, message } from 'antd'
import { HomeOutlined, BarChartOutlined, UserOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'

const NewsDetail: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const [news, setNews] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNewsDetail()
  }, [params.id])

  const loadNewsDetail = async () => {
    try {
      const response = await fetch(`/api/v1/website/news/${params.id}`)
      const data = await response.json()
      setNews(data)
    } catch (error) {
      message.error('加载新闻详情失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !news) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        加载中...
      </div>
    )
  }

  const categoryTags: Record<string, { color: string; text: string }> = {
    'company': { color: 'blue', text: '企业新闻' },
    'industry': { color: 'green', text: '行业资讯' },
    'tech': { color: 'purple', text: '技术文章' },
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 导航栏 */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        padding: '20px 50px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ margin: 0, fontSize: 20, color: '#fff', fontWeight: 700 }}>四川道达智能</h1>
        <Space size="large">
          <a href="/" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>首页</a>
          <a href="/products" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>产品</a>
          <a href="/solutions" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>解决方案</a>
          <a href="/news" style={{ color: '#1890ff', fontSize: 14, textDecoration: 'none' }}>新闻</a>
          <a href="/cases" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>案例</a>
          <a href="/about" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>关于</a>
          <a href="/contact" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>联系</a>
          <Button type="primary" size="small" onClick={() => window.location.href = '/login'}>登录系统</Button>
        </Space>
      </div>

      {/* 面包屑 */}
      <div style={{ padding: '100px 50px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
              <span>首页</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/news">
              <BarChartOutlined />
              <span>新闻中心</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{news.title}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* 新闻详情 */}
      <div style={{ padding: '0 50px 80px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 新闻主图 + 标题 */}
            <Card style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 24 }}>
                <Tag color={categoryTags[news.category]?.color || 'default'} style={{ fontSize: 14 }}>
                  {categoryTags[news.category]?.text || news.category}
                </Tag>
              </div>
              <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 24, lineHeight: 1.4 }}>{news.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, color: '#999', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  <span>{news.author}</span>
                </div>
                <div>
                  <span>{new Date(news.publishDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span>阅读：{news.viewCount || 0}</span>
                </div>
              </div>
              <div style={{ height: 400, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChartOutlined style={{ fontSize: 120, color: '#d9d9d9' }} />
              </div>
            </Card>

            {/* 新闻内容 */}
            <Card title="新闻详情" style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 16, lineHeight: 2, color: '#333' }}>
                <p style={{ marginBottom: 24 }}>{news.content}</p>
                <h2 style={{ fontSize: 24, fontWeight: 600, marginTop: 40, marginBottom: 16 }}>核心亮点</h2>
                <ul style={{ marginBottom: 24 }}>
                  {news.highlights?.map((highlight: string, index: number) => (
                    <li key={index} style={{ marginBottom: 12, lineHeight: 1.8 }}>{highlight}</li>
                  ))}
                </ul>
                <h2 style={{ fontSize: 24, fontWeight: 600, marginTop: 40, marginBottom: 16 }}>关于我们</h2>
                <p style={{ marginBottom: 24 }}>
                  四川道达智能车辆制造有限公司是一家专注于企业数字化管理系统研发的高新技术企业，
                  提供 CRM、ERP、财务管理等一体化解决方案，已服务超过 1000+ 企业客户。
                </p>
              </div>
            </Card>

            {/* 分享按钮 */}
            <Card>
              <Space size="large" style={{ justifyContent: 'center' }}>
                <Button size="large" onClick={() => window.location.href = '/news'}>
                  返回新闻列表
                </Button>
                <Button type="primary" size="large" onClick={() => window.location.href = '/contact'}>
                  联系咨询
                </Button>
              </Space>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 页脚 */}
      <div style={{ padding: '80px 50px', background: '#000', color: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 60, marginBottom: 60 }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>产品</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>CRM 系统</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>ERP 系统</p>
              <p style={{ fontSize: 14, color: '#999' }}>财务管理</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>公司</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>关于我们</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>联系方式</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>支持</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>技术支持</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>文档中心</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>联系</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>info@ddzn.com</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>400-888-8888</p>
              <p style={{ fontSize: 14, color: '#999' }}>四川省眉山市</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: 40, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#666' }}>
              © 2026 四川道达智能车辆制造有限公司。All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsDetail
