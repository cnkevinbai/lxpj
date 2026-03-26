/**
 * 生产计划列表页面
 * 统一UI风格
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Typography, DatePicker, Progress } from 'antd'
import { PlusOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

// 计划状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  DRAFT: { color: 'default', text: '草稿' },
  PENDING: { color: 'orange', text: '待审批' },
  APPROVED: { color: 'blue', text: '已批准' },
  IN_PROGRESS: { color: 'processing', text: '进行中' },
  COMPLETED: { color: 'success', text: '已完成' },
  CANCELLED: { color: 'error', text: '已取消' },
}

// 优先级映射
const priorityMap: Record<string, { color: string; text: string }> = {
  HIGH: { color: 'red', text: '高' },
  MEDIUM: { color: 'orange', text: '中' },
  LOW: { color: 'green', text: '低' },
}

// 模拟生产计划数据
const mockPlanList = [
  { id: '1', code: 'PP202403001', name: '智能控制器月度生产计划', product: '智能控制器 A100', quantity: 500, completed: 320, startDate: '2024-03-01', endDate: '2024-03-31', status: 'IN_PROGRESS', priority: 'HIGH', progress: 64 },
  { id: '2', code: 'PP202403002', name: '伺服电机批量生产', product: '伺服电机 SM-500', quantity: 200, completed: 0, startDate: '2024-03-15', endDate: '2024-04-15', status: 'APPROVED', priority: 'MEDIUM', progress: 0 },
  { id: '3', code: 'PP202403003', name: 'PLC控制板试产', product: 'PLC控制板', quantity: 50, completed: 50, startDate: '2024-02-20', endDate: '2024-03-10', status: 'COMPLETED', priority: 'LOW', progress: 100 },
  { id: '4', code: 'PP202403004', name: '传感器紧急订单', product: '工业传感器 IS-200', quantity: 100, completed: 45, startDate: '2024-03-10', endDate: '2024-03-20', status: 'IN_PROGRESS', priority: 'HIGH', progress: 45 },
  { id: '5', code: 'PP202403005', name: '控制器维修件生产', product: '智能控制器 A100', quantity: 30, completed: 0, startDate: '2024-03-25', endDate: '2024-03-30', status: 'PENDING', priority: 'MEDIUM', progress: 0 },
]

interface ProductionPlan {
  id: string
  code: string
  name: string
  product: string
  quantity: number
  completed: number
  startDate: string
  endDate: string
  status: string
  priority: string
  progress: number
}

export default function ProductionPlanList() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as string | undefined,
    priority: undefined as string | undefined,
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  // 表格列定义
  const columns: ColumnsType<ProductionPlan> = [
    {
      title: '计划编号',
      dataIndex: 'code',
      width: 140,
      fixed: 'left',
    },
    {
      title: '计划名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: '产品',
      dataIndex: 'product',
      width: 160,
    },
    {
      title: '计划数量',
      dataIndex: 'quantity',
      width: 100,
      render: (qty: number, record) => (
        <Text>{record.completed}/{qty}</Text>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 150,
      render: (progress: number) => (
        <Progress 
          percent={progress} 
          size="small" 
          strokeColor={progress >= 100 ? '#52c41a' : progress > 50 ? '#1890ff' : '#faad14'}
        />
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      render: (priority: string) => {
        const config = priorityMap[priority]
        return <Tag color={config?.color}>{config?.text || priority}</Tag>
      },
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      width: 110,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      width: 110,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusMap[status]
        return <Tag color={config?.color}>{config?.text || status}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => navigate(`/erp/production-plans/${record.id}`)}>详情</a>
          {record.status === 'DRAFT' && <a onClick={() => message.info('提交审批功能开发中')}>提交审批</a>}
          {record.status === 'APPROVED' && <a onClick={() => navigate(`/erp/production`)}>生成工单</a>}
        </Space>
      ),
    },
  ]

  // 过滤数据
  const filteredData = mockPlanList.filter(item => {
    if (filters.keyword && !item.name.includes(filters.keyword) && !item.code.includes(filters.keyword)) {
      return false
    }
    if (filters.status && item.status !== filters.status) {
      return false
    }
    if (filters.priority && item.priority !== filters.priority) {
      return false
    }
    return true
  })

  const handleCreate = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      message.success('生产计划创建成功')
      setModalVisible(false)
    } catch (error) {
      // 表单验证失败
    }
  }

  return (
    <div className="page-container">
      {/* 页面标题区 */}
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">生产计划</Title>
        </div>
        <div className="page-header-actions">
          <Button icon={<ExportOutlined />}>导出</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建计划
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}>
              <Text style={{ fontSize: 24 }}>📋</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">进行中</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#1890ff' }}>2</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#fff7e6', color: '#faad14' }}>
              <Text style={{ fontSize: 24 }}>⏳</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">待审批</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#faad14' }}>1</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#f6ffed', color: '#52c41a' }}>
              <Text style={{ fontSize: 24 }}>✅</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">已完成</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#52c41a' }}>1</Text>
              </div>
            </div>
          </div>
        </Card>
        <Card className="daoda-card stat-card" style={{ flex: 1 }}>
          <div className="stat-content" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="stat-icon" style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }}>
              <Text style={{ fontSize: 24 }}>📊</Text>
            </div>
            <div>
              <Text type="secondary" className="stat-label">本月计划产量</Text>
              <div className="stat-value">
                <Text strong style={{ fontSize: 28, color: '#722ed1' }}>850</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 搜索筛选区 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <div className="filter-section" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
          <Input
            placeholder="搜索计划编号/名称"
            prefix={<SearchOutlined />}
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            style={{ width: 200 }}
          />
          <Select
            placeholder="状态"
            allowClear
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            style={{ width: 120 }}
            options={Object.entries(statusMap).map(([key, val]) => ({ value: key, label: val.text }))}
          />
          <Select
            placeholder="优先级"
            allowClear
            value={filters.priority}
            onChange={(value) => setFilters({ ...filters, priority: value })}
            style={{ width: 100 }}
            options={Object.entries(priorityMap).map(([key, val]) => ({ value: key, label: val.text }))}
          />
        </div>
      </Card>

      {/* 数据表格 */}
      <Card className="daoda-card">
        <Table
          className="daoda-table"
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 新建计划弹窗 */}
      <Modal
        title="新建生产计划"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="计划名称" rules={[{ required: true }]}>
            <Input placeholder="请输入计划名称" />
          </Form.Item>
          <Form.Item name="productId" label="产品" rules={[{ required: true }]}>
            <Select placeholder="请选择产品" options={[
              { value: 'PRD001', label: '智能控制器 A100' },
              { value: 'PRD002', label: '伺服电机 SM-500' },
              { value: 'PRD003', label: 'PLC控制板' },
              { value: 'PRD005', label: '工业传感器 IS-200' },
            ]} />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="quantity" label="计划数量" rules={[{ required: true }]}>
              <Input type="number" placeholder="请输入数量" style={{ width: 150 }} />
            </Form.Item>
            <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
              <Select placeholder="请选择优先级" style={{ width: 120 }} options={[
                { value: 'HIGH', label: '高' },
                { value: 'MEDIUM', label: '中' },
                { value: 'LOW', label: '低' },
              ]} />
            </Form.Item>
          </Space>
          <Form.Item name="dateRange" label="计划周期" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}