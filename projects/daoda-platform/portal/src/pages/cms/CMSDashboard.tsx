/**
 * CMS 内容管理主页
 * 展示内容统计、待发布内容、最近更新记录
 */
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Statistic, Table, Tag, Space, Typography } from 'antd'
import { 
  FileTextOutlined, 
  FolderOpenOutlined, 
  VideoCameraOutlined, 
  ClockCircleOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { newsService } from '@/services/news.service'
import { caseService } from '@/services/case.service'
import { videoService } from '@/services/video.service'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text, Link } = Typography

// 状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  DRAFT: { color: 'orange', text: '草稿' },
  PUBLISHED: { color: 'green', text: '已发布' },
  ARCHIVED: { color: 'gray', text: '已归档' },
}

export default function CMSDashboard() {
  const navigate = useNavigate()

  // 获取统计数据
  const { data: newsStats, isLoading: newsStatsLoading } = useQuery({
    queryKey: ['newsStats'],
    queryFn: () => newsService.getStats(),
    retry: false,
  })

  const { data: caseStats, isLoading: caseStatsLoading } = useQuery({
    queryKey: ['caseStats'],
    queryFn: () => caseService.getStats(),
    retry: false,
  })

  const { data: videoStats, isLoading: videoStatsLoading } = useQuery({
    queryKey: ['videoStats'],
    queryFn: () => videoService.getStats(),
    retry: false,
  })

  // 获取待发布内容（草稿）
  const { data: draftNews, isLoading: draftNewsLoading } = useQuery({
    queryKey: ['draftNews'],
    queryFn: () => newsService.getList({ page: 1, pageSize: 5, status: 'DRAFT' }),
    retry: false,
  })

  const { data: draftCases, isLoading: draftCasesLoading } = useQuery({
    queryKey: ['draftCases'],
    queryFn: () => caseService.getList({ page: 1, pageSize: 5, status: 'DRAFT' }),
    retry: false,
  })

  const { data: draftVideos, isLoading: draftVideosLoading } = useQuery({
    queryKey: ['draftVideos'],
    queryFn: () => videoService.getList({ page: 1, pageSize: 5, status: 'DRAFT' }),
    retry: false,
  })

  // 获取最近更新
  const { data: recentNews, isLoading: recentNewsLoading } = useQuery({
    queryKey: ['recentNews'],
    queryFn: () => newsService.getList({ page: 1, pageSize: 5 }),
    retry: false,
  })

  const { data: recentCases, isLoading: recentCasesLoading } = useQuery({
    queryKey: ['recentCases'],
    queryFn: () => caseService.getList({ page: 1, pageSize: 5 }),
    retry: false,
  })

  const { data: recentVideos, isLoading: recentVideosLoading } = useQuery({
    queryKey: ['recentVideos'],
    queryFn: () => videoService.getList({ page: 1, pageSize: 5 }),
    retry: false,
  })

  // 合并待发布内容
  const allDrafts = [
    ...(draftNews?.list || []).map(item => ({ ...item, type: 'news' as const })),
    ...(draftCases?.list || []).map(item => ({ ...item, type: 'case' as const })),
    ...(draftVideos?.list || []).map(item => ({ ...item, type: 'video' as const })),
  ].sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()).slice(0, 10)

  // 合并最近更新
  const allRecent = [
    ...(recentNews?.list || []).map(item => ({ ...item, type: 'news' as const })),
    ...(recentCases?.list || []).map(item => ({ ...item, type: 'case' as const })),
    ...(recentVideos?.list || []).map(item => ({ ...item, type: 'video' as const })),
  ].sort((a, b) => dayjs(b.updatedAt || b.createdAt).valueOf() - dayjs(a.updatedAt || a.createdAt).valueOf()).slice(0, 10)

  // 类型图标映射
  const typeIconMap = {
    news: <FileTextOutlined />,
    case: <FolderOpenOutlined />,
    video: <VideoCameraOutlined />,
  }

  // 类型名称映射
  const typeNameMap = {
    news: '新闻',
    case: '案例',
    video: '视频',
  }

  // 类型颜色映射
  const typeColorMap = {
    news: 'blue',
    case: 'purple',
    video: 'cyan',
  }

  // 待发布内容表格列
  const draftColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={typeColorMap[type as keyof typeof typeColorMap]}>
          {typeIconMap[type as keyof typeof typeIconMap]}
          {typeNameMap[type as keyof typeof typeNameMap]}
        </Tag>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 100,
      render: (_: any, record: any) => (
        <Link onClick={() => navigate(`/cms/${record.type === 'news' ? 'news' : record.type === 'case' ? 'cases' : 'videos'}`)}>
          编辑 <ArrowRightOutlined />
        </Link>
      ),
    },
  ]

  // 最近更新表格列
  const recentColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={typeColorMap[type as keyof typeof typeColorMap]}>
          {typeIconMap[type as keyof typeof typeIconMap]}
          {typeNameMap[type as keyof typeof typeNameMap]}
        </Tag>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 160,
      render: (updatedAt: string) => dayjs(updatedAt).fromNow(),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="新闻总数"
              value={newsStats?.total || 0}
              loading={newsStatsLoading}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <Tag color="green">已发布 {newsStats?.published || 0}</Tag>
              <Tag color="orange">草稿 {newsStats?.draft || 0}</Tag>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="案例总数"
              value={caseStats?.total || 0}
              loading={caseStatsLoading}
              prefix={<FolderOpenOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <Tag color="green">已发布 {caseStats?.published || 0}</Tag>
              <Tag color="orange">草稿 {caseStats?.draft || 0}</Tag>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="视频总数"
              value={videoStats?.total || 0}
              loading={videoStatsLoading}
              prefix={<VideoCameraOutlined style={{ color: '#13c2c2' }} />}
              valueStyle={{ color: '#13c2c2' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <Tag color="green">已发布 {videoStats?.published || 0}</Tag>
              <Tag color="orange">草稿 {videoStats?.draft || 0}</Tag>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="待发布内容"
              value={(newsStats?.draft || 0) + (caseStats?.draft || 0) + (videoStats?.draft || 0)}
              loading={newsStatsLoading || caseStatsLoading || videoStatsLoading}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              <Text type="secondary">需要审核发布</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 待发布内容 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                待发布内容
              </Space>
            }
            extra={
              <Link onClick={() => navigate('/cms/news')}>
                查看全部 <ArrowRightOutlined />
              </Link>
            }
            bordered={false}
          >
            <Table
              columns={draftColumns}
              dataSource={allDrafts}
              rowKey="id"
              loading={draftNewsLoading || draftCasesLoading || draftVideosLoading}
              pagination={false}
              size="small"
              scroll={{ y: 400 }}
              locale={{ emptyText: '暂无待发布内容' }}
            />
          </Card>
        </Col>

        {/* 最近更新 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined />
                最近更新记录
              </Space>
            }
            extra={
              <Link onClick={() => navigate('/cms/news')}>
                查看全部 <ArrowRightOutlined />
              </Link>
            }
            bordered={false}
          >
            <Table
              columns={recentColumns}
              dataSource={allRecent}
              rowKey="id"
              loading={recentNewsLoading || recentCasesLoading || recentVideosLoading}
              pagination={false}
              size="small"
              scroll={{ y: 400 }}
              locale={{ emptyText: '暂无更新记录' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card
            title="快速操作"
            bordered={false}
          >
            <Space wrap size="large">
              <Link onClick={() => navigate('/cms/news')}>
                <FileTextOutlined /> 管理新闻
              </Link>
              <Link onClick={() => navigate('/cms/cases')}>
                <FolderOpenOutlined /> 管理案例
              </Link>
              <Link onClick={() => navigate('/cms/videos')}>
                <VideoCameraOutlined /> 管理视频
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
