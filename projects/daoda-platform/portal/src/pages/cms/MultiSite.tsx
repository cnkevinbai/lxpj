/**
 * 多站点管理页面
 * 站点配置、站点切换、站点资源隔离
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Modal,
  Descriptions,
  Badge,
  Tabs,
  Statistic,
  message,
  Tooltip,
  Select,
  List,
  Progress,
  Dropdown,
} from 'antd'
import {
  GlobalOutlined,
  SettingOutlined,
  PlusOutlined,
  EyeOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
  TeamOutlined,
  DesktopOutlined,
  MobileOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs

// 站点状态枚举
enum SiteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  ARCHIVED = 'ARCHIVED',
}

// 站点类型枚举
enum SiteType {
  MAIN = 'MAIN',
  REGIONAL = 'REGIONAL',
  PRODUCT = 'PRODUCT',
  BRAND = 'BRAND',
  MOBILE = 'MOBILE',
  DEMO = 'DEMO',
}

export default function MultiSite() {
  const [siteConfigs, setSiteConfigs] = useState<any[]>([])
  const [siteResources, setSiteResources] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedSite, setSelectedSite] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalSites: 6,
    activeSites: 5,
    totalContent: 145,
    totalPages: 39,
    totalVisits: 35000,
  })
  const [currentSiteId, setCurrentSiteId] = useState('SITE-001')

  useEffect(() => {
    fetchSiteConfigs()
    fetchStats()
  }, [])

  const fetchSiteConfigs = async () => {
    setLoading(true)
    const mockSites = [
      { id: 'SITE-001', name: '道达智能主站', code: 'daoda-main', domain: 'www.daoda.com', type: SiteType.MAIN, status: SiteStatus.ACTIVE, language: 'zh-CN', region: 'CN', theme: 'daoda-dark', title: '道达智能 - 智能车辆管理平台', contentCount: 45, pageCount: 12, visitCount: 15000, createdAt: new Date('2026-01-01'), updatedAt: new Date() },
      { id: 'SITE-002', name: '道达智能英文站', code: 'daoda-en', domain: 'en.daoda.com', type: SiteType.REGIONAL, status: SiteStatus.ACTIVE, language: 'en-US', region: 'US', parentId: 'SITE-001', theme: 'daoda-dark', title: 'Daoda Intelligence', contentCount: 30, pageCount: 8, visitCount: 5000, createdAt: new Date('2026-02-01'), updatedAt: new Date() },
      { id: 'SITE-003', name: 'IOV产品站', code: 'iov-product', domain: 'iov.daoda.com', type: SiteType.PRODUCT, status: SiteStatus.ACTIVE, language: 'zh-CN', region: 'CN', parentId: 'SITE-001', theme: 'iov-theme', title: 'IOV智能车辆管理平台', contentCount: 20, pageCount: 6, visitCount: 8000, createdAt: new Date('2026-02-15'), updatedAt: new Date() },
      { id: 'SITE-004', name: '道达日本站', code: 'daoda-jp', domain: 'jp.daoda.com', type: SiteType.REGIONAL, status: SiteStatus.ACTIVE, language: 'ja-JP', region: 'JP', parentId: 'SITE-001', theme: 'daoda-dark', title: '道達智能', contentCount: 15, pageCount: 5, visitCount: 2000, createdAt: new Date('2026-03-01'), updatedAt: new Date() },
      { id: 'SITE-005', name: '道达演示站', code: 'daoda-demo', domain: 'demo.daoda.com', type: SiteType.DEMO, status: SiteStatus.ACTIVE, language: 'zh-CN', theme: 'demo-theme', title: '道达智能演示平台', contentCount: 10, pageCount: 3, visitCount: 3000, createdAt: new Date('2026-03-10'), updatedAt: new Date() },
      { id: 'SITE-006', name: '道达移动站', code: 'daoda-mobile', type: SiteType.MOBILE, status: SiteStatus.MAINTENANCE, language: 'zh-CN', parentId: 'SITE-001', theme: 'mobile-theme', title: '道达智能移动端', contentCount: 25, pageCount: 5, createdAt: new Date('2026-03-15'), updatedAt: new Date() },
    ]
    setSiteConfigs(mockSites)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({ totalSites: 6, activeSites: 5, totalContent: 145, totalPages: 39, totalVisits: 35000 })
  }

  const fetchSiteResources = async (siteId: string) => {
    const mockResources = [
      { id: 'SR-001', siteId, type: 'CATEGORY', name: '产品动态', count: 10 },
      { id: 'SR-002', siteId, type: 'CATEGORY', name: '成功案例', count: 8 },
      { id: 'SR-003', siteId, type: 'TAG', name: '产品', count: 15 },
      { id: 'SR-004', siteId, type: 'TAG', name: '智能', count: 12 },
      { id: 'SR-005', siteId, type: 'MEDIA', name: '图片库', count: 50 },
      { id: 'SR-006', siteId, type: 'TEMPLATE', name: '文章模板', count: 3 },
      { id: 'SR-007', siteId, type: 'MENU', name: '主导航', count: 8 },
    ]
    setSiteResources(mockResources)
  }

  const getStatusTag = (status: SiteStatus) => {
    const config: Record<SiteStatus, { color: string; icon: any; text: string }> = {
      ACTIVE: { color: 'success', icon: <CheckCircleOutlined />, text: '活跃' },
      INACTIVE: { color: 'default', icon: <ExclamationCircleOutlined />, text: '未激活' },
      MAINTENANCE: { color: 'warning', icon: <ToolOutlined />, text: '维护中' },
      ARCHIVED: { color: 'default', icon: <GlobalOutlined />, text: '已归档' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getSiteTypeTag = (type: SiteType) => {
    const config: Record<SiteType, { color: string; icon: any; text: string }> = {
      MAIN: { color: 'blue', icon: <GlobalOutlined />, text: '主站点' },
      REGIONAL: { color: 'green', icon: <GlobalOutlined />, text: '区域站点' },
      PRODUCT: { color: 'purple', icon: <DesktopOutlined />, text: '产品站点' },
      BRAND: { color: 'cyan', icon: <TeamOutlined />, text: '品牌站点' },
      MOBILE: { color: 'orange', icon: <MobileOutlined />, text: '移动站点' },
      DEMO: { color: 'magenta', icon: <ExperimentOutlined />, text: '演示站点' },
    }
    const c = config[type]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getLanguageTag = (lang: string) => {
    const config: Record<string, { color: string; text: string }> = {
      'zh-CN': { color: 'red', text: '简体中文' },
      'zh-TW': { color: 'red', text: '繁体中文' },
      'en-US': { color: 'blue', text: '美式英语' },
      'en-GB': { color: 'blue', text: '英式英语' },
      'ja-JP': { color: 'volcano', text: '日语' },
      'ko-KR': { color: 'cyan', text: '韩语' },
    }
    return <Tag color={config[lang]?.color || 'default'}>{config[lang]?.text || lang}</Tag>
  }

  const handleSwitchSite = (siteId: string) => {
    const site = siteConfigs.find(s => s.id === siteId)
    if (!site) return
    setCurrentSiteId(siteId)
    message.success(`切换到站点: ${site.name}`)
  }

  const siteColumns: ColumnsType<any> = [
    { title: '站点ID', dataIndex: 'id', width: 100 },
    { title: '站点名称', dataIndex: 'name', width: 150 },
    { title: '域名', dataIndex: 'domain', width: 150, render: (domain: string) => domain ? <Text copyable>{domain}</Text> : '-' },
    { title: '类型', dataIndex: 'type', width: 100, render: (type: SiteType) => getSiteTypeTag(type) },
    { title: '状态', dataIndex: 'status', width: 100, render: (status: SiteStatus) => getStatusTag(status) },
    { title: '语言', dataIndex: 'language', width: 100, render: (lang: string) => getLanguageTag(lang) },
    { title: '内容数', dataIndex: 'contentCount', width: 80, render: (count: number) => count || 0 },
    { title: '页面数', dataIndex: 'pageCount', width: 80, render: (count: number) => count || 0 },
    { title: '访问量', dataIndex: 'visitCount', width: 100, render: (count: number) => count ? `${count / 1000}k` : '-' },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedSite(record); fetchSiteResources(record.id); setDetailModalVisible(true) }}>详情</Button>
        <Button type="link" size="small" icon={<SwapOutlined />} onClick={() => handleSwitchSite(record.id)}>切换</Button>
        <Button type="link" size="small" icon={<SettingOutlined />}>配置</Button>
      </Space>
    )},
  ]

  const resourceColumns: ColumnsType<any> = [
    { title: '类型', dataIndex: 'type', width: 100, render: (type: string) => <Tag color={type === 'CATEGORY' ? 'blue' : type === 'TAG' ? 'green' : type === 'MEDIA' ? 'orange' : 'default'}>{type}</Tag> },
    { title: '名称', dataIndex: 'name', width: 150 },
    { title: '数量', dataIndex: 'count', width: 80 },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <GlobalOutlined style={{ marginRight: 8 }} />
            多站点管理
          </Title>
          <Text type="secondary">站点配置、站点切换、站点资源隔离</Text>
        </div>
        <div className="page-header-actions">
          <Select value={currentSiteId} style={{ width: 200, marginRight: 8 }} onChange={handleSwitchSite}>
            {siteConfigs.map(s => <Option key={s.id} value={s.id}><GlobalOutlined /> {s.name}</Option>)}
          </Select>
          <Button icon={<SwapOutlined />}>快速切换</Button>
          <Button type="primary" icon={<PlusOutlined />}>新建站点</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">站点总数</Text>} value={stats.totalSites} prefix={<GlobalOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">活跃站点</Text>} value={stats.activeSites} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">内容总数</Text>} value={stats.totalContent} prefix={<DesktopOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">页面总数</Text>} value={stats.totalPages} prefix={<DesktopOutlined style={{ color: '#13c2c2' }} />} valueStyle={{ color: '#13c2c2' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">总访问量</Text>} value={stats.totalVisits / 1000} suffix="k" prefix={<TeamOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">维护中</Text>} value={1} prefix={<ToolOutlined style={{ color: '#eb2f96' }} />} valueStyle={{ color: '#eb2f96' }} />
          </Card>
        </Col>
      </Row>

      {/* 站点列表 */}
      <Tabs defaultActiveKey="sites">
        <TabPane tab="站点列表" key="sites">
          <Card className="daoda-card">
            <Table
              columns={siteColumns}
              dataSource={siteConfigs}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="站点层级" key="hierarchy">
          <Card className="daoda-card">
            <List
              dataSource={siteConfigs.filter(s => s.type === SiteType.MAIN)}
              renderItem={(mainSite: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<GlobalOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                    title={<Text strong>{mainSite.name}</Text>}
                    description={<Space>{getSiteTypeTag(mainSite.type)}{getStatusTag(mainSite.status)}{getLanguageTag(mainSite.language)}</Space>}
                  />
                  <List
                    dataSource={siteConfigs.filter(s => s.parentId === mainSite.id)}
                    renderItem={(subSite: any) => (
                      <List.Item style={{ marginLeft: 24, border: 'none' }}>
                        <List.Item.Meta
                          avatar={<GlobalOutlined style={{ fontSize: 16 }} />}
                          title={subSite.name}
                          description={<Space size="small">{getSiteTypeTag(subSite.type)}{getLanguageTag(subSite.language)}</Space>}
                        />
                      </List.Item>
                    )}
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
        <TabPane tab="访问统计" key="stats">
          <Row gutter={16}>
            <Col span={8}>
              <Card className="daoda-card" size="small" title="站点访问排名">
                {siteConfigs.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0)).slice(0, 5).map((site: any, i: number) => (
                  <div key={site.id} style={{ marginBottom: 8 }}>
                    <Text>{i + 1}. {site.name}</Text>
                    <Progress percent={(site.visitCount / 15000) * 100} size="small" style={{ width: 100, marginLeft: 8 }} />
                  </div>
                ))}
              </Card>
            </Col>
            <Col span={8}>
              <Card className="daoda-card" size="small" title="语言分布">
                {['zh-CN', 'en-US', 'ja-JP'].map(lang => (
                  <div key={lang} style={{ marginBottom: 8 }}>
                    <Space>{getLanguageTag(lang)} <Text>{siteConfigs.filter(s => s.language === lang).length} 站点</Text></Space>
                  </div>
                ))}
              </Card>
            </Col>
            <Col span={8}>
              <Card className="daoda-card" size="small" title="类型分布">
                {Object.values(SiteType).map(type => (
                  <div key={type} style={{ marginBottom: 8 }}>
                    <Space>{getSiteTypeTag(type)} <Text>{siteConfigs.filter(s => s.type === type).length} 站点</Text></Space>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 站点详情弹窗 */}
      <Modal
        title="站点详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedSite && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="站点ID">{selectedSite.id}</Descriptions.Item>
              <Descriptions.Item label="站点名称">{selectedSite.name}</Descriptions.Item>
              <Descriptions.Item label="域名">{selectedSite.domain || '-'}</Descriptions.Item>
              <Descriptions.Item label="编码">{selectedSite.code}</Descriptions.Item>
              <Descriptions.Item label="类型">{getSiteTypeTag(selectedSite.type)}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedSite.status)}</Descriptions.Item>
              <Descriptions.Item label="语言">{getLanguageTag(selectedSite.language)}</Descriptions.Item>
              <Descriptions.Item label="区域"><Tag>{selectedSite.region || '-'}</Tag></Descriptions.Item>
              <Descriptions.Item label="主题">{selectedSite.theme || '-'}</Descriptions.Item>
              <Descriptions.Item label="内容数">{selectedSite.contentCount || 0}</Descriptions.Item>
              <Descriptions.Item label="页面数">{selectedSite.pageCount || 0}</Descriptions.Item>
              <Descriptions.Item label="访问量">{selectedSite.visitCount ? `${selectedSite.visitCount / 1000}k` : '-'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{dayjs(selectedSite.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{dayjs(selectedSite.updatedAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ marginTop: 16 }}>站点资源</Title>
            <Table
              columns={resourceColumns}
              dataSource={siteResources}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>
    </div>
  )
}