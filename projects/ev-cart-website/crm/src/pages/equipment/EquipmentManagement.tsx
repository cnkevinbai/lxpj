import React, { useState } from 'react'
import { Card, Row, Col, Table, Statistic, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message, Progress, Timeline } from 'antd'
import { PlusOutlined, ToolOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Line, Pie } from '@ant-design/plots'

const { Option } = Select

interface Equipment {
  id: string
  code: string
  name: string
  type: string
  status: string
  location: string
  purchaseDate: string
  nextMaintain: string
  usageRate: number
  healthScore: number
}

const EquipmentManagement: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: '1',
      code: 'EQ001',
      name: 'SMT 贴片机',
      type: '生产设备',
      status: 'running',
      location: 'A 车间 -1 线',
      purchaseDate: '2024-06-15',
      nextMaintain: '2026-04-01',
      usageRate: 85,
      healthScore: 92,
    },
    {
      id: '2',
      code: 'EQ002',
      name: '自动化组装线',
      type: '生产设备',
      status: 'running',
      location: 'A 车间 -2 线',
      purchaseDate: '2024-08-20',
      nextMaintain: '2026-03-25',
      usageRate: 92,
      healthScore: 88,
    },
    {
      id: '3',
      code: 'EQ003',
      name: '检测设备',
      type: '检测设备',
      status: 'maintenance',
      location: 'B 车间 - 质检区',
      purchaseDate: '2025-01-10',
      nextMaintain: '2026-03-15',
      usageRate: 0,
      healthScore: 75,
    },
    {
      id: '4',
      code: 'EQ004',
      name: '包装机',
      type: '包装设备',
      status: 'stopped',
      location: 'A 车间 -3 线',
      purchaseDate: '2024-10-05',
      nextMaintain: '2026-03-20',
      usageRate: 45,
      healthScore: 82,
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    running: 'success',
    stopped: 'default',
    maintenance: 'warning',
    fault: 'error',
  }

  const statusLabels: Record<string, string> = {
    running: '运行中',
    stopped: '停机',
    maintenance: '维护中',
    fault: '故障',
  }

  const typeColors: Record<string, string> = {
    '生产设备': 'blue',
    '检测设备': 'green',
    '包装设备': 'purple',
    '辅助设备': 'orange',
  }

  const handleCreate = async (values: any) => {
    message.success('添加设备成功')
    setModalVisible(false)
    form.resetFields()
  }

  // 统计数据
  const totalEquipments = equipments.length
  const runningCount = equipments.filter(e => e.status === 'running').length
  const maintenanceCount = equipments.filter(e => e.status === 'maintenance').length
  const avgHealthScore = equipments.reduce((sum, e) => sum + e.healthScore, 0) / totalEquipments

  const columns = [
    {
      title: '设备编码',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      width: 120,
      render: (type: string) => <Tag color={typeColors[type]}>{type}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColors[status]} icon={status === 'running' ? <CheckCircleOutlined /> : status === 'maintenance' ? <ClockCircleOutlined /> : <CloseCircleOutlined />}>
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      width: 150,
    },
    {
      title: '使用率',
      dataIndex: 'usageRate',
      width: 130,
      render: (rate: number) => (
        <Progress
          percent={rate}
          strokeColor={rate >= 80 ? '#52c41a' : rate >= 60 ? '#faad14' : '#ff4d4f'}
          size="small"
          format={() => `${rate}%`}
        />
      ),
    },
    {
      title: '健康度',
      dataIndex: 'healthScore',
      width: 130,
      render: (score: number) => (
        <Progress
          percent={score}
          strokeColor={score >= 90 ? '#52c41a' : score >= 80 ? '#faad14' : '#ff4d4f'}
          size="small"
          format={() => `${score}分`}
        />
      ),
    },
    {
      title: '下次保养',
      dataIndex: 'nextMaintain',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Equipment) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">保养</Button>
          {record.status === 'running' ? <Button type="link" size="small" danger>停机</Button> : <Button type="link" size="small">启动</Button>}
        </Space>
      ),
    },
  ]

  const trendData = [
    { month: '1 月', oee: 82, availability: 95, performance: 90, quality: 96 },
    { month: '2 月', oee: 85, availability: 96, performance: 92, quality: 95 },
    { month: '3 月', oee: 88, availability: 97, performance: 94, quality: 96 },
  ]

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>🔧 设备管理</h1>
        <p style={{ color: '#666' }}>设备全生命周期管理与维护</p>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={totalEquipments}
              suffix="台"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="运行中"
              value={runningCount}
              suffix="台"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="维护中"
              value={maintenanceCount}
              suffix="台"
              valueStyle={{ color: '#faad14', fontSize: 24, fontWeight: 700 }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均健康度"
              value={avgHealthScore}
              precision={0}
              suffix="分"
              valueStyle={{ color: '#722ed1', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="📋 设备列表"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                添加设备
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={equipments}
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
          <Card title="📈 设备 OEE 趋势">
            <Line
              data={trendData.flatMap(item => [
                { month: item.month, type: 'OEE', value: item.oee },
                { month: item.month, type: '可用性', value: item.availability },
                { month: item.month, type: '性能', value: item.performance },
                { month: item.month, type: '质量', value: item.quality },
              ])}
              xField="month"
              yField="value"
              seriesField="type"
              smooth
              height={300}
            />
          </Card>

          <Card title="⏰ 即将保养设备" style={{ marginTop: 16 }}>
            <Timeline
              items={equipments
                .filter(e => e.status !== 'maintenance')
                .slice(0, 4)
                .map((item) => ({
                  color: 'blue',
                  children: (
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        下次保养：{item.nextMaintain}
                      </div>
                    </div>
                  ),
                }))}
            />
          </Card>

          <Card title="📊 设备类型分布" style={{ marginTop: 16 }}>
            <Pie
              appendPadding={10}
              data={[
                { type: '生产设备', value: 2 },
                { type: '检测设备', value: 1 },
                { type: '包装设备', value: 1 },
              ]}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: 'outer',
                content: '{name} {percentage}',
              }}
              height={250}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="添加设备"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="code" label="设备编码" rules={[{ required: true }]}>
              <Input placeholder="请输入设备编码" />
            </Form.Item>

            <Form.Item name="name" label="设备名称" rules={[{ required: true }]}>
              <Input placeholder="请输入设备名称" />
            </Form.Item>

            <Form.Item name="type" label="设备类型" rules={[{ required: true }]}>
              <Select>
                <Option value="生产设备">生产设备</Option>
                <Option value="检测设备">检测设备</Option>
                <Option value="包装设备">包装设备</Option>
                <Option value="辅助设备">辅助设备</Option>
              </Select>
            </Form.Item>

            <Form.Item name="location" label="安装位置" rules={[{ required: true }]}>
              <Input placeholder="请输入安装位置" />
            </Form.Item>

            <Form.Item name="purchaseDate" label="购置日期">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="nextMaintain" label="下次保养日期">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default EquipmentManagement
