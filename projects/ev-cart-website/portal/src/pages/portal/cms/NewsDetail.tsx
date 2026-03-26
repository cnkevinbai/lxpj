import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Space, Tag, Typography, Divider, Image, Spin, Alert, Statistic, Row, Col, Avatar, Tooltip } from 'antd'
import { 
  EyeOutlined, 
  LikeOutlined, 
  ShareAltOutlined, 
  BackwardOutlined,
  EditOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

interface NewsDetail {
  id: string
  title: string
  category: string
  author: string
  publishDate: string
  excerpt: string
  content: string
  coverImage: string
  images?: string[]
  tags: string[]
  views: number
  likes: number
  status: 'published' | 'draft' | 'scheduled'
  createdAt: string
  updatedAt: string
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [news, setNews] = useState<NewsDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [liked, setLiked] = useState(false)

  const categoryColors: Record<string, string> = {
    '公司动态': 'blue',
    '行业新闻': 'green',
    '产品发布': 'orange',
    '技术文章': 'purple',
    '活动预告': 'red',
  }

  const fetchNews = async () => {
    setLoading(true)
    try {
      // TODO: 调用 API
      // const response = await fetch(`/api/v1/news/${id}`)
      // const data = await response.json()
      
      // Mock data for development
      const mockData: NewsDetail = {
        id: id || '1',
        title: '道达智能荣获 2025 年度新能源汽车行业创新企业奖',
        category: '公司动态',
        author: '市场部',
        publishDate: '2026-03-10',
        excerpt: '在第十三届中国新能源汽车产业峰会上，道达智能凭借在智能换电领域的创新突破，荣获年度创新企业奖。',
        content: `
          <h3>获奖背景</h3>
          <p>2026 年 3 月 8 日，第十三届中国新能源汽车产业峰会在北京隆重召开。本次峰会汇聚了来自全国的新能源汽车产业链企业、专家学者和政府代表，共同探讨行业发展趋势和创新方向。</p>
          
          <h3>创新成果</h3>
          <p>道达智能自成立以来，始终致力于新能源汽车智能换电技术的研发和应用。我们的核心产品——智能换电柜系统，已经在全国 20 多个城市部署，服务超过 10 万辆电动两轮车用户。</p>
          
          <h4>技术亮点：</h4>
          <ul>
            <li>AI 智能识别电池健康状态，确保换电安全</li>
            <li>5G 物联网技术，实现远程监控和故障预警</li>
            <li>模块化设计，支持快速部署和灵活扩容</li>
            <li>智能调度算法，优化电池流转效率</li>
          </ul>
          
          <h3>未来规划</h3>
          <p>获得此项荣誉是对我们团队辛勤工作的肯定。2026 年，我们将继续加大研发投入，计划新增 50 个城市的服务网络，为更多用户提供便捷的智能换电服务。</p>
          
          <p>同时，我们也将积极探索新技术应用，包括：</p>
          <ol>
            <li>与主机厂合作，推动换电标准统一</li>
            <li>研发第三代智能换电柜，提升换电效率 30%</li>
            <li>布局海外市场，拓展东南亚业务</li>
          </ol>
          
          <h3>感谢与展望</h3>
          <p>感谢所有合作伙伴和用户的支持！道达智能将继续秉持"创新、品质、服务"的理念，为新能源汽车产业发展贡献力量。</p>
        `,
        coverImage: '/images/news/award-2025.jpg',
        images: [
          '/images/news/award-ceremony-1.jpg',
          '/images/news/award-ceremony-2.jpg',
          '/images/news/product-display.jpg',
        ],
        tags: ['获奖', '创新企业', '新能源汽车'],
        views: 1280,
        likes: 156,
        status: 'published',
        createdAt: '2026-03-10T10:00:00Z',
        updatedAt: '2026-03-10T10:00:00Z',
      }
      
      setNews(mockData)
    } catch (error) {
      console.error('加载新闻详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchNews()
    }
  }, [id])

  const handleLike = () => {
    setLiked(!liked)
    // TODO: 调用 API 更新点赞数
  }

  const handleShare = () => {
    // TODO: 实现分享功能
    alert('分享功能开发中...')
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (!news) {
    return (
      <Alert
        message="新闻不存在"
        description="该新闻可能已被删除或链接有误"
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => navigate('/news')}>
            返回新闻列表
          </Button>
        }
      />
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* 返回按钮 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<BackwardOutlined />} onClick={() => navigate('/news')}>
            返回新闻列表
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/news/${id}/edit`)}
          >
            编辑新闻
          </Button>
        </Space>
      </Card>

      {/* 新闻标题 */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={2} style={{ marginBottom: 16 }}>
          {news.title}
        </Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col>
            <Tag color={categoryColors[news.category] || 'default'}>
              {news.category}
            </Tag>
          </Col>
          <Col>
            <Text type="secondary">
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {news.publishDate}
            </Text>
          </Col>
          <Col>
            <Text type="secondary">
              <UserOutlined style={{ marginRight: 4 }} />
              {news.author}
            </Text>
          </Col>
        </Row>

        {/* 统计信息 */}
        <Row gutter={16}>
          <Col>
            <Statistic
              title="阅读"
              value={news.views}
              prefix={<EyeOutlined />}
              valueStyle={{ fontSize: 16 }}
            />
          </Col>
          <Col>
            <Statistic
              title="点赞"
              value={news.likes + (liked ? 1 : 0)}
              prefix={
                <LikeOutlined 
                  style={{ cursor: 'pointer', color: liked ? '#ff4d4f' : undefined }} 
                  onClick={handleLike}
                />
              }
              valueStyle={{ fontSize: 16 }}
            />
          </Col>
          <Col>
            <Statistic
              title="分享"
              value={0}
              prefix={<ShareAltOutlined style={{ cursor: 'pointer' }} onClick={handleShare} />}
              valueStyle={{ fontSize: 16 }}
            />
          </Col>
        </Row>
      </Card>

      {/* 封面图 */}
      {news.coverImage && (
        <Card style={{ marginBottom: 16, padding: 0 }}>
          <Image
            src={news.coverImage}
            alt={news.title}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            fallback="/images/placeholder.jpg"
          />
        </Card>
      )}

      {/* 新闻内容 */}
      <Card title="新闻详情" style={{ marginBottom: 16 }}>
        <div 
          style={{ 
            fontSize: '16px', 
            lineHeight: '1.8',
            color: '#333'
          }}
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
        
        <Divider />
        
        {/* 标签 */}
        {news.tags.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary" style={{ marginRight: 8 }}>
              <TagOutlined /> 标签：
            </Text>
            {news.tags.map((tag, index) => (
              <Tag key={index} style={{ cursor: 'pointer' }}>
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </Card>

      {/* 相关新闻图片 */}
      {news.images && news.images.length > 0 && (
        <Card title="相关新闻图片" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            {news.images.map((img, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Image
                  src={img}
                  alt={`新闻图片 ${index + 1}`}
                  style={{ width: '100%', borderRadius: 8 }}
                  fallback="/images/placeholder.jpg"
                />
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* 上一篇/下一篇 */}
      <Card>
        <Row justify="space-between">
          <Button onClick={() => navigate('/news')}>
            ← 上一篇新闻
          </Button>
          <Button onClick={() => navigate('/news')} type="primary">
            下一篇新闻 →
          </Button>
        </Row>
      </Card>
    </div>
  )
}

export default NewsDetail
