import React, { useState } from 'react'
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message, Steps } from 'antd'
import { PlusOutlined, CarOutlined } from '@ant-design/icons'

const { Option } = Select

interface Delivery {
  id: string
  deliveryNo: string
  orderCode: string
  customerName: string
  address: string
  contactPerson: string
  contactPhone: string
  deliveryDate: string
  status: string
  trackingNo: string
}

const DeliveryManagement: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: '1',
      deliveryNo: 'DL20260313001',
      orderCode: 'ORD20260310001',
      customerName: '某某物流公司',
      address: '北京市朝阳区 xxx 路 xxx 号',
      contactPerson: '张三',
      contactPhone: '13800138000',
      deliveryDate: '2026-03-15',
      status: 'pending',
      trackingNo: 'SF1234567890',
    },
    {
      id: '2',
      deliveryNo: 'DL20260313002',
      orderCode: 'ORD20260310002',
      customerName: '某某科技公司',
      address: '上海市浦东新区 xxx 路 xxx 号',
      contactPerson: '李四',
      contactPhone: '13900139000',
      deliveryDate: '2026-03-14',
      status: 'shipped',
      trackingNo: 'SF0987654321',
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
    shipped: 'blue',
    delivered: 'success',
    returned: 'error',
  }

  const statusLabels: Record<string, string> = {
    pending: '待发货',
    shipped: '运输中',
    delivered: '已签收',
    returned: '已退回',
  }

  const handleCreate = async (values: any) => {
    message.success('创建发货单成功')
    setModalVisible(false)
    form.resetFields()
  }

  const columns = [
    {
      title: '发货单号',
      dataIndex: 'deliveryNo',
      width: 150,
    },
    {
      title: '订单编号',
      dataIndex: 'orderCode',
      width: 150,
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 150,
    },
    {
      title: '收货地址',
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: '联系人',
      key: 'contact',
      width: 150,
      render: (_: any, record: Delivery) => (
        <div>
          <div>{record.contactPerson}</div>
          <div style={{ color: '#999', fontSize: '12px' }}>{record.contactPhone}</div>
        </div>
      ),
    },
    {
      title: '发货日期',
      dataIndex: 'deliveryDate',
      width: 110,
    },
    {
      title: '物流单号',
      dataIndex: 'trackingNo',
      width: 130,
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
      width: 150,
      render: (_: any, record: Delivery) => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">跟踪</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            新建发货单
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={deliveries}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="新建发货单"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="orderCode"
              label="订单编号"
              rules={[{ required: true, message: '请选择订单' }]}
            >
              <Select placeholder="请选择订单">
                <Option value="ORD20260310001">ORD20260310001</Option>
                <Option value="ORD20260310002">ORD20260310002</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="deliveryDate"
              label="发货日期"
              rules={[{ required: true, message: '请选择发货日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="trackingNo"
              label="物流单号"
              rules={[{ required: true, message: '请输入物流单号' }]}
            >
              <Input placeholder="请输入物流单号" />
            </Form.Item>

            <Form.Item
              name="carrier"
              label="物流公司"
              rules={[{ required: true, message: '请选择物流公司' }]}
            >
              <Select>
                <Option value="sf">顺丰速运</Option>
                <Option value="yd">韵达快递</Option>
                <Option value="zt">中通快递</Option>
                <Option value="yd">圆通速递</Option>
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

export default DeliveryManagement
