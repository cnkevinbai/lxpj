/**
 * 供应商管理页面
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Statistic,
  Row,
  Col,
  Rate,
  Descriptions,
  Tabs,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  StarOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select

interface Supplier {
  id: string
  code: string
  name: string
  shortName?: string
  category: string
  contact: string
  phone: string
  email?: string
  address?: string
  level: 'A' | 'B' | 'C'
  rating: number
  status: 'ACTIVE' | 'INACTIVE' | 'BLACKLIST'
  createdAt: string
}

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [form] = Form.useForm()
  const [stats, setStats] = useState({ total: 0, avgRating: 0 })

  useEffect(() => {
    fetchSuppliers()
    fetchStats()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    // 模拟数据
    const mockData: Supplier[] = [
      { id: '1', code: 'SUP001', name: '深圳智能科技有限公司', shortName: '智能科技', category: 'parts', contact: '张经理', phone: '138****1234', email: 'zhang@smart.com', address: '深圳市南山区', level: 'A', rating: 4.5, status: 'ACTIVE', createdAt: '2025-06-01' },
      { id: '2', code: 'SUP002', name: '东莞机械配件厂', shortName: '机械配件', category: 'raw-material', contact: '李总', phone: '139****5678', address: '东莞市', level: 'B', rating: 3.8, status: 'ACTIVE', createdAt: '2025-08-15' },
      { id: '3', code: 'SUP003', name: '广州物流有限公司', category: 'logistics', contact: '王经理', phone: '137****9012', level: 'B', rating: 4.2, status: 'ACTIVE', createdAt: '2025-09-20' },
    ]
    setSuppliers(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({ total: 3, avgRating: 4.2 })
  }

  const handleCreate = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      console.log('Submit:', values)
      message.success('供应商创建成功')
      setModalVisible(false)
      fetchSuppliers()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleViewDetail = (record: Supplier) => {
    setSelectedSupplier(record)
    setDetailVisible(true)
  }

  const handleBlacklist = (id: string) => {
    Modal.confirm({
      title: '加入黑名单',
      content: (
        <Input.TextArea
          id="blacklistReason"
          rows={3}
          placeholder="请输入加入黑名单的原因"
        />
      ),
      onOk: () => {
        message.success('已加入黑名单')
        fetchSuppliers()
      },
    })
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'raw-material': '原材料',
      'parts': '零部件',
      'equipment': '设备',
      'service': '服务',
      'logistics': '物流',
      'other': '其他',
    }
    return labels[category] || category
  }

  const columns: ColumnsType<Supplier> = [
    {
      title: '供应商编码',
      dataIndex: 'code',
      width: 100,
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      width: 200,
      render: (text: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          {record.shortName && <Text type="secondary" style={{ fontSize: 12 }}>{record.shortName}</Text>}
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      render: (cat: string) => <Tag>{getCategoryLabel(cat)}</Tag>,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      width: 100,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: '等级',
      dataIndex: 'level',
      width: 80,
      render: (level: string) => {
        const colors: Record<string, string> = { A: 'gold', B: 'blue', C: 'default' }
        return <Tag color={colors[level]}>{level}级</Tag>
      },
    },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 140,
      render: (rating: number) => (
        <Space>
          <Rate disabled value={rating} allowHalf style={{ fontSize: 12 }} />
          <Text>{rating.toFixed(1)}</Text>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          ACTIVE: { color: 'green', text: '合作中' },
          INACTIVE: { color: 'default', text: '已停用' },
          BLACKLIST: { color: 'red', text: '黑名单' },
        }
        const c = config[status]
        return <Tag color={c.color}>{c.text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} />
          <Button type="link" size="small" danger icon={<StopOutlined />} onClick={() => handleBlacklist(record.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <ShopOutlined style={{ marginRight: 8 }} />
            供应商管理
          </Title>
          <Text type="secondary">供应商档案、评估、黑名单管理</Text>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建供应商
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">供应商总数</Text>}
              value={stats.total}
              suffix="家"
              prefix={<ShopOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均评分</Text>}
              value={stats.avgRating}
              precision={1}
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">A级供应商</Text>}
              value={suppliers.filter(s => s.level === 'A').length}
              suffix="家"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索供应商名称/编码"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            allowClear
          />
          <Select placeholder="分类" style={{ width: 120 }} allowClear>
            <Option value="raw-material">原材料</Option>
            <Option value="parts">零部件</Option>
            <Option value="equipment">设备</Option>
            <Option value="logistics">物流</Option>
          </Select>
          <Select placeholder="等级" style={{ width: 100 }} allowClear>
            <Option value="A">A级</Option>
            <Option value="B">B级</Option>
            <Option value="C">C级</Option>
          </Select>
        </Space>
      </Card>

      {/* 供应商列表 */}
      <Card className="daoda-card">
        <Table
          columns={columns}
          dataSource={suppliers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建供应商弹窗 */}
      <Modal
        title="新建供应商"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="供应商名称" rules={[{ required: true, message: '请输入供应商名称' }]}>
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="shortName" label="简称">
                <Input placeholder="请输入简称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
                <Select placeholder="请选择分类">
                  <Option value="raw-material">原材料</Option>
                  <Option value="parts">零部件</Option>
                  <Option value="equipment">设备</Option>
                  <Option value="service">服务</Option>
                  <Option value="logistics">物流</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="level" label="等级" initialValue="B">
                <Select>
                  <Option value="A">A级</Option>
                  <Option value="B">B级</Option>
                  <Option value="C">C级</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contact" label="联系人">
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话">
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 供应商详情弹窗 */}
      <Modal
        title="供应商详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedSupplier && (
          <div style={{ marginTop: 16 }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="编码">{selectedSupplier.code}</Descriptions.Item>
              <Descriptions.Item label="名称">{selectedSupplier.name}</Descriptions.Item>
              <Descriptions.Item label="简称">{selectedSupplier.shortName || '-'}</Descriptions.Item>
              <Descriptions.Item label="分类">{getCategoryLabel(selectedSupplier.category)}</Descriptions.Item>
              <Descriptions.Item label="联系人">{selectedSupplier.contact}</Descriptions.Item>
              <Descriptions.Item label="电话">{selectedSupplier.phone}</Descriptions.Item>
              <Descriptions.Item label="等级">
                <Tag color={selectedSupplier.level === 'A' ? 'gold' : 'blue'}>{selectedSupplier.level}级</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="评分">
                <Rate disabled value={selectedSupplier.rating} allowHalf style={{ fontSize: 12 }} />
              </Descriptions.Item>
              <Descriptions.Item label="地址" span={2}>{selectedSupplier.address || '-'}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  )
}