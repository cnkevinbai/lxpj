import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message } from 'antd'
import { SettingOutlined, PlusOutlined } from '@ant-design/icons'
import apiClient from '../../services/api'

/**
 * 权限管理面板
 */
const PermissionPanel: React.FC = () => {
  const [permissions, setPermissions] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPermissions()
  }, [])

  const loadPermissions = async () => {
    try {
      const response = await apiClient.get('/permissions')
      setPermissions(response.data)
    } catch (error) {
      console.error('加载权限失败', error)
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await apiClient.post('/permissions', values)
      message.success('权限创建成功')
      setModalVisible(false)
      form.resetFields()
      loadPermissions()
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建失败')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      render: (module: string) => <Tag color="blue">{module}</Tag>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const colorMap: Record<string, string> = {
          create: 'green',
          read: 'blue',
          update: 'orange',
          delete: 'red',
        }
        return <Tag color={colorMap[action] || 'default'}>{action}</Tag>
      },
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          domestic: 'green',
          foreign: 'blue',
          both: 'purple',
        }
        const textMap: Record<string, string> = {
          domestic: '内贸',
          foreign: '外贸',
          both: '通用',
        }
        return <Tag color={colorMap[type]}>{textMap[type]}</Tag>
      },
    },
  ]

  return (
    <div className="p-4">
      <Card
        title="权限管理面板"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            添加权限
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          loading={loading}
        />
      </Card>

      {/* 添加权限弹窗 */}
      <Modal
        title="添加权限"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="例如：customer.create" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="请输入权限描述" />
          </Form.Item>

          <Form.Item
            name="module"
            label="所属模块"
            rules={[{ required: true, message: '请选择模块' }]}
          >
            <Select placeholder="请选择模块">
              <Select.Option value="customer">客户管理</Select.Option>
              <Select.Option value="lead">线索管理</Select.Option>
              <Select.Option value="opportunity">商机管理</Select.Option>
              <Select.Option value="order">订单管理</Select.Option>
              <Select.Option value="product">产品管理</Select.Option>
              <Select.Option value="foreign-customer">外贸客户</Select.Option>
              <Select.Option value="foreign-lead">外贸线索</Select.Option>
              <Select.Option value="foreign-order">外贸订单</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="action"
            label="操作类型"
            rules={[{ required: true, message: '请选择操作类型' }]}
          >
            <Select placeholder="请选择操作类型">
              <Select.Option value="create">创建</Select.Option>
              <Select.Option value="read">查看</Select.Option>
              <Select.Option value="update">编辑</Select.Option>
              <Select.Option value="delete">删除</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="businessType"
            label="业务类型"
            rules={[{ required: true, message: '请选择业务类型' }]}
            initialValue="both"
          >
            <Select placeholder="请选择业务类型">
              <Select.Option value="both">通用</Select.Option>
              <Select.Option value="domestic">内贸</Select.Option>
              <Select.Option value="foreign">外贸</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex gap-2">
              <Button type="primary" htmlType="submit" loading={loading} block>
                提交
              </Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PermissionPanel
