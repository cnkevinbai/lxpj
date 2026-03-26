import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, DatePicker, Select, message, Statistic, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const Assets: React.FC = () => {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const typeColors: Record<string, string> = {
    equipment: 'blue',
    vehicle: 'green',
    building: 'purple',
    other: 'default',
  }

  const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    maintenance: 'warning',
    scrapped: 'error',
  }

  const fetchAssets = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/finance/assets')
      const data = await response.json()
      setAssets(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/finance/assets-statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchAssets()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/finance/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchAssets()
  }

  const columns = [
    { title: '资产编号', dataIndex: 'assetCode', width: 120 },
    { title: '资产名称', dataIndex: 'assetName', width: 200 },
    { title: '资产类型', dataIndex: 'type', width: 100, render: (t: string) => <Tag color={typeColors[t]}>{t}</Tag> },
    { title: '原值', dataIndex: 'originalValue', width: 120, render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '已折旧', dataIndex: 'depreciatedValue', width: 120, render: (v: number) => `¥${v.toLocaleString()}` },
    { title: '净值', dataIndex: 'netValue', width: 120, render: (v: number) => <span style={{ color: '#1890ff' }}>¥${v.toLocaleString()}</span> },
    { title: '购入日期', dataIndex: 'purchaseDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">折旧</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="资产总数" value={statistics.total || 0} suffix="个" /></Card></Col>
        <Col span={6}><Card><Statistic title="资产原值" value={statistics.originalValue || 0} precision={2} prefix="¥" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="累计折旧" value={statistics.totalDepreciation || 0} precision={2} prefix="¥" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="资产净值" value={statistics.netValue || 0} precision={2} prefix="¥" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card
        title="🏢 固定资产管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>新增资产</Button>}
      >
        <Table columns={columns} dataSource={assets} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="新增资产" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="assetName" label="资产名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="资产类型" rules={[{ required: true }]}>
            <Select><Select.Option value="equipment">设备</Select.Option><Select.Option value="vehicle">车辆</Select.Option><Select.Option value="building">房屋</Select.Option><Select.Option value="other">其他</Select.Option></Select>
          </Form.Item>
          <Form.Item name="originalValue" label="资产原值" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} prefix="¥" /></Form.Item>
          <Form.Item name="purchaseDate" label="购入日期"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="notes" label="备注"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Assets
