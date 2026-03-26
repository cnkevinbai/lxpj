import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, Statistic, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, message, Badge } from 'antd'
import { PlusOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons'

const Inventory: React.FC = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [stockInVisible, setStockInVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    low_stock: 'warning',
    out_of_stock: 'error',
  }

  const statusLabels: Record<string, string> = {
    active: '正常',
    inactive: '停用',
    low_stock: '库存不足',
    out_of_stock: '缺货',
  }

  // 获取库存列表
  const fetchInventory = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/inventory/products')
      const data = await response.json()
      setProducts(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/v1/inventory/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('获取统计失败', error)
    }
  }

  useEffect(() => {
    fetchInventory()
    fetchStatistics()
  }, [])

  // 入库操作
  const handleStockIn = async (values: any) => {
    try {
      await fetch('/api/v1/inventory/stock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('入库成功')
      setStockInVisible(false)
      form.resetFields()
      fetchInventory()
      fetchStatistics()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    {
      title: '产品编码',
      dataIndex: 'productCode',
      key: 'productCode',
      width: 120,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 120,
    },
    {
      title: '当前库存',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (qty: number, record: any) => (
        <span style={{ color: qty <= record.safeStock ? '#ff4d4f' : qty <= record.minStock ? '#faad14' : '#52c41a' }}>
          {qty}
        </span>
      ),
    },
    {
      title: '安全库存',
      dataIndex: 'safeStock',
      key: 'safeStock',
      width: 80,
    },
    {
      title: '仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 120,
    },
    {
      title: '库位',
      dataIndex: 'location',
      key: 'location',
      width: 100,
    },
    {
      title: '成本价',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      render: (cost: number) => `¥${cost?.toLocaleString()}`,
    },
    {
      title: '销售价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (price: number) => `¥${price?.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              form.setFieldsValue({ productId: record.id })
              setStockInVisible(true)
            }}
          >
            入库
          </Button>
          <Button type="link" size="small">出库</Button>
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
              value={statistics.totalProducts || 0}
              suffix="种"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存总价值"
              value={statistics.totalValue || 0}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="库存不足"
              value={statistics.lowStock || 0}
              suffix="种"
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="缺货产品"
              value={statistics.outOfStock || 0}
              suffix="种"
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 库存列表 */}
      <Card
        title="📦 库存管理"
        extra={
          <Space>
            <Button icon={<PlusOutlined />} onClick={() => setStockInVisible(true)}>
              入库操作
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 入库弹窗 */}
      <Modal
        title="入库操作"
        open={stockInVisible}
        onCancel={() => setStockInVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleStockIn}>
          <Form.Item
            name="productId"
            label="产品"
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select placeholder="选择产品">
              {products.map((p: any) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.productName} ({p.productCode})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="入库数量"
            rules={[{ required: true, message: '请输入入库数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item
            name="referenceType"
            label="参考类型"
          >
            <Select placeholder="选择参考类型">
              <Select.Option value="purchase">采购入库</Select.Option>
              <Select.Option value="return">退货入库</Select.Option>
              <Select.Option value="transfer">调拨入库</Select.Option>
              <Select.Option value="other">其他入库</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="notes"
            label="备注"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Inventory
