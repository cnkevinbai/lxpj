import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, message } from 'antd'
import { PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ServiceTicket, TicketStatus, TicketType } from '@/types/after-sales'

const { Search } = Input

// 模拟数据
const mockData: ServiceTicket[] = [
  {
    id: '1',
    ticketNo: 'GD-20260312-001',
    type: 'repair',
    status: 'processing',
    priority: 'urgent',
    customerName: '张三',
    customerPhone: '138****1234',
    productName: '产品 A',
    problemDescription: '设备无法启动',
    serviceAddress: '成都市高新区',
    technicianName: '李师傅',
    createdAt: '2026-03-12 10:30:00',
  },
  {
    id: '2',
    ticketNo: 'GD-20260312-002',
    type: 'installation',
    status: 'assigned',
    priority: 'normal',
    customerName: '李四',
    customerPhone: '139****5678',
    productName: '产品 B',
    problemDescription: '新设备安装',
    serviceAddress: '重庆市九龙坡区',
    technicianName: '王师傅',
    createdAt: '2026-03-12 11:00:00',
  },
]

const typeMap: Record<TicketType, { color: string; text: string }> = {
  installation: { color: 'blue', text: '安装' },
  repair: { color: 'orange', text: '维修' },
  maintenance: { color: 'green', text: '保养' },
  return: { color: 'red', text: '退换货' },
  consultation: { color: 'purple', text: '咨询' },
  complaint: { color: 'volcano', text: '投诉' },
}

const statusMap: Record<TicketStatus, { color: string; text: string }> = {
  pending: { color: 'default', text: '待受理' },
  accepted: { color: 'processing', text: '已受理' },
  assigned: { color: 'blue', text: '已分配' },
  processing: { color: 'processing', text: '处理中' },
  waiting_confirm: { color: 'orange', text: '待确认' },
  completed: { color: 'green', text: '已完成' },
  closed: { color: 'success', text: '已关闭' },
  cancelled: { color: 'default', text: '已取消' },
}

const priorityMap: Record<string, { color: string; text: string }> = {
  normal: { color: 'default', text: '普通' },
  urgent: { color: 'orange', text: '紧急' },
  critical: { color: 'red', text: '特急' },
}

export default function TicketList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ServiceTicket[]>(mockData)
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<TicketType | ''>('')
  const [filterStatus, setFilterStatus] = useState<TicketStatus | ''>('')

  const columns = [
    {
      title: '工单号',
      dataIndex: 'ticketNo',
      key: 'ticketNo',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: TicketType) => {
        const config = typeMap[type]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TicketStatus) => {
        const config = statusMap[status]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => {
        const config = priorityMap[priority]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 100,
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      width: 120,
    },
    {
      title: '服务人员',
      dataIndex: 'technicianName',
      key: 'technicianName',
      width: 100,
      render: (name?: string) => name || '未分配',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: ServiceTicket) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/after-sales/tickets/${record.id}`)}
        >
          查看
        </Button>
      ),
    },
  ]

  const filteredData = data.filter(item => {
    if (filterType && item.type !== filterType) return false
    if (filterStatus && item.status !== filterStatus) return false
    if (searchText && !item.ticketNo.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>工单管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/after-sales/tickets/new')}>
          新建工单
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Search
            placeholder="搜索工单号"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="工单类型"
            allowClear
            style={{ width: 150 }}
            value={filterType || undefined}
            onChange={(value) => setFilterType(value || '')}
          >
            <Select.Option value="installation">安装</Select.Option>
            <Select.Option value="repair">维修</Select.Option>
            <Select.Option value="maintenance">保养</Select.Option>
            <Select.Option value="return">退换货</Select.Option>
            <Select.Option value="consultation">咨询</Select.Option>
            <Select.Option value="complaint">投诉</Select.Option>
          </Select>
          <Select
            placeholder="工单状态"
            allowClear
            style={{ width: 150 }}
            value={filterStatus || undefined}
            onChange={(value) => setFilterStatus(value || '')}
          >
            <Select.Option value="pending">待受理</Select.Option>
            <Select.Option value="accepted">已受理</Select.Option>
            <Select.Option value="assigned">已分配</Select.Option>
            <Select.Option value="processing">处理中</Select.Option>
            <Select.Option value="waiting_confirm">待确认</Select.Option>
            <Select.Option value="completed">已完成</Select.Option>
            <Select.Option value="closed">已关闭</Select.Option>
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>
    </div>
  )
}
