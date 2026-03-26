import React, { useState } from 'react'
import { Table, Card, Button, Space, Tag, Modal, Form, Input, Tree, Checkbox, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons'
import type { TreeProps } from 'antd'

interface Role {
  id: string
  name: string
  code: string
  description: string
  userCount: number
  isSystem: boolean
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '超级管理员',
      code: 'admin',
      description: '拥有系统所有权限',
      userCount: 2,
      isSystem: true,
    },
    {
      id: '2',
      name: '销售经理',
      code: 'sales_manager',
      description: '管理销售团队和客户',
      userCount: 5,
      isSystem: false,
    },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const permissionTree: TreeProps['treeData'] = [
    {
      title: '销售管理',
      key: 'sales',
      children: [
        { title: '线索管理', key: 'leads' },
        { title: '商机管理', key: 'opportunities' },
        { title: '客户管理', key: 'customers' },
        { title: '订单管理', key: 'orders' },
      ],
    },
    {
      title: '财务管理',
      key: 'finance',
      children: [
        { title: '应收应付', key: 'receivables' },
        { title: '发票管理', key: 'invoices' },
        { title: '费用报销', key: 'expenses' },
      ],
    },
    {
      title: '系统管理',
      key: 'system',
      children: [
        { title: '用户管理', key: 'users' },
        { title: '角色管理', key: 'roles' },
        { title: '系统设置', key: 'settings' },
      ],
    },
  ]

  const handleCreate = async (values: any) => {
    message.success('创建角色成功')
    setModalVisible(false)
    form.resetFields()
  }

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      width: 100,
    },
    {
      title: '类型',
      key: 'type',
      width: 100,
      render: (_: any, record: Role) => (
        record.isSystem ? <Tag color="red">系统角色</Tag> : <Tag>自定义</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: Role) => (
        <Space size="small">
          <Button type="link" size="small">权限配置</Button>
          {!record.isSystem && (
            <>
              <Button type="link" size="small" icon={<CopyOutlined />}>复制</Button>
              <Button type="link" size="small" danger>删除</Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          新建角色
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title="新建角色"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="name"
              label="角色名称"
              rules={[{ required: true, message: '请输入角色名称' }]}
            >
              <Input placeholder="请输入角色名称" />
            </Form.Item>

            <Form.Item
              name="code"
              label="角色编码"
              rules={[{ required: true, message: '请输入角色编码' }]}
            >
              <Input placeholder="请输入角色编码，如：sales_manager" />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="角色描述"
          >
            <Input.TextArea rows={2} placeholder="请输入角色描述" />
          </Form.Item>

          <Form.Item label="权限配置">
            <Checkbox.Group style={{ width: '100%' }}>
              <div style={{ border: '1px solid #f0f0f0', padding: 16, borderRadius: 4 }}>
                <Tree
                  checkable
                  defaultExpandAll
                  treeData={permissionTree}
                />
              </div>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoleManagement
