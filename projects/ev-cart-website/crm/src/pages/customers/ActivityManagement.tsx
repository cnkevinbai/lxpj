import React, { useState } from 'react'
import { Card, Table, Tag, Space, Button, Input, Select, DatePicker, Modal, Form, message, Popconfirm } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

interface Activity {
  id: string
  type: string
  content: string
  customer: string
  contact: string
  planDate: string
  actualDate: string
  status: string
  owner: string
}

const ActivityManagement: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: '电话',
      content: '跟进智能换电柜采购项目',
      customer: '某某物流公司',
      contact: '张经理',
      planDate: '2026-03-13',
      actualDate: '2026-03-13',
      status: 'completed',
      owner: '销售 A',
    },
    {
      id: '2',
      type: '拜访',
      content: '上门演示产品功能',
      customer: '某某科技公司',
      contact: '李总',
      planDate: '2026-03-14',
      actualDate: '',
      status: 'planned',
      owner: '销售 B',
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const typeColors: Record<string, string> = {
    '电话': 'blue',
    '拜访': 'green',
    '会议': 'purple',
    '邮件': 'orange',
    '微信': 'cyan',
    '其他': 'default',
  }

  const statusColors: Record<string, string> = {
    planned: 'warning',
    completed: 'success',
    cancelled: 'error',
  }

  const statusLabels: Record<string, string> = {
    planned: '计划中',
    completed: '已完成',
    cancelled: '已取消',
  }

  const handleCreate = async (values: any) => {
    message.success('创建活动成功')
    setModalVisible(false)
    form.resetFields()
  }

  const columns = [
    {
      title: '活动类型',
      dataIndex: 'type',
      width: 90,
      render: (type: string) => <Tag color={typeColors[type]}>{type}</Tag>,
    },
    {
      title: '活动内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '客户',
      dataIndex: 'customer',
      width: 150,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      width: 100,
    },
    {
      title: '计划日期',
      dataIndex: 'planDate',
      width: 110,
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
      title: '负责人',
      dataIndex: 'owner',
      width: 90,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Activity) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          {record.status === 'planned' && (
            <Button type="link" size="small" icon={<EditOutlined />}>完成</Button>
          )}
          <Popconfirm title="确定删除吗？" onConfirm={() => {}}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
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
              placeholder="搜索活动内容、客户"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Select placeholder="活动类型" style={{ width: 120 }}>
              <Option value="all">全部</Option>
              <Option value="电话">电话</Option>
              <Option value="拜访">拜访</Option>
              <Option value="会议">会议</Option>
              <Option value="邮件">邮件</Option>
            </Select>
            <DatePicker placeholder="选择日期" />
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            新建活动
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={activities}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="新建活动"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="type"
              label="活动类型"
              rules={[{ required: true, message: '请选择活动类型' }]}
            >
              <Select>
                <Option value="电话">电话</Option>
                <Option value="拜访">拜访</Option>
                <Option value="会议">会议</Option>
                <Option value="邮件">邮件</Option>
                <Option value="微信">微信</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>

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
              name="planDate"
              label="计划日期"
              rules={[{ required: true, message: '请选择计划日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="content"
            label="活动内容"
            rules={[{ required: true, message: '请输入活动内容' }]}
          >
            <TextArea rows={4} placeholder="请描述活动内容" />
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

export default ActivityManagement
