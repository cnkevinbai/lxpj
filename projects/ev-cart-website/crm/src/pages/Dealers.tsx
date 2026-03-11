import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Tag, Space, Modal, Form, Input, Select, message, Popconfirm, Statistic, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons'
import apiClient from '../services/api'

const { TextArea } = Input

const Dealers: React.FC = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, active: 0, levels: {}, sales: {} })
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [listRes, statsRes] = await Promise.all([
        apiClient.get('/dealers', { params: { page: 1, limit: 20 } }),
        apiClient.get('/dealers/statistics')
      ])
      setData(listRes.data.data)
      setStats(statsRes.data)
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = async (values: any) => {
    try {
      if (editingId) {
        await apiClient.put(`/dealers/${editingId}`, values)
        message.success('更新成功')
      } else {
        await apiClient.post('/dealers', values)
        message.success('创建成功')
      }
      setModalVisible(false)
      setEditingId(null)
      form.resetFields()
      fetchData()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  const handleEdit = (record: any) => {
    setEditingId(record.id)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/dealers/${id}`)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '经销商编码',
      dataIndex: 'dealerCode',
      key: 'dealerCode',
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '区域',
      dataIndex: 'province',
      key: 'province',
      render: (province: string, record: any) => `${province}${record.city || ''}`,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const color = level === 'platinum' ? 'purple' : level === 'gold' ? 'orange' : 'blue'
        return <Tag color={color}>{level === 'platinum' ? '铂金' : level === 'gold' ? '金牌' : '标准'}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'gray'}>{status === 'active' ? '正常' : '禁用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" icon={<ShopOutlined />}>详情</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">经销商管理</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setModalVisible(true)
          }}
        >
          新建经销商
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="经销商总数"
              value={stats.total || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃经销商"
              value={stats.active || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="销售目标"
              value={`¥${(stats.sales?.target || 0) / 10000}万`}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="实际销售"
              value={`¥${(stats.sales?.actual || 0) / 10000}万`}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 经销商列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingId ? '编辑经销商' : '新建经销商'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingId(null)
          form.resetFields()
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="companyName" label="公司名称" rules={[{ required: true }]}>
              <Input placeholder="请输入公司名称" />
            </Form.Item>
            <Form.Item name="contactPerson" label="联系人" rules={[{ required: true }]}>
              <Input placeholder="请输入联系人" />
            </Form.Item>
            <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true }]}>
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item name="contactEmail" label="联系邮箱" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
            <Form.Item name="province" label="省份" rules={[{ required: true }]}>
              <Input placeholder="请输入省份" />
            </Form.Item>
            <Form.Item name="city" label="城市" rules={[{ required: true }]}>
              <Input placeholder="请输入城市" />
            </Form.Item>
            <Form.Item name="address" label="详细地址">
              <TextArea rows={2} placeholder="请输入详细地址" />
            </Form.Item>
            <Form.Item name="level" label="级别" initialValue="standard">
              <Select>
                <Select.Option value="standard">标准</Select.Option>
                <Select.Option value="gold">金牌</Select.Option>
                <Select.Option value="platinum">铂金</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="salesTarget" label="销售目标">
              <Input placeholder="请输入销售目标" prefix="¥" />
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue="active">
              <Select>
                <Select.Option value="active">正常</Select.Option>
                <Select.Option value="inactive">禁用</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Dealers
