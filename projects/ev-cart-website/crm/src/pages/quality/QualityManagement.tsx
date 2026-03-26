import React, { useState } from 'react'
import { Card, Row, Col, Table, Statistic, Progress, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message, Rate } from 'antd'
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Pie, Column } from '@ant-design/plots'

const { Option } = Select

interface QualityCheck {
  id: string
  productCode: string
  productName: string
  batchNo: string
  checkType: string
  checkDate: string
  passRate: number
  status: string
  inspector: string
  defects: number
}

const QualityManagement: React.FC = () => {
  const [checks, setChecks] = useState<QualityCheck[]>([
    {
      id: '1',
      productCode: 'P001',
      productName: '智能换电柜 V3',
      batchNo: 'B20260313001',
      checkType: '入库检验',
      checkDate: '2026-03-13',
      passRate: 98.5,
      status: 'passed',
      inspector: '张工',
      defects: 2,
    },
    {
      id: '2',
      productCode: 'P002',
      productName: '锂电池 48V',
      batchNo: 'B20260313002',
      checkType: '过程检验',
      checkDate: '2026-03-13',
      passRate: 95.2,
      status: 'warning',
      inspector: '李工',
      defects: 8,
    },
    {
      id: '3',
      productCode: 'P003',
      productName: '智能换电柜 V2',
      batchNo: 'B20260312001',
      checkType: '出厂检验',
      checkDate: '2026-03-12',
      passRate: 88.0,
      status: 'failed',
      inspector: '王工',
      defects: 18,
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    passed: 'success',
    warning: 'warning',
    failed: 'error',
  }

  const statusLabels: Record<string, string> = {
    passed: '合格',
    warning: '待复检',
    failed: '不合格',
  }

  const typeColors: Record<string, string> = {
    '入库检验': 'blue',
    '过程检验': 'green',
    '出厂检验': 'purple',
    '抽检': 'orange',
  }

  const handleCreate = async (values: any) => {
    message.success('创建质检记录成功')
    setModalVisible(false)
    form.resetFields()
  }

  // 统计数据
  const totalChecks = checks.length
  const passRate = checks.reduce((sum, c) => sum + c.passRate, 0) / totalChecks
  const failedCount = checks.filter(c => c.status === 'failed').length

  const defectData = [
    { type: '外观缺陷', count: 15 },
    { type: '功能异常', count: 8 },
    { type: '尺寸偏差', count: 5 },
    { type: '材料问题', count: 3 },
    { type: '其他', count: 2 },
  ]

  const columns = [
    {
      title: '产品编码',
      dataIndex: 'productCode',
      width: 120,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 180,
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      width: 150,
    },
    {
      title: '检验类型',
      dataIndex: 'checkType',
      width: 100,
      render: (type: string) => <Tag color={typeColors[type]}>{type}</Tag>,
    },
    {
      title: '检验日期',
      dataIndex: 'checkDate',
      width: 110,
    },
    {
      title: '合格率',
      dataIndex: 'passRate',
      width: 120,
      render: (rate: number) => (
        <Progress
          percent={rate}
          strokeColor={rate >= 95 ? '#52c41a' : rate >= 90 ? '#faad14' : '#ff4d4f'}
          size="small"
          format={() => `${rate}%`}
        />
      ),
    },
    {
      title: '缺陷数',
      dataIndex: 'defects',
      width: 90,
      render: (defects: number) => (
        <span style={{ color: defects > 10 ? '#ff4d4f' : '#666' }}>{defects}个</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={statusColors[status]} icon={status === 'passed' ? <CheckCircleOutlined /> : status === 'failed' ? <CloseCircleOutlined /> : <WarningOutlined />}>
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: '检验员',
      dataIndex: 'inspector',
      width: 90,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: QualityCheck) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          {record.status === 'failed' && <Button type="link" size="small" danger>复检</Button>}
          <Button type="link" size="small">报告</Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>🔍 质量管理</h1>
        <p style={{ color: '#666' }}>全流程质量管控与追溯</p>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总检验批次"
              value={totalChecks}
              suffix="批"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均合格率"
              value={passRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: passRate >= 95 ? '#52c41a' : '#faad14', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="合格批次"
              value={checks.filter(c => c.status === 'passed').length}
              suffix="批"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="不合格批次"
              value={failedCount}
              suffix="批"
              valueStyle={{ color: '#ff4d4f', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="📋 质检记录"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                新建质检
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={checks}
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
          <Card title="📊 缺陷类型分布">
            <Pie
              appendPadding={10}
              data={defectData}
              angleField="count"
              colorField="type"
              radius={0.8}
              label={{
                type: 'outer',
                content: '{name} {percentage}',
              }}
              height={300}
            />
          </Card>

          <Card title="⭐ 质量评级" style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: '#52c41a', marginBottom: 8 }}>
                A+
              </div>
              <Rate disabled defaultValue={5} style={{ fontSize: 20 }} />
              <div style={{ marginTop: 16, color: '#666' }}>
                本月质量评级优秀
              </div>
            </div>
          </Card>

          <Card title="📈 质量趋势" style={{ marginTop: 16 }}>
            <Column
              data={[
                { month: '1 月', rate: 92 },
                { month: '2 月', rate: 94 },
                { month: '3 月', rate: 95 },
              ]}
              xField="month"
              yField="rate"
              seriesField="rate"
              color="#1890ff"
              label={{
                position: 'top',
                content: (item: any) => `${item.rate}%`,
              }}
              height={200}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="新建质检记录"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="productCode" label="产品编码" rules={[{ required: true }]}>
              <Select>
                <Option value="P001">P001 - 智能换电柜 V3</Option>
                <Option value="P002">P002 - 锂电池 48V</Option>
              </Select>
            </Form.Item>

            <Form.Item name="batchNo" label="批次号" rules={[{ required: true }]}>
              <Input placeholder="请输入批次号" />
            </Form.Item>

            <Form.Item name="checkType" label="检验类型" rules={[{ required: true }]}>
              <Select>
                <Option value="入库检验">入库检验</Option>
                <Option value="过程检验">过程检验</Option>
                <Option value="出厂检验">出厂检验</Option>
                <Option value="抽检">抽检</Option>
              </Select>
            </Form.Item>

            <Form.Item name="checkDate" label="检验日期" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="passRate" label="合格率 (%)" rules={[{ required: true }]}>
              <Input.Number
                style={{ width: '100%' }}
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => Number(String(value || 0).replace(/%/g, ''))}
              />
            </Form.Item>

            <Form.Item name="inspector" label="检验员" rules={[{ required: true }]}>
              <Select>
                <Option value="张工">张工</Option>
                <Option value="李工">李工</Option>
                <Option value="王工">王工</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="defects" label="缺陷数量">
            <Input.Number
              style={{ width: '100%' }}
              min={0}
              formatter={(value) => `${value}个`}
              parser={(value) => Number(String(value || 0).replace(/个/g, ''))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default QualityManagement
