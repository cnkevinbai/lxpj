import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Tag, Space, Modal, Form, Input, InputNumber, Select, message } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { getList, getDetail, create } from '@/services/contract'

interface Contract {
  id: string
  contract_no: string
  customer_name: string
  amount: number
  status: string
  created_at: string
}

const { TextArea } = Input

const ContractList: React.FC = () => {
  const [data, setData] = useState<Contract[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    setLoading(true)
    try {
      const result = await getList()
      setData(result)
    } catch (error) {
      console.error('加载合同失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (values: any) => {
    try {
      await create(values)
      message.success('创建合同成功')
      setModalVisible(false)
      form.resetFields()
      loadContracts()
    } catch (error) {
      message.error('创建合同失败')
    }
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'default',
      reviewing: 'blue',
      approved: 'green',
      rejected: 'red',
      completed: 'green',
    }
    return colorMap[status] || 'default'
  }

  const columns = [
    { title: '合同编号', dataIndex: 'contract_no', key: 'contract_no' },
    { title: '客户名称', dataIndex: 'customer_name', key: 'customer_name' },
    { 
      title: '合同金额', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (val: number) => <span>¥{val.toLocaleString()}</span>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    { title: '创建日期', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Contract) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>查看</Button>
        </Space>
      )
    }
  ]

  return (
    <div className="p-4">
      <Card 
        title="合同管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            创建合同
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      </Card>

      <Modal
        title="创建合同"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="order_id"
            label="销售订单号"
            rules={[{ required: true, message: '请输入销售订单号' }]}
          >
            <Input placeholder="请输入销售订单号" />
          </Form.Item>

          <Form.Item
            name="customer_id"
            label="客户 ID"
            rules={[{ required: true, message: '请输入客户 ID' }]}
          >
            <Input placeholder="请输入客户 ID" />
          </Form.Item>

          <Form.Item
            name="customer_name"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="合同金额"
            rules={[{ required: true, message: '请输入合同金额' }]}
          >
            <InputNumber 
              placeholder="请输入合同金额" 
              style={{ width: '100%' }}
              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>

          <Form.Item>
            <div className="flex gap-2">
              <Button type="primary" htmlType="submit">创建</Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ContractList
