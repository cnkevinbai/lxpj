import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Select, DatePicker, TimePicker, Input, message, Card, Calendar, Badge } from 'antd'
import { PlusOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface Interview {
  id: string
  interviewCode: string
  candidateName: string
  candidatePhone: string
  candidateEmail: string
  jobId: string
  job: {
    id: string
    title: string
  }
  resumeId: string
  interviewType: string
  scheduledAt: string
  duration: number
  interviewer: string
  interviewerEmail: string
  location: string
  meetingLink: string
  status: string
  feedback: string
  rating: number
  result: string
  createdAt: string
}

const Interviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const typeLabels: Record<string, string> = {
    phone: '电话面试',
    video: '视频面试',
    onsite: '现场面试',
  }

  const statusColors: Record<string, string> = {
    scheduled: 'processing',
    completed: 'success',
    cancelled: 'error',
    no_show: 'default',
  }

  const statusLabels: Record<string, string> = {
    scheduled: '待面试',
    completed: '已完成',
    cancelled: '已取消',
    no_show: '未出席',
  }

  // 获取面试列表
  const fetchInterviews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await fetch(`/api/v1/interviews?${params}`)
      const data = await response.json()
      setInterviews(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载面试列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterviews()
  }, [page, limit])

  // 创建面试
  const handleCreate = async (values: any) => {
    try {
      await fetch('/api/v1/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          scheduledAt: values.scheduledAt.format('YYYY-MM-DD HH:mm:ss'),
        }),
      })
      message.success('创建面试成功')
      setCreateVisible(false)
      form.resetFields()
      fetchInterviews()
    } catch (error) {
      message.error('创建失败')
    }
  }

  // 更新面试状态
  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/v1/interviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      message.success('更新成功')
      fetchInterviews()
    } catch (error) {
      message.error('更新失败')
    }
  }

  const columns: ColumnsType<Interview> = [
    {
      title: '面试编号',
      dataIndex: 'interviewCode',
      key: 'interviewCode',
      width: 120,
    },
    {
      title: '候选人',
      key: 'candidate',
      width: 150,
      render: (_, record) => (
        <div>
          <strong>{record.candidateName}</strong>
          <br />
          <small style={{ color: '#999' }}>{record.candidatePhone}</small>
        </div>
      ),
    },
    {
      title: '应聘职位',
      key: 'job',
      width: 150,
      render: (_, record) => record.job?.title || '-',
    },
    {
      title: '面试类型',
      dataIndex: 'interviewType',
      key: 'interviewType',
      width: 100,
      render: (type) => typeLabels[type] || type,
    },
    {
      title: '面试时间',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 160,
      render: (date) => (
        <div>
          <CalendarOutlined /> {new Date(date).toLocaleDateString()}
          <br />
          <ClockCircleOutlined /> <small>{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
        </div>
      ),
    },
    {
      title: '面试官',
      dataIndex: 'interviewer',
      key: 'interviewer',
      width: 120,
    },
    {
      title: '面试地点/链接',
      key: 'location',
      width: 150,
      render: (_, record) => (
        record.interviewType === 'video' ? (
          <a href={record.meetingLink} target="_blank" rel="noopener noreferrer">
            进入会议
          </a>
        ) : (
          record.location || '-'
        )
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Badge
          status={statusColors[status] || 'default'}
          text={statusLabels[status] || status}
        />
      ),
    },
    {
      title: '面试评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating) => rating ? '⭐'.repeat(rating) : '-',
    },
    {
      title: '面试结果',
      dataIndex: 'result',
      key: 'result',
      width: 80,
      render: (result) => ({
        pass: '通过',
        fail: '不通过',
        pending: '待定',
      }[result] || result),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Select
              size="small"
              value={record.status}
              style={{ width: 90 }}
              onChange={(value) => updateStatus(record.id, value)}
              options={[
                { label: '待面试', value: 'scheduled' },
                { label: '已完成', value: 'completed' },
                { label: '已取消', value: 'cancelled' },
              ]}
            />
          </Space>
          <Button
            type="link"
            size="small"
            onClick={() => window.open(`/interviews/${record.id}`)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateVisible(true)}
          >
            安排面试
          </Button>
          <Button icon={<CalendarOutlined />}>
            日历视图
          </Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={interviews}
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
        scroll={{ x: 1400 }}
      />

      {/* 创建面试弹窗 */}
      <Modal
        title="安排面试"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="resumeId"
            label="候选人"
            rules={[{ required: true, message: '请选择候选人' }]}
          >
            <Select placeholder="选择候选人">
              <Select.Option value="1">张三 - Java 工程师</Select.Option>
              <Select.Option value="2">李四 - 产品经理</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="interviewType"
            label="面试类型"
            rules={[{ required: true, message: '请选择面试类型' }]}
          >
            <Select>
              <Select.Option value="phone">电话面试</Select.Option>
              <Select.Option value="video">视频面试</Select.Option>
              <Select.Option value="onsite">现场面试</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="scheduledAt"
            label="面试时间"
            rules={[{ required: true, message: '请选择面试时间' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="预计时长（分钟）"
            initialValue={60}
          >
            <Select>
              <Select.Option value={30}>30 分钟</Select.Option>
              <Select.Option value={60}>60 分钟</Select.Option>
              <Select.Option value={90}>90 分钟</Select.Option>
              <Select.Option value={120}>120 分钟</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="interviewer"
            label="面试官"
            rules={[{ required: true, message: '请输入面试官' }]}
          >
            <Input placeholder="请输入面试官姓名" />
          </Form.Item>
          <Form.Item
            name="location"
            label="面试地点"
          >
            <Input placeholder="现场面试请输入地点" />
          </Form.Item>
          <Form.Item
            name="meetingLink"
            label="会议链接"
          >
            <Input placeholder="视频面试请输入会议链接" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Interviews
