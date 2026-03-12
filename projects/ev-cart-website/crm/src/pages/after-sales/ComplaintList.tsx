import { useState } from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Search } = Input
const { Option } = Select

// 模拟数据
const mockData = [
  {
    id: '1',
    complaintNo: 'CP-20260312-001',
    type: 'quality',
    status: 'pending',
    customerName: '张三',
    customerPhone: '138****1234',
    content: '产品质量有问题，使用一天就坏了',
    createdAt: '2026-03-12 10:30:00',
  },
  {
    id: '2',
    complaintNo: 'CP-20260312-002',
    type: 'attitude',
    status: 'processing',
    customerName: '李四',
    customerPhone: '139****5678',
    content: '服务人员态度不好',
    createdAt: '2026-03-12 11:00:00',
  },
]

const typeMap: Record<string, { color: string; text: string }> = {
  quality: { color: 'red', text: '产品质量' },
  attitude: { color: 'orange', text: '服务态度' },
  timeliness: { color: 'blue', text: '服务时效' },
  charge: { color: 'purple', text: '收费问题' },
  other: { color: 'default', text: '其他' },
}

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'default', text: '待处理' },
  processing: { color: 'processing', text: '处理中' },
  resolved: { color: 'green', text: '已解决' },
  closed: { color: 'success', text: '已关闭' },
}

export default function ComplaintList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  const columns = [
    {
      title: '投诉编号',
      dataIndex: 'complaintNo',
      key: 'complaintNo',
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const config = typeMap[type]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusMap[status]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '客户',
      key: 'customer',
      width: 150,
      render: (_: any, record: any) => (
        <div>
          <div>{record.customerName}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: '投诉内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/after-sales/complaints/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/after-sales/complaints/${record.id}/process`)}
          >
            处理
          </Button>
        </Space>
      ),
    },
  ]

  const filteredData = data.filter(item => {
    if (filterType && item.type !== filterType) return false
    if (filterStatus && item.status !== filterStatus) return false
    if (searchText && !item.complaintNo.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>投诉管理</h1>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Search
            placeholder="搜索投诉编号"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="投诉类型"
            allowClear
            style={{ width: 150 }}
            value={filterType || undefined}
            onChange={(value) => setFilterType(value || '')}
          >
            <Select.Option value="quality">产品质量</Select.Option>
            <Select.Option value="attitude">服务态度</Select.Option>
            <Select.Option value="timeliness">服务时效</Select.Option>
            <Select.Option value="charge">收费问题</Select.Option>
            <Select.Option value="other">其他</Select.Option>
          </Select>
          <Select
            placeholder="处理状态"
            allowClear
            style={{ width: 150 }}
            value={filterStatus || undefined}
            onChange={(value) => setFilterStatus(value || '')}
          >
            <Select.Option value="pending">待处理</Select.Option>
            <Select.Option value="processing">处理中</Select.Option>
            <Select.Option value="resolved">已解决</Select.Option>
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
