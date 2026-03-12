import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Input, Select, Modal, Form, InputNumber, message, Card, Statistic, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons'

interface Product {
  id: string
  productCode: string
  productName: string
  category: string
  specification: string
  unit: string
  unitPrice: number
  unitCost: number
  stockQuantity: number
  status: string
  createdAt: string
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [searchText, setSearchText] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>()
  const [filterStatus, setFilterStatus] = useState<string>()
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()
  const [statistics, setStatistics] = useState<any>({})

  const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    discontinued: 'error',
  }

  const statusLabels: Record<string, string> = {
    active: '在售',
    inactive: '停售',
    discontinued: '停产',
  }

  // 获取产品列表
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (searchText) params.append('search', searchText)
      if (filterCategory) params.append('category', filterCategory)
      if (filterStatus) params.append('status', filterStatus)

      const response = await fetch(`/api/v1/products?${params}`)
      const data = await response.json()
      setProducts(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载产品列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/v1/products/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('获取统计数据失败', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchStatistics()
  }, [page, limit, filterCategory, filterStatus])

  // 创建产品
  const handleCreate = async (values: any) => {
    try {
      await fetch('/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('创建成功')
      setCreateVisible(false)
      form.resetFields()
      fetchProducts()
    } catch (error) {
      message.error('创建失败')
    }
  }

  const columns = [
    { title: '产品编码', dataIndex: 'productCode', width: 120 },
    { title: '产品名称', dataIndex: 'productName', width: 200, render: (text: string) => <strong>{text}</strong> },
    { title: '类别', dataIndex: 'category', width: 120 },
    { title: '规格', dataIndex: 'specification', width: 150 },
    { title: '单位', dataIndex: 'unit', width: 60 },
    { title: '成本价', dataIndex: 'unitCost', width: 100, render: (cost: number) => `¥${cost.toLocaleString()}` },
    { title: '销售价', dataIndex: 'unitPrice', width: 100, render: (price: number) => <span style={{ color: '#ff4d4f' }}>¥${price.toLocaleString()}</span> },
    { title: '库存', dataIndex: 'stockQuantity', width: 80, render: (qty: number) => <span style={{ color: qty < 50 ? '#ff4d4f' : '#52c41a' }}>{qty}</span> },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: string) => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small">详情</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="产品总数"
              value={statistics.total || 0}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在售产品"
              value={statistics.active || 0}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存总价值"
              value={statistics.totalStockValue || 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存不足"
              value={statistics.lowStock || 0}
              suffix="个"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索产品名称/编码"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={fetchProducts}
          />
          <Select
            placeholder="产品类别"
            style={{ width: 120 }}
            allowClear
            value={filterCategory}
            onChange={setFilterCategory}
            options={[
              { label: '电动车', value: '电动车' },
              { label: '配件', value: '配件' },
              { label: '服务', value: '服务' },
            ]}
          />
          <Select
            placeholder="状态"
            style={{ width: 100 }}
            allowClear
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: '在售', value: 'active' },
              { label: '停售', value: 'inactive' },
              { label: '停产', value: 'discontinued' },
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={fetchProducts}>
            查询
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateVisible(true)}
          >
            新增产品
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPage(page)
            setLimit(pageSize || 20)
          },
        }}
        scroll={{ x: 1200 }}
      />

      {/* 创建产品弹窗 */}
      <Modal
        title="创建产品"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="productName"
            label="产品名称"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          <Form.Item
            name="productCode"
            label="产品编码"
            rules={[{ required: true, message: '请输入产品编码' }]}
          >
            <Input placeholder="请输入产品编码" />
          </Form.Item>
          <Form.Item
            name="category"
            label="产品类别"
            rules={[{ required: true, message: '请选择产品类别' }]}
          >
            <Select>
              <Select.Option value="电动车">电动车</Select.Option>
              <Select.Option value="配件">配件</Select.Option>
              <Select.Option value="服务">服务</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="specification"
            label="规格型号"
          >
            <Input placeholder="请输入规格型号" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="单位"
            initialValue="件"
          >
            <Select>
              <Select.Option value="件">件</Select.Option>
              <Select.Option value="台">台</Select.Option>
              <Select.Option value="套">套</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="unitCost"
            label="成本价"
            rules={[{ required: true, message: '请输入成本价' }]}
          >
            <InputNumber style={{ width: '100%' }} prefix="¥" min={0} />
          </Form.Item>
          <Form.Item
            name="unitPrice"
            label="销售价"
            rules={[{ required: true, message: '请输入销售价' }]}
          >
            <InputNumber style={{ width: '100%' }} prefix="¥" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Products
