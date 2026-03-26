import React, { useState } from 'react'
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message, Statistic, Row, Col, Progress, Steps } from 'antd'
import { PlusOutlined, FactoryOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons'

const { Option } = Select

interface ProductionOrder {
  id: string
  orderNo: string
  productName: string
  quantity: number
  plannedDate: string
  startDate: string
  endDate: string
  status: string
  progress: number
  responsible: string
}

const ProductionManagement: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([
    {
      id: '1',
      orderNo: 'PO20260313001',
      productName: '智能换电柜 V3',
      quantity: 50,
      plannedDate: '2026-03-10',
      startDate: '2026-03-12',
      endDate: '2026-03-25',
      status: 'producing',
      progress: 45,
      responsible: '张工',
    },
    {
      id: '2',
      orderNo: 'PO20260313002',
      productName: '锂电池 48V',
      quantity: 200,
      plannedDate: '2026-03-08',
      startDate: '2026-03-10',
      endDate: '2026-03-20',
      status: 'completed',
      progress: 100,
      responsible: '李工',
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    planned: 'default',
    producing: 'blue',
    paused: 'warning',
    completed: 'success',
    cancelled: 'error',
  }

  const statusLabels: Record<string, string> = {
    planned: '待生产',
    producing: '生产中',
    paused: '已暂停',
    completed: '已完成',
    cancelled: '已取消',
  }

  const handleCreate = async (values: any) => {
    message.success('创建生产订单成功')
    setModalVisible(false)
    form.resetFields()
  }

  const totalOrders = orders.length
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const producingOrders = orders.filter(o => o.status === 'producing').length

  const columns = [
    {
      title: '生产单号',
      dataIndex: 'orderNo',
      width: 150,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 180,
    },
    {
      title: '计划数量',
      dataIndex: 'quantity',
      width: 100,
    },
    {
      title: '计划日期',
      dataIndex: 'plannedDate',
      width: 110,
    },
    {
      title: '生产进度',
      key: 'progress',
      width: 180,
      render: (_: any, record: ProductionOrder) => (
        <Progress
          percent={record.progress}
          strokeColor={
            record.progress === 100 ? '#52c41a' :
            record.progress > 50 ? '#1890ff' : '#faad14'
          }
          format={() => `${record.progress}%`}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={statusColors[status]} icon={status === 'producing' ? <SyncOutlined spin /> : undefined}>
          {statusLabels[status] || status}
        </Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'responsible',
      width: 90,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: ProductionOrder) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          {record.status === 'planned' && <Button type="link" size="small">开工</Button>}
          {record.status === 'producing' && <Button type="link" size="small">报工</Button>}
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
              title="生产订单总数"
              value={totalOrders}
              suffix="个"
              prefix={<FactoryOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="生产中"
              value={producingOrders}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已完成"
              value={completedOrders}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
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
            创建生产订单
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="创建生产订单"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="productName"
              label="产品名称"
              rules={[{ required: true, message: '请选择产品' }]}
            >
              <Select placeholder="请选择产品">
                <Option value="P001">智能换电柜 V3</Option>
                <Option value="P002">锂电池 48V</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="计划数量"
              rules={[{ required: true, message: '请输入计划数量' }]}
            >
              <Input.Number
                style={{ width: '100%' }}
                min={1}
                formatter={(value) => `${value}台`}
                parser={(value) => Number(String(value || 0).replace(/台/g, ''))}
              />
            </Form.Item>

            <Form.Item
              name="plannedDate"
              label="计划日期"
              rules={[{ required: true, message: '请选择计划日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="responsible"
              label="负责人"
              rules={[{ required: true, message: '请选择负责人' }]}
            >
              <Select>
                <Option value="张工">张工</Option>
                <Option value="李工">李工</Option>
                <Option value="王工">王工</Option>
              </Select>
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

export default ProductionManagement
