import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Tag, Space, Modal, Form, Input, message, Popconfirm } from 'antd'
import { PlusOutlined, InboxOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import apiClient from '../../services/api'

const LeadList: React.FC = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/leads', {
        params: { page, limit: 20 }
      })
      setData(response.data.data)
      setTotal(response.data.total)
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const handleConvert = async (id: string) => {
    try {
      await apiClient.post(`/leads/${id}/convert`, { customerId: '' })
      message.success('转化成功')
      fetchData()
    } catch (error) {
      message.error('转化失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/leads/${id}`)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '意向产品',
      dataIndex: 'productInterest',
      key: 'productInterest',
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => {
        const color = source === 'website' ? 'blue' : source === 'exhibition' ? 'orange' : 'green'
        return <Tag color={color}>{source === 'website' ? '官网' : source === 'exhibition' ? '展会' : '推荐'}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'new' ? 'red' : status === 'contacted' ? 'orange' : status === 'qualified' ? 'blue' : status === 'converted' ? 'green' : 'gray'
        return <Tag color={color}>{status === 'new' ? '新线索' : status === 'contacted' ? '已联系' : status === 'qualified' ? '已确认' : status === 'converted' ? '已转化' : '已流失'}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === 'new' && (
            <Button type="link" icon={<CheckOutlined />} onClick={() => handleConvert(record.id)}>转化</Button>
          )}
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<CloseOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">线索管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          新建线索
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: 20,
            total: total,
            onChange: (p) => setPage(p),
          }}
        />
      </Card>

      <Modal
        title="新建线索"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={async (values) => {
          try {
            await apiClient.post('/leads', values)
            message.success('创建成功')
            setModalVisible(false)
            form.resetFields()
            fetchData()
          } catch (error) {
            message.error('创建失败')
          }
        }}>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="company" label="公司">
            <Input placeholder="请输入公司" />
          </Form.Item>
          <Form.Item name="productInterest" label="意向产品">
            <Input placeholder="请输入意向产品" />
          </Form.Item>
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

export default LeadList
