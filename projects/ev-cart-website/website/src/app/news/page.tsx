import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Space, Pagination, Tag } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

interface News {
  id: string
  title: string
  category: string
  summary: string
  publishDate: string
  author: string
  image?: string
}

const News: React.FC = () => {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadNews()
  }, [page])

  const loadNews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
      })

      const response = await fetch(`/api/v1/website/news?${params}`)
      const data = await response.json()

      setNews(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Load news failed:', error)
    } finally {
      setLoading(false)
    }
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

      {/* Hero 区域 */}
      <div style={{ 
        height: '60vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        marginTop: 64
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ fontSize: 64, fontWeight: 700, marginBottom: 24 }}>新闻中心</h1>
          <p style={{ fontSize: 24, opacity: 0.8 }}>
            了解最新的企业动态和行业资讯
          </p>
        </motion.div>
      </div>

      {/* 新闻列表 */}
      <div style={{ padding: '80px 50px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            {news.map((item, index) => (
              <Col span={8} key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    hoverable
                    cover={
                      <div style={{ height: 200, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BarChartOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />
                      </div>
                    }
                    actions={[
                      <Button type="link" key="read">阅读全文 →</Button>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div style={{ marginBottom: 8 }}>
                          <Tag color={categoryTags[item.category]?.color || 'default'}>
                            {categoryTags[item.category]?.text || item.category}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <h3 style={{ fontSize: 18, marginBottom: 12, height: 48, overflow: 'hidden' }}>
                            {item.title}
                          </h3>
                          <p style={{ color: '#999', marginBottom: 16, height: 60, overflow: 'hidden' }}>
                            {item.summary}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: 14 }}>
                            <span>{item.author}</span>
                            <span>{new Date(item.publishDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* 分页 */}
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <Pagination 
              current={page} 
              total={total} 
              pageSize={9}
              onChange={setPage}
              showTotal={(total) => `共 ${total} 条新闻`}
            />
          </div>
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

export default News
