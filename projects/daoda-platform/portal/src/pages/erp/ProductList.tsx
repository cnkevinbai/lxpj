/**
 * 产品管理列表页面
 * 统一UI风格
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Typography } from 'antd'
import { PlusOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

// 产品状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '在售' },
  INACTIVE: { color: 'default', text: '停售' },
  DISCONTINUED: { color: 'red', text: '停产' },
}

// 产品类型映射
const typeMap: Record<string, { color: string; text: string }> = {
  FINISHED: { color: 'blue', text: '成品' },
  SEMI_FINISHED: { color: 'purple', text: '半成品' },
  RAW: { color: 'orange', text: '原料' },
  CONSUMABLE: { color: 'cyan', text: '耗材' },
}

// 模拟数据
const mockProducts = [
  { id: '1', code: 'PRD001', name: '智能控制器 A100', type: 'FINISHED', category: '电子产品', unit: '台', status: 'ACTIVE', price: 2999, stock: 156, createdAt: '2024-01-15' },
  { id: '2', code: 'PRD002', name: '伺服电机 SM-500', type: 'FINISHED', category: '电机设备', unit: '台', status: 'ACTIVE', price: 4599, stock: 89, createdAt: '2024-01-18' },
  { id: '3', code: 'PRD003', name: 'PLC控制板', type: 'SEMI_FINISHED', category: '电子元件', unit: '块', status: 'ACTIVE', price: 899, stock: 320, createdAt: '2024-02-01' },
  { id: '4', code: 'PRD004', name: '铝合金外壳', type: 'RAW', category: '原材料', unit: '件', status: 'ACTIVE', price: 45, stock: 1200, createdAt: '2024-02-05' },
  { id: '5', code: 'PRD005', name: '工业传感器 IS-200', type: 'FINISHED', category: '传感器', unit: '个', status: 'INACTIVE', price: 1299, stock: 67, createdAt: '2024-02-10' },
]

interface Product {
  id: string
  code: string
  name: string
  type: string
  category: string
  unit: string
  status: string
  price: number
  stock: number
  createdAt: string
}

export default function ProductList() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    keyword: '',
    type: undefined as string | undefined,
    status: undefined as string | undefined,
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  // 表格列定义
  const columns: ColumnsType<Product> = [
    {
      title: '产品编码',
      dataIndex: 'code',
      width: 120,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      render: (text: string, record: Product) => (
        <a onClick={() => navigate(`/erp/products/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '产品类型',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => {
        const config = typeMap[type]
        return <Tag color={config?.color}>{config?.text || type}</Tag>
      },
    },
    {
      title: '产品分类',
      dataIndex: 'category',
      width: 120,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 80,
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 100,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 80,
      render: (stock: number) => (
        <Text style={{ color: stock < 100 ? '#ff4d4f' : '#52c41a' }}>{stock}</Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string) => {
        const config = statusMap[status]
        return <Tag color={config?.color}>{config?.text || status}</Tag>
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => navigate(`/erp/products/${record.id}`)}>详情</a>
          <a onClick={() => message.info('编辑功能开发中')}>编辑</a>
        </Space>
      ),
    },
  ]

  // 过滤数据
  const filteredData = mockProducts.filter(item => {
    if (filters.keyword && !item.name.includes(filters.keyword) && !item.code.includes(filters.keyword)) {
      return false
    }
    if (filters.type && item.type !== filters.type) {
      return false
    }
    if (filters.status && item.status !== filters.status) {
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
      message.success('产品创建成功')
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
          <Title level={4} className="page-header-title">产品管理</Title>
        </div>
        <div className="page-header-actions">
          <Button icon={<ExportOutlined />}>导出</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建产品
          </Button>
        </div>
      </div>

      {/* 搜索筛选区 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <div className="filter-section" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
          <Input
            placeholder="搜索产品编码/名称"
            prefix={<SearchOutlined />}
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            style={{ width: 200 }}
          />
          <Select
            placeholder="产品类型"
            allowClear
            value={filters.type}
            onChange={(value) => setFilters({ ...filters, type: value })}
            style={{ width: 150 }}
            options={[
              { value: 'FINISHED', label: '成品' },
              { value: 'SEMI_FINISHED', label: '半成品' },
              { value: 'RAW', label: '原料' },
              { value: 'CONSUMABLE', label: '耗材' },
            ]}
          />
          <Select
            placeholder="状态"
            allowClear
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            style={{ width: 120 }}
            options={[
              { value: 'ACTIVE', label: '在售' },
              { value: 'INACTIVE', label: '停售' },
              { value: 'DISCONTINUED', label: '停产' },
            ]}
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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新建产品弹窗 */}
      <Modal
        title="新建产品"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="code" label="产品编码" rules={[{ required: true }]}>
            <Input placeholder="请输入产品编码" />
          </Form.Item>
          <Form.Item name="name" label="产品名称" rules={[{ required: true }]}>
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          <Form.Item name="type" label="产品类型" rules={[{ required: true }]}>
            <Select placeholder="请选择产品类型" options={[
              { value: 'FINISHED', label: '成品' },
              { value: 'SEMI_FINISHED', label: '半成品' },
              { value: 'RAW', label: '原料' },
              { value: 'CONSUMABLE', label: '耗材' },
            ]} />
          </Form.Item>
          <Form.Item name="category" label="产品分类">
            <Input placeholder="请输入产品分类" />
          </Form.Item>
          <Form.Item name="unit" label="单位">
            <Input placeholder="请输入单位" />
          </Form.Item>
          <Form.Item name="price" label="单价">
            <Input type="number" placeholder="请输入单价" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}