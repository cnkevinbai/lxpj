import React, { useState } from 'react'
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message, Statistic, Row, Col, Descriptions } from 'antd'
import { PlusOutlined, ToolOutlined, CheckCircleOutlined } from '@ant-design/icons'

const { Option } = Select

interface ServiceOrder {
  id: string
  orderNo: string
  customerName: string
  productName: string
  serviceType: string
  issue: string
  status: string
  createTime: string
  assignee: string
}

const ServiceManagement: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([
    {
      id: '1',
      orderNo: 'SV20260313001',
      customerName: '某某物流公司',
      productName: '智能换电柜 V3',
      serviceType: '维修',
      issue: '设备无法启动',
      status: 'pending',
      createTime: '2026-03-13 09:00',
      assignee: '王师傅',
    },
    {
      id: '2',
      orderNo: 'SV20260313002',
      customerName: '某某科技公司',
      productName: '锂电池 48V',
      serviceType: '安装',
      issue: '新设备安装调试',
      status: 'processing',
      createTime: '2026-03-13 08:30',
      assignee: '李师傅',
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
    processing: 'blue',
    completed: 'success',
    cancelled: 'error',
  }

  const statusLabels: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消',
  }

  const serviceTypes = ['维修', '安装', '保养', '升级', '其他']

  const handleCreate = async (values: any) => {
    message.success('创建服务单成功')
    setModalVisible(false)
    form.resetFields()
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const completedOrders = orders.filter(o => o.status === 'completed').length

  const columns = [
    {
      title: '服务单号',
      dataIndex: 'orderNo',
      width: 150,
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 150,
    },
    {
      title: '产品',
      dataIndex: 'productName',
      width: 150,
    },
    {
      title: '服务类型',
      dataIndex: 'serviceType',
      width: 90,
    },
    {
      title: '问题描述',
      dataIndex: 'issue',
      ellipsis: true,
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
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      width: 90,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: ServiceOrder) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          {record.status === 'pending' && <Button type="link" size="small">派单</Button>}
          {record.status === 'processing' && <Button type="link" size="small">完成</Button>}
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
              title="服务单总数"
              value={totalOrders}
              suffix="个"
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="待处理"
              value={pendingOrders}
              suffix="个"
              valueStyle={{ color: '#faad14' }}
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
            创建服务单
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
        title="创建服务单"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="customerName"
              label="客户"
              rules={[{ required: true, message: '请选择客户' }]}
            >
              <Select placeholder="请选择客户">
                <Option value="C001">某某物流公司</Option>
                <Option value="C002">某某科技公司</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="productName"
              label="产品"
              rules={[{ required: true, message: '请选择产品' }]}
            >
              <Select placeholder="请选择产品">
                <Option value="P001">智能换电柜 V3</Option>
                <Option value="P002">锂电池 48V</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="serviceType"
              label="服务类型"
              rules={[{ required: true, message: '请选择服务类型' }]}
            >
              <Select>
                {serviceTypes.map((type) => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="assignee"
              label="负责人"
              rules={[{ required: true, message: '请选择负责人' }]}
            >
              <Select>
                <Option value="王师傅">王师傅</Option>
                <Option value="李师傅">李师傅</Option>
                <Option value="张师傅">张师傅</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="issue"
            label="问题描述"
            rules={[{ required: true, message: '请输入问题描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细描述问题" />
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ServiceManagement
