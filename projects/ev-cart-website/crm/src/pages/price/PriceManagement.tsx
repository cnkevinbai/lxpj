import React, { useState } from 'react'
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message, Statistic, Row, Col } from 'antd'
import { PlusOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons'

const { Option } = Select

interface Price {
  id: string
  productCode: string
  productName: string
  costPrice: number
  wholesalePrice: number
  retailPrice: number
  minPrice: number
  maxPrice: number
  validFrom: string
  validTo: string
  status: string
}

const PriceManagement: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([
    {
      id: '1',
      productCode: 'P001',
      productName: '智能换电柜 V3',
      costPrice: 8000,
      wholesalePrice: 12000,
      retailPrice: 15000,
      minPrice: 11000,
      maxPrice: 16000,
      validFrom: '2026-03-01',
      validTo: '2026-12-31',
      status: 'active',
    },
    {
      id: '2',
      productCode: 'P002',
      productName: '锂电池 48V',
      costPrice: 600,
      wholesalePrice: 900,
      retailPrice: 1200,
      minPrice: 850,
      maxPrice: 1300,
      validFrom: '2026-03-01',
      validTo: '2026-12-31',
      status: 'active',
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    active: 'success',
    expired: 'warning',
    draft: 'default',
  }

  const statusLabels: Record<string, string> = {
    active: '生效中',
    expired: '已过期',
    draft: '草稿',
  }

  const handleCreate = async (values: any) => {
    message.success('创建价格策略成功')
    setModalVisible(false)
    form.resetFields()
  }

  const columns = [
    {
      title: '产品编码',
      dataIndex: 'productCode',
      width: 120,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 180,
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      width: 100,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '批发价',
      dataIndex: 'wholesalePrice',
      width: 100,
      render: (price: number) => <span style={{ color: '#1890ff' }}>¥{price.toLocaleString()}</span>,
    },
    {
      title: '零售价',
      dataIndex: 'retailPrice',
      width: 100,
      render: (price: number) => <span style={{ color: '#52c41a' }}>¥{price.toLocaleString()}</span>,
    },
    {
      title: '价格区间',
      key: 'range',
      width: 150,
      render: (_: any, record: Price) => (
        <span>¥{record.minPrice.toLocaleString()} - ¥{record.maxPrice.toLocaleString()}</span>
      ),
    },
    {
      title: '有效期',
      key: 'period',
      width: 180,
      render: (_: any, record: Price) => `${record.validFrom} 至 ${record.validTo}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Price) => (
        <Space size="small">
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">历史</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="价格策略总数"
              value={prices.length}
              suffix="个"
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="生效中"
              value={prices.filter(p => p.status === 'active').length}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均毛利率"
              value={35}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            创建价格策略
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={prices}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="创建价格策略"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item
              name="productCode"
              label="产品"
              rules={[{ required: true, message: '请选择产品' }]}
            >
              <Select placeholder="请选择产品">
                <Option value="P001">智能换电柜 V3</Option>
                <Option value="P002">锂电池 48V</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="costPrice"
              label="成本价"
              rules={[{ required: true, message: '请输入成本价' }]}
            >
              <Input.Number
                style={{ width: '100%' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="wholesalePrice"
              label="批发价"
              rules={[{ required: true, message: '请输入批发价' }]}
            >
              <Input.Number
                style={{ width: '100%' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="retailPrice"
              label="零售价"
              rules={[{ required: true, message: '请输入零售价' }]}
            >
              <Input.Number
                style={{ width: '100%' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="minPrice"
              label="最低售价"
              rules={[{ required: true, message: '请输入最低售价' }]}
            >
              <Input.Number
                style={{ width: '100%' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="maxPrice"
              label="最高售价"
              rules={[{ required: true, message: '请输入最高售价' }]}
            >
              <Input.Number
                style={{ width: '100%' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="validFrom"
              label="生效日期"
              rules={[{ required: true, message: '请选择生效日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="validTo"
              label="失效日期"
              rules={[{ required: true, message: '请选择失效日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PriceManagement
