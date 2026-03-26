import React, { useState } from 'react'
import { Card, Row, Col, Table, Statistic, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message, Progress, Avatar } from 'antd'
import { PlusOutlined, BookOutlined, TrophyOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Pie, Column } from '@ant-design/plots'

const { Option } = Select

interface Training {
  id: string
  title: string
  type: string
  trainer: string
  date: string
  duration: number
  participants: number
  status: string
  rating: number
}

const TrainingManagement: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: '1',
      title: '新员工入职培训',
      type: '入职培训',
      trainer: '人力资源部',
      date: '2026-03-15',
      duration: 8,
      participants: 25,
      status: 'planned',
      rating: 0,
    },
    {
      id: '2',
      title: '销售技巧提升培训',
      type: '技能培训',
      trainer: '外部讲师',
      date: '2026-03-10',
      duration: 4,
      participants: 18,
      status: 'completed',
      rating: 4.8,
    },
    {
      id: '3',
      title: '安全生产培训',
      type: '安全培训',
      trainer: '安全部',
      date: '2026-03-05',
      duration: 2,
      participants: 45,
      status: 'completed',
      rating: 4.5,
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    planned: 'blue',
    ongoing: 'cyan',
    completed: 'success',
    cancelled: 'default',
  }

  const statusLabels: Record<string, string> = {
    planned: '计划中',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消',
  }

  const typeColors: Record<string, string> = {
    '入职培训': 'blue',
    '技能培训': 'green',
    '安全培训': 'orange',
    '管理培训': 'purple',
  }

  const handleCreate = async (values: any) => {
    message.success('创建培训计划成功')
    setModalVisible(false)
    form.resetFields()
  }

  // 统计数据
  const totalTrainings = trainings.length
  const completedTrainings = trainings.filter(t => t.status === 'completed').length
  const totalParticipants = trainings.reduce((sum, t) => sum + t.participants, 0)
  const avgRating = trainings.filter(t => t.rating > 0).reduce((sum, t) => sum + t.rating, 0) / trainings.filter(t => t.rating > 0).length

  const columns = [
    {
      title: '培训主题',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '培训类型',
      dataIndex: 'type',
      width: 120,
      render: (type: string) => <Tag color={typeColors[type]}>{type}</Tag>,
    },
    {
      title: '讲师',
      dataIndex: 'trainer',
      width: 120,
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 110,
    },
    {
      title: '时长',
      dataIndex: 'duration',
      width: 90,
      render: (hours: number) => `${hours}小时`,
    },
    {
      title: '参与人数',
      dataIndex: 'participants',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 120,
      render: (rating: number) => (
        rating > 0 ? (
          <Progress
            percent={rating * 20}
            strokeColor={rating >= 4.5 ? '#52c41a' : rating >= 4 ? '#faad14' : '#ff4d4f'}
            size="small"
            format={() => `${rating}分`}
          />
        ) : (
          <span style={{ color: '#999' }}>未评分</span>
        )
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          {record.status === 'planned' && <Button type="link" size="small">开始</Button>}
          {record.status === 'completed' && record.rating === 0 && <Button type="link" size="small">评分</Button>}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>📚 培训管理</h1>
        <p style={{ color: '#666' }}>员工培训与发展</p>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="培训总数"
              value={totalTrainings}
              suffix="场"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={completedTrainings}
              suffix="场"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="参与人次"
              value={totalParticipants}
              suffix="人次"
              valueStyle={{ color: '#722ed1', fontSize: 24, fontWeight: 700 }}
              prefix={<UsergroupAddOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均评分"
              value={avgRating}
              precision={1}
              suffix="分"
              valueStyle={{ color: '#faad14', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="📋 培训计划"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                创建培训
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={trainings}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📊 培训类型分布">
            <Pie
              appendPadding={10}
              data={[
                { type: '入职培训', value: 1 },
                { type: '技能培训', value: 1 },
                { type: '安全培训', value: 1 },
              ]}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: 'outer',
                content: '{name} {percentage}',
              }}
              height={280}
            />
          </Card>

          <Card title="🏆 优秀培训" style={{ marginTop: 16 }}>
            {trainings.filter(t => t.rating >= 4.5).map((training, index) => (
              <div
                key={training.id}
                style={{
                  padding: '12px',
                  marginBottom: index < trainings.filter(t => t.rating >= 4.5).length - 1 ? 8 : 0,
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: 4,
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{training.title}</div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                  讲师：{training.trainer} | 参与：{training.participants}人
                </div>
                <Progress
                  percent={training.rating * 20}
                  strokeColor="#52c41a"
                  size="small"
                  format={() => `${training.rating}分 ⭐`}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Modal
        title="创建培训计划"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="title" label="培训主题" rules={[{ required: true }]}>
              <Input placeholder="请输入培训主题" />
            </Form.Item>

            <Form.Item name="type" label="培训类型" rules={[{ required: true }]}>
              <Select>
                <Option value="入职培训">入职培训</Option>
                <Option value="技能培训">技能培训</Option>
                <Option value="安全培训">安全培训</Option>
                <Option value="管理培训">管理培训</Option>
                <Option value="产品培训">产品培训</Option>
              </Select>
            </Form.Item>

            <Form.Item name="trainer" label="讲师" rules={[{ required: true }]}>
              <Input placeholder="请输入讲师姓名/部门" />
            </Form.Item>

            <Form.Item name="date" label="培训日期" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="duration" label="时长 (小时)" rules={[{ required: true }]}>
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                max={24}
                formatter={(value) => `${value}小时`}
                parser={(value) => Number(String(value || 0).replace(/小时/g, ''))}
              />
            </Form.Item>

            <Form.Item name="participants" label="预计人数">
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                formatter={(value) => `${value}人`}
                parser={(value) => Number(String(value || 0).replace(/人/g, ''))}
              />
            </Form.Item>
          </div>

          <Form.Item name="description" label="培训描述">
            <Input.TextArea rows={3} placeholder="请描述培训内容和目标" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TrainingManagement
