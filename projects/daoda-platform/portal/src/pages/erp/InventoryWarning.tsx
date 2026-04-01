/**
 * 库存预警管理页面
 * 低库存/高库存自动预警
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Progress,
  Statistic,
  Row,
  Col,
  Input,
  Select,
  Modal,
  Form,
  message,
  Typography,
  Badge,
  Tooltip,
  Empty,
  Spin,
} from 'antd'
import {
  AlertOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select

// 预警类型
type WarningType = 'low' | 'high' | 'out' | 'overdue'

// 库存预警接口
interface InventoryWarning {
  id: string
  productName: string
  productCode: string
  category: string
  currentStock: number
  safeStock: number
  maxStock: number
  warningType: WarningType
  unit: string
  warehouse: string
  lastInDate?: string
  lastOutDate?: string
  status: 'pending' | 'processing' | 'resolved'
}

// 预警配置接口
interface WarningConfig {
  id: string
  category: string
  safeDays: number
  safeRatio: number
  maxRatio: number
  enabled: boolean
}

export default function InventoryWarningPage() {
  const [warnings, setWarnings] = useState<InventoryWarning[]>([])
  const [loading, setLoading] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [configModalVisible, setConfigModalVisible] = useState(false)
  const [configs, setConfigs] = useState<WarningConfig[]>([])

  useEffect(() => {
    fetchWarnings()
    fetchConfigs()
  }, [])

  const fetchWarnings = async () => {
    setLoading(true)
    try {
      // 模拟数据
      const mockData: InventoryWarning[] = [
        { id: '1', productName: '智能控制器', productCode: 'CTL-001', category: '电子元器件', currentStock: 15, safeStock: 100, maxStock: 500, warningType: 'low', unit: '个', warehouse: '主仓库', lastInDate: '2026-03-01', status: 'pending' },
        { id: '2', productName: '锂电池组', productCode: 'BAT-001', category: '电池', currentStock: 5, safeStock: 50, maxStock: 200, warningType: 'out', unit: '组', warehouse: '主仓库', status: 'pending' },
        { id: '3', productName: '传感器模块', productCode: 'SEN-001', category: '电子元器件', currentStock: 30, safeStock: 80, maxStock: 300, warningType: 'low', unit: '个', warehouse: '副仓库', status: 'processing' },
        { id: '4', productName: '车轮总成', productCode: 'WHL-001', category: '机械部件', currentStock: 800, safeStock: 100, maxStock: 300, warningType: 'high', unit: '套', warehouse: '主仓库', lastInDate: '2026-03-10', status: 'pending' },
        { id: '5', productName: '车架组件', productCode: 'FRM-001', category: '机械部件', currentStock: 450, safeStock: 50, maxStock: 150, warningType: 'high', unit: '件', warehouse: '主仓库', status: 'pending' },
        { id: '6', productName: '充电器', productCode: 'CHR-001', category: '配件', currentStock: 20, safeStock: 60, maxStock: 200, warningType: 'low', unit: '个', warehouse: '副仓库', lastInDate: '2026-02-15', status: 'resolved' },
      ]
      setWarnings(mockData)
    } catch (error) {
      console.error('Failed to fetch warnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConfigs = async () => {
    // 模拟配置数据
    setConfigs([
      { id: '1', category: '电子元器件', safeDays: 30, safeRatio: 0.3, maxRatio: 2.0, enabled: true },
      { id: '2', category: '电池', safeDays: 20, safeRatio: 0.2, maxRatio: 1.5, enabled: true },
      { id: '3', category: '机械部件', safeDays: 45, safeRatio: 0.4, maxRatio: 2.5, enabled: true },
      { id: '4', category: '配件', safeDays: 15, safeRatio: 0.25, maxRatio: 1.8, enabled: true },
    ])
  }

  // 统计数据
  const getStats = () => {
    const pending = warnings.filter(w => w.status === 'pending')
    const low = pending.filter(w => w.warningType === 'low' || w.warningType === 'out')
    const high = pending.filter(w => w.warningType === 'high')
    return {
      total: pending.length,
      low: low.length,
      high: high.length,
      resolved: warnings.filter(w => w.status === 'resolved').length,
    }
  }

  const stats = getStats()

  // 获取预警类型标签
  const getWarningTag = (type: WarningType) => {
    const config: Record<WarningType, { color: string; text: string; icon: React.ReactNode }> = {
      low: { color: 'orange', text: '低库存', icon: <ExclamationCircleOutlined /> },
      high: { color: 'blue', text: '高库存', icon: <AlertOutlined /> },
      out: { color: 'red', text: '缺货', icon: <AlertOutlined /> },
      overdue: { color: 'purple', text: '呆滞', icon: <AlertOutlined /> },
    }
    const c = config[type]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  // 获取库存进度条
  const getStockProgress = (record: InventoryWarning) => {
    const percent = (record.currentStock / record.maxStock) * 100
    const safePercent = (record.safeStock / record.maxStock) * 100
    
    let status: 'success' | 'normal' | 'exception' = 'normal'
    if (record.currentStock < record.safeStock) {
      status = 'exception'
    } else if (record.currentStock > record.maxStock * 0.8) {
      status = 'exception'
    } else {
      status = 'success'
    }

    return (
      <Tooltip title={`安全库存: ${record.safeStock} | 当前: ${record.currentStock} | 最大: ${record.maxStock}`}>
        <Progress
          percent={percent}
          status={status}
          size="small"
          format={() => `${record.currentStock}/${record.maxStock}`}
          strokeColor={record.warningType === 'high' ? '#1890ff' : '#ff4d4f'}
        />
      </Tooltip>
    )
  }

  // 处理预警
  const handleProcess = (id: string) => {
    message.success('已标记为处理中')
    setWarnings(prev => prev.map(w => w.id === id ? { ...w, status: 'processing' } : w))
  }

  // 解决预警
  const handleResolve = (id: string) => {
    message.success('预警已解决')
    setWarnings(prev => prev.map(w => w.id === id ? { ...w, status: 'resolved' } : w))
  }

  // 表格列定义
  const columns: ColumnsType<InventoryWarning> = [
    {
      title: '产品信息',
      key: 'product',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.productName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.productCode}</Text>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: '预警类型',
      dataIndex: 'warningType',
      width: 100,
      render: (type: WarningType) => getWarningTag(type),
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      width: 180,
      render: (_, record) => getStockProgress(record),
    },
    {
      title: '安全库存',
      dataIndex: 'safeStock',
      width: 100,
      render: (val: number) => <Text>{val}</Text>,
    },
    {
      title: '仓库',
      dataIndex: 'warehouse',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          pending: { color: 'orange', text: '待处理' },
          processing: { color: 'blue', text: '处理中' },
          resolved: { color: 'green', text: '已解决' },
        }
        const c = config[status]
        return <Badge status={c.color as any} text={c.text} />
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Button type="link" size="small" onClick={() => handleProcess(record.id)}>
              处理
            </Button>
          )}
          {record.status === 'processing' && (
            <Button type="link" size="small" onClick={() => handleResolve(record.id)}>
              解决
            </Button>
          )}
        </Space>
      ),
    },
  ]

  // 过滤数据
  const filteredWarnings = warnings.filter(w => {
    if (filterType === 'all') return true
    if (filterType === 'pending') return w.status === 'pending'
    if (filterType === 'low') return w.warningType === 'low' || w.warningType === 'out'
    if (filterType === 'high') return w.warningType === 'high'
    return true
  })

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">库存预警</Title>
          <Text type="secondary">监控库存异常，及时预警处理</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<SettingOutlined />} onClick={() => setConfigModalVisible(true)}>
            预警设置
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchWarnings}>
            刷新
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">待处理预警</Text>}
              value={stats.total}
              suffix="项"
              prefix={<AlertOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">低库存预警</Text>}
              value={stats.low}
              suffix="项"
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">高库存预警</Text>}
              value={stats.high}
              suffix="项"
              prefix={<AlertOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">已解决</Text>}
              value={stats.resolved}
              suffix="项"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索产品名称/编码"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            allowClear
          />
          <Select value={filterType} onChange={setFilterType} style={{ width: 150 }}>
            <Option value="all">全部预警</Option>
            <Option value="pending">待处理</Option>
            <Option value="low">低库存</Option>
            <Option value="high">高库存</Option>
          </Select>
        </Space>
      </Card>

      {/* 预警列表 */}
      <Card className="daoda-card">
        <Spin spinning={loading}>
          {filteredWarnings.length === 0 ? (
            <Empty description="暂无预警" />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredWarnings}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          )}
        </Spin>
      </Card>

      {/* 预警配置弹窗 */}
      <Modal
        title="预警规则配置"
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginTop: 16 }}>
          {configs.map(config => (
            <Card key={config.id} size="small" className="daoda-card" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>{config.category}</Text>
                  <br />
                  <Space style={{ marginTop: 4 }}>
                    <Text type="secondary">安全库存: {config.safeRatio * 100}%</Text>
                    <Text type="secondary">最大库存: {config.maxRatio}倍</Text>
                  </Space>
                </div>
                <Button type="link" icon={<SettingOutlined />}>编辑</Button>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  )
}