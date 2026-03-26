/**
 * 菜单管理页面
 * 统一UI风格
 */
import { useState } from 'react'
import { Card, Typography, Button, Tree, Space, Input, Modal, Form, Select, message, Popconfirm, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SaveOutlined } from '@ant-design/icons'
import type { TreeDataNode, TreeProps } from 'antd'

const { Title, Text } = Typography

// 模拟菜单数据
const mockMenuData: TreeDataNode[] = [
  {
    title: '工作台',
    key: '/dashboard',
    icon: 'HomeOutlined',
  },
  {
    title: '客户管理',
    key: '/crm',
    icon: 'TeamOutlined',
    children: [
      { title: '客户列表', key: '/crm/customers', icon: 'TeamOutlined' },
      { title: '线索管理', key: '/crm/leads', icon: 'UserOutlined' },
      { title: '商机管理', key: '/crm/opportunities', icon: 'ShoppingCartOutlined' },
      { title: '订单管理', key: '/crm/orders', icon: 'FileTextOutlined' },
      { title: '报价管理', key: '/crm/quotations', icon: 'FileTextOutlined' },
    ],
  },
  {
    title: '运营管理',
    key: '/erp',
    icon: 'ShopOutlined',
    children: [
      { title: '采购管理', key: '/erp/purchase', icon: 'ShoppingOutlined' },
      { title: '库存管理', key: '/erp/inventory', icon: 'HomeOutlined' },
      { title: '生产管理', key: '/erp/production', icon: 'ThunderboltOutlined' },
      { title: '产品管理', key: '/erp/products', icon: 'AppstoreOutlined' },
      { title: '物料清单', key: '/erp/bom', icon: 'FileTextOutlined' },
      { title: '生产计划', key: '/erp/production-plans', icon: 'FileTextOutlined' },
    ],
  },
  {
    title: '财务管理',
    key: '/finance',
    icon: 'DollarOutlined',
    children: [
      { title: '财务概览', key: '/finance/overview', icon: 'AuditOutlined' },
      { title: '应收管理', key: '/finance/receivables', icon: 'WalletOutlined' },
      { title: '应付管理', key: '/finance/payables', icon: 'CreditCardOutlined' },
      { title: '发票管理', key: '/finance/invoices', icon: 'FileTextOutlined' },
    ],
  },
  {
    title: '售后服务',
    key: '/service',
    icon: 'CustomerServiceOutlined',
    children: [
      { title: '工单管理', key: '/service/tickets', icon: 'ToolOutlined' },
      { title: '合同管理', key: '/service/contracts', icon: 'SolutionOutlined' },
      { title: '配件管理', key: '/service/parts', icon: 'AppstoreOutlined' },
    ],
  },
  {
    title: '人事管理',
    key: '/hr',
    icon: 'IdcardOutlined',
    children: [
      { title: '员工管理', key: '/hr/employees', icon: 'TeamOutlined' },
      { title: '考勤管理', key: '/hr/attendance', icon: 'ClockCircleOutlined' },
      { title: '薪资管理', key: '/hr/salary', icon: 'WalletOutlined' },
    ],
  },
  {
    title: '系统设置',
    key: '/settings',
    icon: 'SettingOutlined',
    children: [
      { title: '用户管理', key: '/settings/users', icon: 'UserOutlined' },
      { title: '角色管理', key: '/settings/roles', icon: 'TeamOutlined' },
      { title: '租户管理', key: '/settings/tenants', icon: 'BankOutlined' },
      { title: '系统配置', key: '/settings/system', icon: 'SettingOutlined' },
      { title: '模块管理', key: '/settings/modules', icon: 'AppstoreOutlined' },
      { title: 'Webhook', key: '/settings/webhooks', icon: 'ApiOutlined' },
    ],
  },
]

export default function MenuManagement() {
  const [menuData, setMenuData] = useState<TreeDataNode[]>(mockMenuData)
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingNode, setEditingNode] = useState<TreeDataNode | null>(null)
  const [form] = Form.useForm()
  const [searchValue, setSearchValue] = useState('')

  const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys.length > 0) {
      setSelectedKey(selectedKeys[0] as string)
    }
  }

  const handleAdd = () => {
    if (!selectedKey) {
      message.warning('请先选择父级菜单')
      return
    }
    setEditingNode(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = () => {
    if (!selectedKey) {
      message.warning('请先选择要编辑的菜单')
      return
    }
    // 查找选中的节点
    const findNode = (nodes: TreeDataNode[], key: string): TreeDataNode | null => {
      for (const node of nodes) {
        if (node.key === key) return node
        if (node.children) {
          const found = findNode(node.children, key)
          if (found) return found
        }
      }
      return null
    }
    const node = findNode(menuData, selectedKey)
    if (node) {
      setEditingNode(node)
      form.setFieldsValue({
        title: node.title,
        icon: node.icon,
      })
      setModalVisible(true)
    }
  }

  const handleDelete = () => {
    if (!selectedKey) {
      message.warning('请先选择要删除的菜单')
      return
    }
    message.success('菜单删除成功')
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      message.success(editingNode ? '菜单更新成功' : '菜单创建成功')
      setModalVisible(false)
    } catch (error) {
      // 表单验证失败
    }
  }

  // 自定义树节点标题
  const titleRender = (node: TreeDataNode) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 8 }}>
      <Space>
        <Text>{node.title as string}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>{node.key as string}</Text>
      </Space>
    </div>
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">菜单管理</Title>
        </div>
        <div className="page-header-actions">
          <Button icon={<PlusOutlined />} onClick={handleAdd}>新增菜单</Button>
          <Button icon={<EditOutlined />} onClick={handleEdit}>编辑</Button>
          <Popconfirm title="确定删除此菜单吗？" onConfirm={handleDelete}>
            <Button danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <Card className="daoda-card" title="菜单结构">
            <Input
              placeholder="搜索菜单"
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ marginBottom: 16, width: 300 }}
            />
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, minHeight: 400 }}>
              <Tree
                showLine
                showIcon
                defaultExpandAll
                onSelect={onSelect}
                treeData={menuData}
                titleRender={titleRender}
                selectedKeys={selectedKey ? [selectedKey] : []}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingNode ? '编辑菜单' : '新增菜单'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="菜单名称" rules={[{ required: true }]}>
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item name="path" label="路由路径" rules={[{ required: true }]}>
            <Input placeholder="请输入路由路径，如 /dashboard" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Select placeholder="请选择图标" options={[
              { value: 'HomeOutlined', label: '首页' },
              { value: 'TeamOutlined', label: '团队' },
              { value: 'UserOutlined', label: '用户' },
              { value: 'SettingOutlined', label: '设置' },
              { value: 'FileTextOutlined', label: '文件' },
              { value: 'ShoppingOutlined', label: '购物' },
              { value: 'DollarOutlined', label: '财务' },
              { value: 'ToolOutlined', label: '工具' },
            ]} />
          </Form.Item>
          <Form.Item name="sort" label="排序">
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>
          <Form.Item name="visible" label="是否显示">
            <Select defaultValue={true} options={[
              { value: true, label: '显示' },
              { value: false, label: '隐藏' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}