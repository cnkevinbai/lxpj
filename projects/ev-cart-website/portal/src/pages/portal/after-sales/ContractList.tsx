import { useState } from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, Progress, message } from 'antd'
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Search } = Input
const { Option } = Select

// 模拟数据
const mockData = [
  {
    id: '1',
    contractNo: 'SC-20260312-001',
    type: 'warranty',
    status: 'active',
    customerName: '某某科技公司',
    productName: '产品 A',
    startDate: '2026-01-01',
    endDate: '2027-01-01',
    contractAmount: 5000,
  },
  {
    id: '2',
    contractNo: 'SC-20260312-002',
    type: 'extended',
    status: 'expiring',
    customerName: '某某制造厂',
    productName: '产品 B',
    startDate: '2025-03-01',
    endDate: '2026-03-20',
    contractAmount: 8000,
  },
]

const typeMap: Record<string, { color: string; text: string }> = {
  warranty: { color: 'blue', text: '标准保修' },
  extended: { color: 'green', text: '延保服务' },
  maintenance: { color: 'purple', text: '保养合同' },
  full: { color: 'orange', text: '全包服务' },
}

const statusMap: Record<string, { color: string; text: string }> = {
  active: { color: 'green', text: '生效中' },
  expiring: { color: 'orange', text: '即将到期' },
  expired: { color: 'red', text: '已过期' },
  terminated: { color: 'default', text: '已终止' },
}

export default function ContractList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  const columns = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      width: 180,
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span>{text}</span>
        </Space>
      ),
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
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      width: 120,
    },
    {
      title: '服务期限',
      key: 'period',
      width: 180,
      render: (_: any, record: any) => (
        <div>
          <div>{record.startDate} 至 {record.endDate}</div>
        </div>
      ),
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmount',
      key: 'contractAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/after-sales/contracts/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/after-sales/contracts/${record.id}/edit`)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  const filteredData = data.filter(item => {
    if (filterType && item.type !== filterType) return false
    if (filterStatus && item.status !== filterStatus) return false
    if (searchText && !item.contractNo.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>服务合同管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/after-sales/contracts/new')}>
          新建合同
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Search
            placeholder="搜索合同编号"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="合同类型"
            allowClear
            style={{ width: 150 }}
            value={filterType || undefined}
            onChange={(value) => setFilterType(value || '')}
          >
            <Select.Option value="warranty">标准保修</Select.Option>
            <Select.Option value="extended">延保服务</Select.Option>
            <Select.Option value="maintenance">保养合同</Select.Option>
            <Select.Option value="full">全包服务</Select.Option>
          </Select>
          <Select
            placeholder="合同状态"
            allowClear
            style={{ width: 150 }}
            value={filterStatus || undefined}
            onChange={(value) => setFilterStatus(value || '')}
          >
            <Select.Option value="active">生效中</Select.Option>
            <Select.Option value="expiring">即将到期</Select.Option>
            <Select.Option value="expired">已过期</Select.Option>
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
