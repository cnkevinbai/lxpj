import { useState } from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, message } from 'antd'
import { PlusOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Search } = Input
const { Option } = Select

// 模拟数据
const mockData = [
  {
    id: '1',
    name: '成都服务中心',
    type: 'self',
    province: '四川省',
    city: '成都市',
    address: '高新区某某大厦 10 楼',
    phone: '028-88888888',
    manager: '张经理',
    technicianCount: 15,
    isActive: true,
  },
  {
    id: '2',
    name: '重庆服务中心',
    type: 'authorized',
    province: '重庆市',
    city: '重庆市',
    address: '九龙坡区某某路 88 号',
    phone: '023-66666666',
    manager: '李经理',
    technicianCount: 10,
    isActive: true,
  },
]

const typeMap: Record<string, { color: string; text: string }> = {
  self: { color: 'blue', text: '自营' },
  authorized: { color: 'green', text: '授权' },
}

export default function CenterList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterProvince, setFilterProvince] = useState<string>('')

  const columns = [
    {
      title: '网点名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name: string, record: any) => (
        <Space>
          <EnvironmentOutlined style={{ color: '#1890ff' }} />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => {
        const config = typeMap[type]
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '区域',
      key: 'region',
      width: 150,
      render: (_: any, record: any) => `${record.province} ${record.city}`,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
    },
    {
      title: '联系人',
      key: 'contact',
      width: 150,
      render: (_: any, record: any) => (
        <div>
          <div>{record.manager}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: '技术人员',
      dataIndex: 'technicianCount',
      key: 'technicianCount',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? '营业中' : '已停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/after-sales/centers/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/after-sales/centers/${record.id}/edit`)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  const filteredData = data.filter(item => {
    if (filterType && item.type !== filterType) return false
    if (filterProvince && item.province !== filterProvince) return false
    if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <h1>服务网点管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/after-sales/centers/new')}>
          新建网点
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Search
            placeholder="搜索网点名称"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="网点类型"
            allowClear
            style={{ width: 150 }}
            value={filterType || undefined}
            onChange={(value) => setFilterType(value || '')}
          >
            <Select.Option value="self">自营</Select.Option>
            <Select.Option value="authorized">授权</Select.Option>
          </Select>
          <Select
            placeholder="省份"
            allowClear
            style={{ width: 150 }}
            value={filterProvince || undefined}
            onChange={(value) => setFilterProvince(value || '')}
          >
            <Select.Option value="四川省">四川省</Select.Option>
            <Select.Option value="重庆市">重庆市</Select.Option>
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
