import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Table, Tag, Badge, Input, Select, Modal, Form, message, Upload } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import PortalLayout from '../../components/PortalLayout'

const { Search } = Input
const { Option } = Select
const { TextArea } = Form

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/portal/tickets')
      const data = await response.json()
      setTickets(data.data || [])
    } catch (error) {
      message.error('加载工单失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (values: any) => {
    try {
      const response = await fetch('/api/v1/portal/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('工单创建成功')
        setCreateVisible(false)
        form.resetFields()
        loadTickets()
      } else {
        message.error('创建失败')
      }
    } catch (error) {
      message.error('网络错误')
    }
  }

  const columns = [
    { title: '工单编号', dataIndex: 'ticketCode', width: 150 },
    { title: '问题类型', dataIndex: 'issueType', width: 120 },
    { title: '问题描述', dataIndex: 'description', width: 300, ellipsis: true },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 100,
      render: (s: string) => (
        <Badge 
          status={
            s === 'completed' ? 'success' :
            s === 'processing' ? 'processing' :
            s === 'pending' ? 'warning' : 'default'
          }
          text={
            s === 'completed' ? '已完成' :
            s === 'processing' ? '处理中' :
            s === 'pending' ? '待处理' : s
          }
        />
      )
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 150, render: (d: string) => new Date(d).toLocaleString() },
    { 
      title: '操作', 
      key: 'action', 
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => window.location.href = `/portal/tickets/${record.id}`}>
            详情
          </Button>
        </Space>
      )
    },
  ]

  return (
    <PortalLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 页面标题 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>我的工单</h1>
            <p style={{ fontSize: 16, color: '#666' }}>查看和管理您的服务工单</p>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />}
            onClick={() => setCreateVisible(true)}
          >
            创建工单
          </Button>
        </div>

        {/* 工单列表 */}
        <Card>
          <Table 
            columns={columns} 
            dataSource={tickets} 
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          />
        </Card>

        {/* 创建工单弹窗 */}
        <Modal
          title="创建服务工单"
          open={createVisible}
          onCancel={() => setCreateVisible(false)}
          onOk={() => form.submit()}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleCreate}>
            <Form.Item
              name="issueType"
              label="问题类型"
              rules={[{ required: true, message: '请选择问题类型' }]}
            >
              <Select placeholder="请选择问题类型">
                <Option value="product">产品质量问题</Option>
                <Option value="delivery">物流配送问题</Option>
                <Option value="service">售后服务问题</Option>
                <Option value="other">其他问题</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="orderId"
              label="关联订单"
            >
              <Select placeholder="请选择关联订单（选填）">
                <Option value="1">ORD-20260313-001</Option>
                <Option value="2">ORD-20260313-002</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="问题描述"
              rules={[{ required: true, message: '请输入问题描述' }]}
            >
              <TextArea rows={4} placeholder="请详细描述您遇到的问题" />
            </Form.Item>

            <Form.Item
              name="contactPhone"
              label="联系电话"
              rules={[{ required: true, message: '请输入联系电话' }]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>

            <Form.Item
              name="attachments"
              label="附件上传"
            >
              <Upload multiple>
                <Button>上传附件</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </PortalLayout>
  )
}

export default Tickets
