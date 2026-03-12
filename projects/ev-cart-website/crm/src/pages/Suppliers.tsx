import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message, Statistic, Row, Col, Descriptions, Rate } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [form] = Form.useForm()

  const levelColors: Record<string, string> = {
    gold: 'gold',
    silver: 'default',
    normal: 'blue',
  }

  const statusColors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    blacklisted: 'error',
  }

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/suppliers')
      const data = await response.json()
      setSuppliers(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/suppliers/statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchSuppliers()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setDetailVisible(false)
    fetchSuppliers()
  }

  const columns = [
    { title: '供应商编码', dataIndex: 'supplierCode', width: 120 },
    { title: '供应商名称', dataIndex: 'supplierName', width: 200 },
    { title: '联系人', dataIndex: 'contactPerson', width: 100 },
    { title: '联系电话', dataIndex: 'contactPhone', width: 120 },
    { title: '类别', dataIndex: 'category', width: 120 },
    { title: '等级', dataIndex: 'level', width: 80, render: (l: string) => <Tag color={levelColors[l]}>{l}</Tag> },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: '评分', dataIndex: 'rating', width: 100, render: (r: number) => <Rate disabled value={r / 5} /> },
    { title: '订单数', dataIndex: 'totalOrders', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedSupplier(record); setDetailVisible(true) }}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="供应商总数" value={statistics.total || 0} suffix="个" /></Card></Col>
        <Col span={6}><Card><Statistic title="活跃供应商" value={statistics.active || 0} suffix="个" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="金牌供应商" value={statistics.gold || 0} suffix="个" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="采购总额" value={statistics.totalAmount || 0} precision={2} prefix="¥" valueStyle={{ color: '#1890ff' }} /></Card></Col>
      </Row>

      <Card
        title="🤝 供应商管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setDetailVisible(true)}>新增供应商</Button>}
      >
        <Table columns={columns} dataSource={suppliers} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </Card>

      <Modal
        title="供应商详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedSupplier && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="供应商编码">{selectedSupplier.supplierCode}</Descriptions.Item>
            <Descriptions.Item label="供应商名称">{selectedSupplier.supplierName}</Descriptions.Item>
            <Descriptions.Item label="联系人">{selectedSupplier.contactPerson}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{selectedSupplier.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="联系邮箱">{selectedSupplier.contactEmail}</Descriptions.Item>
            <Descriptions.Item label="所在区域">{selectedSupplier.province}·{selectedSupplier.city}</Descriptions.Item>
            <Descriptions.Item label="供应商类别">{selectedSupplier.category}</Descriptions.Item>
            <Descriptions.Item label="供应商等级"><Tag color={levelColors[selectedSupplier.level]}>{selectedSupplier.level}</Tag></Descriptions.Item>
            <Descriptions.Item label="信用等级">{selectedSupplier.creditRating || '-'}</Descriptions.Item>
            <Descriptions.Item label="付款条款">{selectedSupplier.paymentTerms || '-'}</Descriptions.Item>
            <Descriptions.Item label="订单总数">{selectedSupplier.totalOrders || 0}</Descriptions.Item>
            <Descriptions.Item label="采购总额">¥{(selectedSupplier.totalAmount || 0).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="供应商评分"><Rate disabled value={(selectedSupplier.rating || 0) / 5} /></Descriptions.Item>
            <Descriptions.Item label="状态"><Tag color={statusColors[selectedSupplier.status]}>{selectedSupplier.status}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default Suppliers
