/**
 * 角色权限管理页面
 */
import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Tree, message } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'

const permissionTree = [
  {
    title: '监控中心',
    key: 'monitor',
    children: [
      { title: '查看大屏', key: 'monitor:dashboard' },
      { title: '实时地图', key: 'monitor:map' },
    ],
  },
  {
    title: '设备管理',
    key: 'device',
    children: [
      { title: '终端管理', key: 'device:terminal' },
      { title: '车辆管理', key: 'device:vehicle' },
      { title: '设备接入', key: 'device:access' },
    ],
  },
  {
    title: '告警管理',
    key: 'alarm',
    children: [
      { title: '告警列表', key: 'alarm:list' },
      { title: '告警处理', key: 'alarm:handle' },
      { title: '告警规则', key: 'alarm:rule' },
    ],
  },
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '模块管理', key: 'system:module' },
      { title: '租户管理', key: 'system:tenant' },
      { title: '角色管理', key: 'system:role' },
    ],
  },
]

interface Role {
  id: string
  name: string
  code: string
  description: string
  userCount: number
  createTime: string
}

export default function Roles() {
  const [modalOpen, setModalOpen] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [form] = Form.useForm()
  
  const roles: Role[] = [
    { id: '1', name: '超级管理员', code: 'super_admin', description: '拥有所有权限', userCount: 1, createTime: '2026-01-01' },
    { id: '2', name: '管理员', code: 'admin', description: '管理租户内所有业务', userCount: 5, createTime: '2026-01-15' },
    { id: '3', name: '运维人员', code: 'operator', description: '设备运维、告警处理', userCount: 10, createTime: '2026-02-01' },
    { id: '4', name: '普通用户', code: 'user', description: '查看监控数据', userCount: 50, createTime: '2026-02-15' },
  ]
  
  const columns = [
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '角色编码', dataIndex: 'code', key: 'code' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '用户数', dataIndex: 'userCount', key: 'userCount' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small">权限配置</Button>
        </Space>
      ),
    },
  ]
  
  return (
    <div className="roles-page">
      <Card 
        title="角色权限管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新增角色</Button>}
      >
        <Table columns={columns} dataSource={roles} rowKey="id" />
      </Card>
      
      <Modal
        title="新增角色"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => { message.success('创建成功'); setModalOpen(false) }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="code" label="角色编码" rules={[{ required: true }]}>
            <Input placeholder="请输入角色编码" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input placeholder="请输入描述" />
          </Form.Item>
          <Form.Item label="权限配置">
            <Tree
              checkable
              checkedKeys={checkedKeys}
              onCheck={(keys) => setCheckedKeys(keys as string[])}
              treeData={permissionTree}
              style={{ border: '1px solid #d9d9d9', borderRadius: 4, padding: 8, maxHeight: 300, overflow: 'auto' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}