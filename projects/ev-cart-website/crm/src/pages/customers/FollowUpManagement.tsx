import React, { useState } from 'react'
import { Card, Table, Tag, Space, Button, Input, Select, DatePicker, Modal, Form, message, Rate, Progress } from 'antd'
import { SearchOutlined, PlusOutlined, StarOutlined } from '@ant-design/icons'

const { Option } = Select

interface FollowUp {
  id: string
  customerName: string
  contact: string
  content: string
  nextDate: string
  priority: string
  status: string
  owner: string
}

const FollowUpManagement: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([
    {
      id: '1',
      customerName: '某某物流公司',
      contact: '张经理',
      content: '跟进智能换电柜采购项目，客户对价格有疑虑',
      nextDate: '2026-03-15',
      priority: 'high',
      status: 'pending',
      owner: '销售 A',
    },
    {
      id: '2',
      customerName: '某某科技公司',
      contact: '李总',
      content: '发送产品资料和报价单',
      nextDate: '2026-03-14',
      priority: 'medium',
      status: 'pending',
      owner: '销售 B',
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const priorityColors: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'green',
  }

  const priorityLabels: Record<string, string> = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级',
  }

  const handleCreate = async (values: any) => {
    message.success('创建跟进计划成功')
    setModalVisible(false)
    form.resetFields()
  }

  const columns = [
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 180,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      width: 100,
    },
    {
      title: '跟进内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '下次跟进',
      dataIndex: 'nextDate',
      width: 110,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={priorityColors[priority]}>{priorityLabels[priority]}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'warning' : 'success'}>
          {status === 'pending' ? '待跟进' : '已跟进'}
        </Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 90,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: FollowUp) => (
        <Space size="small">
          <Button type="link" size="small">完成</Button>
          <Button type="link" size="small">延期</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input.Search
              placeholder="搜索客户、联系人"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Select placeholder="优先级" style={{ width: 120 }}>
              <Option value="all">全部</Option>
              <Option value="high">高优先级</Option>
              <Option value="medium">中优先级</Option>
              <Option value="low">低优先级</Option>
            </Select>
            <DatePicker placeholder="选择日期" />
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            新建跟进
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={followUps}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="新建跟进计划"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="customerId"
              label="客户"
              rules={[{ required: true, message: '请选择客户' }]}
            >
              <Select>
                <Option value="C001">某某物流公司</Option>
                <Option value="C002">某某科技公司</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="contact"
              label="联系人"
              rules={[{ required: true, message: '请输入联系人' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="priority"
              label="优先级"
              rules={[{ required: true, message: '请选择优先级' }]}
            >
              <Select>
                <Option value="high">高优先级</Option>
                <Option value="medium">中优先级</Option>
                <Option value="low">低优先级</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="nextDate"
              label="下次跟进日期"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="content"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请描述跟进内容和要点" />
          </Form.Item>

          <Form.Item
            name="owner"
            label="负责人"
            rules={[{ required: true, message: '请选择负责人' }]}
          >
            <Select>
              <Option value="销售 A">销售 A</Option>
              <Option value="销售 B">销售 B</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FollowUpManagement
