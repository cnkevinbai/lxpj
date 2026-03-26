import { useState } from 'react'
import { Typography, Card, Row, Col, Table, Button, Space, Tag, Input, Select, Badge, Upload, message } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  TagsOutlined,
  InboxOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography
const { Dragger } = Upload

const CMS = () => {
  const [selectedTab, setSelectedTab] = useState('news')

  // 新闻数据
  const newsData: { key: string; title: string; category: string; author: string; publishDate: string; status: string; views: number }[] = [
    { key: '1', title: '道达智能参加 2026 年新能源车展', category: '公司新闻', author: '张三', publishDate: '2026-03-14', status: 'published', views: 1256 },
    { key: '2', title: '新款无人驾驶观光车正式发布', category: '产品新闻', author: '李四', publishDate: '2026-03-12', status: 'published', views: 2345 },
    { key: '3', title: '道达智能获得高新技术企业认证', category: '公司荣誉', author: '王五', publishDate: '2026-03-10', status: 'draft', views: 0 },
  ]

  // 案例数据
  const caseData: { key: string; title: string; customer: string; industry: string; publishDate: string; status: string; views: number }[] = [
    { key: '1', title: '某某 5A 景区观光车项目', customer: '某某景区', industry: '景区', publishDate: '2026-03-08', status: 'published', views: 856 },
    { key: '2', title: '某某园区电动巡逻车采购项目', customer: '某某园区', industry: '园区', publishDate: '2026-03-05', status: 'published', views: 654 },
  ]

  const stats = [
    { label: '文章总数', value: 256, suffix: '篇', icon: <FileTextOutlined />, color: '#1890FF' },
    { label: '本月发布', value: 28, suffix: '篇', icon: <PlusOutlined />, color: '#52C41A' },
    { label: '总阅读量', value: '125,680', suffix: '次', icon: <VideoCameraOutlined />, color: '#FAAD14' },
    { label: '素材文件', value: '1.2', suffix: 'GB', icon: <PictureOutlined />, color: '#722ED1' },
  ]

  const newsColumns = [
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '作者', dataIndex: 'author', key: 'author' },
    { title: '发布日期', dataIndex: 'publishDate', key: 'publishDate' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          published: { text: '已发布', color: 'green' },
          draft: { text: '草稿', color: 'gray' },
          reviewing: { text: '审核中', color: 'orange' },
        }
        const s = statusMap[status] || { text: status, color: 'default' }
        return <Badge color={s.color} text={s.text} />
      },
    },
    { title: '阅读量', dataIndex: 'views', key: 'views' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="cms-page">
      {/* Header */}
      <div className="cms-header">
        <div className="header-content">
          <div>
            <Title level={2} style={{ margin: 0, color: '#FFFFFF' }}>CMS 内容管理系统</Title>
            <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Content Management System</Paragraph>
          </div>
          <Space size="large">
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新建内容
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="cms-stats">
        <Row gutter={[24, 24]}>
          {stats.map((stat, i) => (
            <Col xs={12} sm={6} key={i}>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                  <div className="stat-info">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value" style={{ color: stat.color }}>
                      {stat.value}{stat.suffix}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Tabs */}
      <Card className="cms-tabs">
        <div className="tab-buttons">
          <Button
            type={selectedTab === 'news' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('news')}
          >
            <FileTextOutlined /> 新闻管理
          </Button>
          <Button
            type={selectedTab === 'cases' ? 'primary' : 'default'}
            onClick={() => setSelectedTab('cases')}
          >
            <VideoCameraOutlined /> 案例管理
          </Button>
          <Button type="default">
            <PictureOutlined /> 素材管理
          </Button>
          <Button type="default">
            <TagsOutlined /> 标签管理
          </Button>
        </div>

        {/* 筛选区 */}
        <div className="filter-section">
          <Space wrap size="large">
            <Input
              placeholder="搜索标题、作者..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Select placeholder="分类" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="company">公司新闻</Select.Option>
              <Select.Option value="product">产品新闻</Select.Option>
              <Select.Option value="honor">公司荣誉</Select.Option>
            </Select>
            <Select placeholder="状态" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="published">已发布</Select.Option>
              <Select.Option value="draft">草稿</Select.Option>
            </Select>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={newsColumns}
          dataSource={selectedTab === 'news' ? newsData : caseData}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          size="middle"
        />

        {/* 素材管理 - 上传区域 */}
        {selectedTab === 'materials' && (
          <div className="upload-section">
            <Dragger>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">支持图片、视频、文档等格式</p>
            </Dragger>
          </div>
        )}
      </Card>

      <style>{`
        .cms-page { min-height: 100vh; background: #F0F2F5; }
        
        .cms-header {
          background: linear-gradient(135deg, #F5222D 0%, #CF1322 100%);
          padding: 24px 24px;
          margin-bottom: 24px;
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .cms-stats { padding: 0 24px 24px; }
        
        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .stat-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .stat-icon {
          font-size: 40px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
        }
        
        .stat-label {
          color: #8C8C8C;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: bold;
        }
        
        .cms-tabs {
          margin: 0 24px 24px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .tab-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #F0F0F0;
        }
        
        .filter-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #F0F0F0;
        }
        
        .upload-section {
          margin-top: 24px;
        }
        
        @media (max-width: 768px) {
          .header-content { flex-direction: column; gap: 16px; }
          .stat-content { flex-direction: column; text-align: center; }
          .tab-buttons { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  )
}

export default CMS
