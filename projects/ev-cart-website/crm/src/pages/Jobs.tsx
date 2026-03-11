import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Tag, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import apiClient from '../services/api'

const { TextArea } = Input

const Jobs: React.FC = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/jobs')
      setData(response.data)
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
        await apiClient.put(`/jobs/${editingId}`, values)
        message.success('更新成功')
      } else {
        await apiClient.post('/jobs', values)
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
      await apiClient.delete(`/jobs/${id}`)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '职位名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '工作地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === 'full_time' ? 'blue' : type === 'part_time' ? 'orange' : 'green'
        return <Tag color={color}>{type === 'full_time' ? '全职' : type === 'part_time' ? '兼职' : '实习'}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'gray'}>{status === 'active' ? '招聘中' : '已关闭'}</Tag>
      ),
    },
    {
      title: '申请数',
      dataIndex: 'applyCount',
      key: 'applyCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" icon={<EyeOutlined />}>详情</Button>
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
        <h1 className="text-2xl font-bold">招聘管理</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setModalVisible(true)
          }}
        >
          新建职位
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title={editingId ? '编辑职位' : '新建职位'}
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
            <Form.Item name="title" label="职位名称" rules={[{ required: true }]}>
              <Input placeholder="请输入职位名称" />
            </Form.Item>
            <Form.Item name="department" label="部门" rules={[{ required: true }]}>
              <Input placeholder="请输入部门" />
            </Form.Item>
            <Form.Item name="location" label="工作地点" rules={[{ required: true }]}>
              <Input placeholder="请输入工作地点" />
            </Form.Item>
            <Form.Item name="type" label="职位类型" initialValue="full_time">
              <Select>
                <Select.Option value="full_time">全职</Select.Option>
                <Select.Option value="part_time">兼职</Select.Option>
                <Select.Option value="intern">实习</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="salaryRange" label="薪资范围">
              <Input placeholder="请输入薪资范围" />
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue="active">
              <Select>
                <Select.Option value="active">招聘中</Select.Option>
                <Select.Option value="closed">已关闭</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="description" label="职位描述" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请输入职位描述" />
          </Form.Item>
          <Form.Item name="requirements" label="任职要求">
            <TextArea rows={4} placeholder="请输入任职要求，多个要求用换行分隔" />
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

export default Jobs
