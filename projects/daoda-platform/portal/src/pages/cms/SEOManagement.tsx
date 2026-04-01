/**
 * SEO管理页面
 * SEO设置、关键词管理、元数据配置
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Statistic,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  message,
  Progress,
  Tabs,
  Divider,
  Tooltip,
  Alert,
  List,
  Badge,
} from 'antd'
import {
  SearchOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  ArrowUpOutlined,
  TagsOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const TextArea = Input.TextArea

// SEO状态
enum SEOStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

// SEO类型
enum SEOType {
  PAGE = 'PAGE',
  ARTICLE = 'ARTICLE',
  PRODUCT = 'PRODUCT',
  GLOBAL = 'GLOBAL',
}

// 关键词类型
enum KeywordType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  LONG_TAIL = 'LONG_TAIL',
}

interface SEOConfig {
  id: string
  type: SEOType
  targetName?: string
  title: string
  description: string
  keywords: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  status: SEOStatus
  analytics?: {
    impressions?: number
    clicks?: number
    avgPosition?: number
    ctr?: number
  }
}

interface Keyword {
  id: string
  word: string
  type: KeywordType
  searchVolume?: number
  difficulty?: number
  currentPosition?: number
}

interface SEOAnalysis {
  score: number
  issues: { type: string; field: string; message: string }[]
  suggestions: string[]
}

export default function SEOManagement() {
  const [seoConfigs, setSeoConfigs] = useState<SEOConfig[]>([])
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [keywordModalVisible, setKeywordModalVisible] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState<SEOConfig | null>(null)
  const [analysisModalVisible, setAnalysisModalVisible] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<SEOAnalysis | null>(null)
  const [stats, setStats] = useState({
    totalConfigs: 5,
    activeConfigs: 4,
    totalKeywords: 9,
    primaryKeywords: 3,
    avgPosition: 15.3,
    avgCTR: 5.0,
    totalImpressions: 50000,
    totalClicks: 2500,
  })
  const [form] = Form.useForm()
  const [keywordForm] = Form.useForm()

  useEffect(() => {
    fetchSEOConfigs()
    fetchKeywords()
    fetchStats()
  }, [])

  const fetchSEOConfigs = async () => {
    setLoading(true)
    const mockData: SEOConfig[] = [
      {
        id: 'SEO-GLOBAL',
        type: SEOType.GLOBAL,
        targetName: '全局设置',
        title: '道达智能 - 智能车辆管理平台',
        description: '道达智能科技有限公司专注于智能车辆管理解决方案，提供车联网、车队管理、智能调度等一体化服务',
        keywords: ['智能车辆', '车队管理', '车联网', '车辆监控', '智能调度'],
        ogTitle: '道达智能 - 智能车辆管理平台',
        ogDescription: '专业的智能车辆管理解决方案提供商',
        ogImage: '/images/og-image.png',
        status: SEOStatus.ACTIVE,
        analytics: { impressions: 50000, clicks: 2500, avgPosition: 15.3, ctr: 5.0 },
      },
      {
        id: 'SEO-PAGE-001',
        type: SEOType.PAGE,
        targetName: '首页',
        title: '道达智能官网 - 智能车辆管理解决方案',
        description: '道达智能提供专业智能车辆管理平台，涵盖车辆监控、车队调度、油耗管理、安全预警等功能',
        keywords: ['道达智能', '车辆管理平台', '车队管理系统'],
        status: SEOStatus.ACTIVE,
        analytics: { impressions: 15000, clicks: 750, avgPosition: 8.5, ctr: 5.0 },
      },
      {
        id: 'SEO-PAGE-002',
        type: SEOType.PAGE,
        targetName: '产品中心',
        title: '产品中心 - 道达智能车辆管理产品',
        description: '道达智能产品中心，提供车联网终端、车队管理平台、智能调度系统等产品',
        keywords: ['车联网终端', '车队管理平台', '智能调度系统'],
        status: SEOStatus.ACTIVE,
        analytics: { impressions: 8000, clicks: 320, avgPosition: 12.0, ctr: 4.0 },
      },
      {
        id: 'SEO-PAGE-003',
        type: SEOType.PAGE,
        targetName: '解决方案',
        title: '解决方案 - 道达智能行业解决方案',
        description: '道达智能为物流运输、公共交通、企业车队等行业提供定制化智能管理解决方案',
        keywords: ['车队解决方案', '物流车队管理', '公共交通管理'],
        status: SEOStatus.ACTIVE,
        analytics: { impressions: 5000, clicks: 200, avgPosition: 18.5, ctr: 4.0 },
      },
      {
        id: 'SEO-PAGE-004',
        type: SEOType.PAGE,
        targetName: '关于我们',
        title: '关于道达智能 - 公司介绍',
        description: '道达智能科技有限公司是一家专注于智能车辆管理领域的创新型科技企业',
        keywords: ['道达智能', '公司介绍', '企业愿景'],
        status: SEOStatus.DRAFT,
        analytics: { impressions: 2000, clicks: 80, avgPosition: 25.0, ctr: 4.0 },
      },
    ]
    setSeoConfigs(mockData)
    setLoading(false)
  }

  const fetchKeywords = async () => {
    const mockKeywords: Keyword[] = [
      { id: 'KW-001', word: '车队管理系统', type: KeywordType.PRIMARY, searchVolume: 5000, difficulty: 45, currentPosition: 12 },
      { id: 'KW-002', word: '车辆管理平台', type: KeywordType.PRIMARY, searchVolume: 3000, difficulty: 35, currentPosition: 8 },
      { id: 'KW-003', word: '车联网', type: KeywordType.PRIMARY, searchVolume: 8000, difficulty: 60, currentPosition: 25 },
      { id: 'KW-004', word: '智能车辆管理', type: KeywordType.SECONDARY, searchVolume: 2000, difficulty: 30, currentPosition: 15 },
      { id: 'KW-005', word: '车辆监控系统', type: KeywordType.SECONDARY, searchVolume: 1500, difficulty: 25, currentPosition: 10 },
      { id: 'KW-006', word: '物流车队管理', type: KeywordType.SECONDARY, searchVolume: 1800, difficulty: 28, currentPosition: 18 },
      { id: 'KW-007', word: 'GPS车辆定位', type: KeywordType.LONG_TAIL, searchVolume: 800, difficulty: 15, currentPosition: 5 },
      { id: 'KW-008', word: '油耗管理系统', type: KeywordType.LONG_TAIL, searchVolume: 500, difficulty: 12, currentPosition: 3 },
      { id: 'KW-009', word: '司机管理软件', type: KeywordType.LONG_TAIL, searchVolume: 400, difficulty: 10, currentPosition: 7 },
    ]
    setKeywords(mockKeywords)
  }

  const fetchStats = async () => {
    setStats({
      totalConfigs: 5,
      activeConfigs: 4,
      totalKeywords: 9,
      primaryKeywords: 3,
      avgPosition: 15.3,
      avgCTR: 5.0,
      totalImpressions: 50000,
      totalClicks: 2500,
    })
  }

  const getTypeTag = (type: SEOType) => {
    const config: Record<SEOType, { color: string; text: string }> = {
      GLOBAL: { color: 'gold', text: '全局' },
      PAGE: { color: 'blue', text: '页面' },
      ARTICLE: { color: 'green', text: '文章' },
      PRODUCT: { color: 'purple', text: '产品' },
    }
    const c = config[type]
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const getStatusTag = (status: SEOStatus) => {
    const config: Record<SEOStatus, { color: string; icon: any; text: string }> = {
      ACTIVE: { color: 'success', icon: <CheckCircleOutlined />, text: '已启用' },
      INACTIVE: { color: 'default', icon: <ExclamationCircleOutlined />, text: '未启用' },
      DRAFT: { color: 'warning', icon: <EditOutlined />, text: '草稿' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getKeywordTypeTag = (type: KeywordType) => {
    const config: Record<KeywordType, { color: string; text: string }> = {
      PRIMARY: { color: 'gold', text: '主关键词' },
      SECONDARY: { color: 'blue', text: '次关键词' },
      LONG_TAIL: { color: 'green', text: '长尾词' },
    }
    const c = config[type]
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const handleAnalyze = (config: SEOConfig) => {
    setSelectedConfig(config)
    
    // 模拟SEO分析
    let score = 85
    const issues: any[] = []
    
    if (!config.title) {
      issues.push({ type: 'error', field: 'title', message: '标题缺失' })
      score -= 20
    } else if (config.title.length < 30) {
      issues.push({ type: 'warning', field: 'title', message: '标题过短，建议30-60字符' })
      score -= 10
    }
    
    if (!config.description) {
      issues.push({ type: 'error', field: 'description', message: '描述缺失' })
      score -= 15
    } else if (config.description.length < 120) {
      issues.push({ type: 'warning', field: 'description', message: '描述过短，建议120-160字符' })
      score -= 8
    }
    
    if (!config.keywords || config.keywords.length < 3) {
      issues.push({ type: 'warning', field: 'keywords', message: '关键词数量不足，建议5-10个' })
      score -= 8
    }
    
    if (!config.ogImage) {
      issues.push({ type: 'info', field: 'ogImage', message: 'OG图片缺失，建议添加' })
      score -= 5
    }
    
    setAnalysisResult({
      score: Math.max(0, score),
      issues,
      suggestions: [
        '确保关键词出现在标题前半部分',
        '在描述中自然包含主要关键词',
        '为重要页面添加结构化数据',
      ],
    })
    setAnalysisModalVisible(true)
  }

  const seoColumns: ColumnsType<SEOConfig> = [
    {
      title: '页面/目标',
      dataIndex: 'targetName',
      width: 120,
      render: (text: string, record) => (
        <Space>
          {getTypeTag(record.type)}
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
      ellipsis: true,
      render: (text: string) => <Text ellipsis>{text}</Text>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true,
      render: (text: string) => <Text ellipsis type="secondary">{text}</Text>,
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      width: 150,
      render: (keywords: string[]) => (
        <Space direction="vertical" size="small">
          {keywords.slice(0, 3).map(k => <Tag key={k}>{k}</Tag>)}
          {keywords.length > 3 && <Text type="secondary">+{keywords.length - 3}</Text>}
        </Space>
      ),
    },
    {
      title: '展现量',
      dataIndex: 'analytics',
      width: 80,
      render: (analytics?: any) => <Text>{analytics?.impressions?.toLocaleString() || 0}</Text>,
    },
    {
      title: '点击率',
      dataIndex: 'analytics',
      width: 80,
      render: (analytics?: any) => (
        <Progress
          percent={analytics?.ctr || 0}
          size="small"
          strokeColor="#52c41a"
          format={() => `${analytics?.ctr}%`}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: '平均排名',
      dataIndex: 'analytics',
      width: 80,
      render: (analytics?: any) => <Badge count={analytics?.avgPosition || 0} style={{ backgroundColor: '#1890ff' }} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: SEOStatus) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" icon={<SearchOutlined />} onClick={() => handleAnalyze(record)}>分析</Button>
        </Space>
      ),
    },
  ]

  const keywordColumns: ColumnsType<Keyword> = [
    {
      title: '关键词',
      dataIndex: 'word',
      width: 150,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (type: KeywordType) => getKeywordTypeTag(type),
    },
    {
      title: '搜索量',
      dataIndex: 'searchVolume',
      width: 100,
      render: (volume?: number) => <Text>{volume?.toLocaleString() || '-'}</Text>,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      width: 80,
      render: (difficulty?: number) => (
        <Progress
          percent={difficulty || 0}
          size="small"
          strokeColor={(difficulty || 0) > 50 ? '#ff4d4f' : (difficulty || 0) > 30 ? '#faad14' : '#52c41a'}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: '当前排名',
      dataIndex: 'currentPosition',
      width: 80,
      render: (position?: number) => (
        position ? (
          <Badge count={position} style={{ backgroundColor: position <= 10 ? '#52c41a' : '#1890ff' }} />
        ) : '-'
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ]

  const handleCreateSEO = async () => {
    try {
      const values = await form.validateFields()
      message.success('创建成功')
      setModalVisible(false)
      fetchSEOConfigs()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleCreateKeyword = async () => {
    try {
      const values = await keywordForm.validateFields()
      message.success('关键词添加成功')
      setKeywordModalVisible(false)
      fetchKeywords()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <GlobalOutlined style={{ marginRight: 8 }} />
            SEO管理
          </Title>
          <Text type="secondary">SEO设置、关键词管理、元数据配置</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalVisible(true) }} style={{ marginRight: 8 }}>
            新建SEO配置
          </Button>
          <Button type="primary" icon={<TagsOutlined />} onClick={() => { keywordForm.resetFields(); setKeywordModalVisible(true) }}>
            添加关键词
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">SEO配置</Text>}
              value={stats.activeConfigs}
              suffix={`/ ${stats.totalConfigs}`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">关键词数</Text>}
              value={stats.totalKeywords}
              prefix={<TagsOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">主关键词</Text>}
              value={stats.primaryKeywords}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均排名</Text>}
              value={stats.avgPosition}
              prefix={<LineChartOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">展现量</Text>}
              value={stats.totalImpressions}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">点击率</Text>}
              value={stats.avgCTR}
              suffix="%"
              prefix={<BarChartOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* SEO配置和关键词 */}
      <Tabs defaultActiveKey="seo">
        <TabPane tab="SEO配置" key="seo">
          <Card className="daoda-card">
            <Table
              columns={seoColumns}
              dataSource={seoConfigs}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="关键词库" key="keywords">
          <Card className="daoda-card">
            <Table
              columns={keywordColumns}
              dataSource={keywords}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 新建SEO配置弹窗 */}
      <Modal
        title="新建SEO配置"
        open={modalVisible}
        onOk={handleCreateSEO}
        onCancel={() => setModalVisible(false)}
        width={700}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                <Select placeholder="请选择类型">
                  <Option value={SEOType.PAGE}>页面SEO</Option>
                  <Option value={SEOType.ARTICLE}>文章SEO</Option>
                  <Option value={SEOType.PRODUCT}>产品SEO</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="targetName" label="目标名称" rules={[{ required: true }]}>
                <Input placeholder="请输入页面/文章/产品名称" />
              </Form.Item>
            </Col>
          </Row>
          <Divider>基础SEO</Divider>
          <Form.Item name="title" label="页面标题" rules={[{ required: true }]} extra="建议30-60字符">
            <Input placeholder="请输入SEO标题" maxLength={60} showCount />
          </Form.Item>
          <Form.Item name="description" label="页面描述" rules={[{ required: true }]} extra="建议120-160字符">
            <TextArea placeholder="请输入SEO描述" maxLength={160} showCount rows={3} />
          </Form.Item>
          <Form.Item name="keywords" label="关键词" extra="多个关键词用逗号分隔">
            <Input placeholder="关键词1, 关键词2, 关键词3" />
          </Form.Item>
          <Divider>社交媒体OG标签</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ogTitle" label="OG标题">
                <Input placeholder="社交媒体分享标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ogImage" label="OG图片">
                <Input placeholder="图片URL" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="ogDescription" label="OG描述">
            <TextArea placeholder="社交媒体分享描述" rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加关键词弹窗 */}
      <Modal
        title="添加关键词"
        open={keywordModalVisible}
        onOk={handleCreateKeyword}
        onCancel={() => setKeywordModalVisible(false)}
        width={500}
        okText="添加"
        cancelText="取消"
      >
        <Form form={keywordForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="word" label="关键词" rules={[{ required: true }]}>
            <Input placeholder="请输入关键词" />
          </Form.Item>
          <Form.Item name="type" label="关键词类型" rules={[{ required: true }]}>
            <Select placeholder="请选择类型">
              <Option value={KeywordType.PRIMARY}>主关键词</Option>
              <Option value={KeywordType.SECONDARY}>次关键词</Option>
              <Option value={KeywordType.LONG_TAIL}>长尾关键词</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="searchVolume" label="预估搜索量">
                <Input placeholder="如: 5000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="difficulty" label="难度系数(0-100)">
                <Input placeholder="如: 45" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* SEO分析弹窗 */}
      <Modal
        title="SEO分析报告"
        open={analysisModalVisible}
        onCancel={() => setAnalysisModalVisible(false)}
        footer={null}
        width={600}
      >
        {analysisResult && selectedConfig && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Progress
                type="circle"
                percent={analysisResult.score}
                strokeColor={analysisResult.score >= 80 ? '#52c41a' : analysisResult.score >= 60 ? '#faad14' : '#ff4d4f'}
                format={() => <span style={{ fontSize: 24 }}>{analysisResult.score}<small>分</small></span>}
                width={120}
              />
              <Title level={5} style={{ marginTop: 8 }}>
                {analysisResult.score >= 80 ? 'SEO表现良好' : analysisResult.score >= 60 ? 'SEO有待优化' : 'SEO需要改进'}
              </Title>
            </div>
            
            {analysisResult.issues.length > 0 && (
              <Card title="发现问题" size="small" style={{ marginBottom: 16 }}>
                <List
                  dataSource={analysisResult.issues}
                  renderItem={(issue: any) => (
                    <List.Item>
                      <Space>
                        {issue.type === 'error' && <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
                        {issue.type === 'warning' && <ExclamationCircleOutlined style={{ color: '#faad14' }} />}
                        {issue.type === 'info' && <BulbOutlined style={{ color: '#1890ff' }} />}
                        <Text>{issue.field}: {issue.message}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            )}
            
            {analysisResult.suggestions.length > 0 && (
              <Card title="优化建议" size="small">
                <List
                  dataSource={analysisResult.suggestions}
                  renderItem={(suggestion: string) => (
                    <List.Item>
                      <BulbOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      <Text>{suggestion}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}