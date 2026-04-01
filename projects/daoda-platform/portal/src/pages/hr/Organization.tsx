/**
 * 组织架构页面
 * 组织设计、部门管理、职位体系
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Tree,
  Button,
  Space,
  Tag,
  Typography,
  Statistic,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  message,
  Descriptions,
  Table,
  Popconfirm,
  Dropdown,
  Tooltip,
} from 'antd'
import {
  ApartmentOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  SwapOutlined,
  SearchOutlined,
  ExpandOutlined,
  CompressOutlined,
} from '@ant-design/icons'
import type { TreeDataNode, TreeProps } from 'antd'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select

// 组织类型
enum OrgType {
  COMPANY = 'COMPANY',
  DEPARTMENT = 'DEPARTMENT',
  TEAM = 'TEAM',
  POSITION = 'POSITION',
}

interface OrgNode {
  id: string
  name: string
  code: string
  type: OrgType
  parentId?: string
  level: number
  status: string
  employeeCount?: number
  managerId?: string
  description?: string
  children?: OrgNode[]
}

export default function Organization() {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [stats, setStats] = useState({
    totalDepartments: 8,
    totalTeams: 6,
    totalPositions: 7,
    totalEmployees: 85,
    avgTeamSize: 14,
    maxDepth: 3,
  })
  const [searchValue, setSearchValue] = useState('')
  const [form] = Form.useForm()

  useEffect(() => {
    fetchOrgTree()
    fetchStats()
  }, [])

  const fetchOrgTree = async () => {
    setLoading(true)
    // 模拟数据
    const mockTree: OrgNode[] = [
      {
        id: 'ORG-001',
        name: '道达智能科技有限公司',
        code: 'DAOD',
        type: OrgType.COMPANY,
        level: 0,
        status: 'ACTIVE',
        employeeCount: 85,
        children: [
          {
            id: 'ORG-002',
            name: '研发部',
            code: 'DEV',
            type: OrgType.DEPARTMENT,
            parentId: 'ORG-001',
            level: 1,
            status: 'ACTIVE',
            employeeCount: 35,
            children: [
              { id: 'ORG-009', name: '前端开发组', code: 'FE', type: OrgType.TEAM, parentId: 'ORG-002', level: 2, status: 'ACTIVE', employeeCount: 12 },
              { id: 'ORG-010', name: '后端开发组', code: 'BE', type: OrgType.TEAM, parentId: 'ORG-002', level: 2, status: 'ACTIVE', employeeCount: 10 },
              { id: 'ORG-011', name: '测试组', code: 'QA', type: OrgType.TEAM, parentId: 'ORG-002', level: 2, status: 'ACTIVE', employeeCount: 8 },
              { id: 'ORG-012', name: '架构组', code: 'ARCH', type: OrgType.TEAM, parentId: 'ORG-002', level: 2, status: 'ACTIVE', employeeCount: 5 },
            ],
          },
          {
            id: 'ORG-003',
            name: '销售部',
            code: 'SALES',
            type: OrgType.DEPARTMENT,
            parentId: 'ORG-001',
            level: 1,
            status: 'ACTIVE',
            employeeCount: 20,
            children: [
              { id: 'ORG-013', name: '华北销售组', code: 'NORTH', type: OrgType.TEAM, parentId: 'ORG-003', level: 2, status: 'ACTIVE', employeeCount: 10 },
              { id: 'ORG-014', name: '华南销售组', code: 'SOUTH', type: OrgType.TEAM, parentId: 'ORG-003', level: 2, status: 'ACTIVE', employeeCount: 10 },
            ],
          },
          { id: 'ORG-004', name: '市场部', code: 'MKT', type: OrgType.DEPARTMENT, parentId: 'ORG-001', level: 1, status: 'ACTIVE', employeeCount: 8 },
          { id: 'ORG-005', name: '财务部', code: 'FIN', type: OrgType.DEPARTMENT, parentId: 'ORG-001', level: 1, status: 'ACTIVE', employeeCount: 5 },
          { id: 'ORG-006', name: '人力资源部', code: 'HR', type: OrgType.DEPARTMENT, parentId: 'ORG-001', level: 1, status: 'ACTIVE', employeeCount: 4 },
          { id: 'ORG-007', name: '运营部', code: 'OPS', type: OrgType.DEPARTMENT, parentId: 'ORG-001', level: 1, status: 'ACTIVE', employeeCount: 8 },
          { id: 'ORG-008', name: '售后服务部', code: 'SVC', type: OrgType.DEPARTMENT, parentId: 'ORG-001', level: 1, status: 'ACTIVE', employeeCount: 9 },
        ],
      },
    ]

    const antdTree = convertToAntdTree(mockTree)
    setTreeData(antdTree)
    setExpandedKeys(['ORG-001', 'ORG-002', 'ORG-003'])
    setLoading(false)
  }

  const convertToAntdTree = (nodes: OrgNode[]): TreeDataNode[] => {
    return nodes.map(node => ({
      key: node.id,
      title: renderNodeTitle(node),
      children: node.children ? convertToAntdTree(node.children) : undefined,
    }))
  }

  const renderNodeTitle = (node: OrgNode) => {
    const typeConfig: Record<OrgType, { color: string; icon: any; text: string }> = {
      COMPANY: { color: 'gold', icon: <ApartmentOutlined />, text: '公司' },
      DEPARTMENT: { color: 'blue', icon: <ApartmentOutlined />, text: '部门' },
      TEAM: { color: 'green', icon: <TeamOutlined />, text: '团队' },
      POSITION: { color: 'purple', icon: <UserOutlined />, text: '职位' },
    }
    const config = typeConfig[node.type]

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Space>
          <Tag color={config.color} icon={config.icon}>{config.text}</Tag>
          <Text strong>{node.name}</Text>
          <Text type="secondary">({node.code})</Text>
          {node.employeeCount && (
            <Tag style={{ marginLeft: 8 }}>
              <UserOutlined /> {node.employeeCount}
            </Tag>
          )}
        </Space>
        <Dropdown
          menu={{
            items: [
              { key: 'edit', icon: <EditOutlined />, label: '编辑' },
              { key: 'add', icon: <PlusOutlined />, label: '添加子组织' },
              { key: 'move', icon: <SwapOutlined />, label: '移动' },
              { key: 'delete', icon: <DeleteOutlined />, label: '删除', danger: true },
            ],
            onClick: (e) => handleMenuClick(e.key, node),
          }}
          trigger={['click']}
        >
          <Button type="text" size="small" icon={<SettingOutlined />} />
        </Dropdown>
      </div>
    )
  }

  const handleMenuClick = (key: string, node: OrgNode) => {
    switch (key) {
      case 'edit':
        setSelectedNode(node)
        form.setFieldsValue({ name: node.name, code: node.code, type: node.type })
        setEditModalVisible(true)
        break
      case 'add':
        setSelectedNode(node)
        form.resetFields()
        setModalVisible(true)
        break
      case 'delete':
        handleDelete(node.id)
        break
    }
  }

  const fetchStats = async () => {
    setStats({
      totalDepartments: 8,
      totalTeams: 6,
      totalPositions: 7,
      totalEmployees: 85,
      avgTeamSize: 14,
      maxDepth: 3,
    })
  }

  const handleCreate = async () => {
    try {
      const values = await form.validateFields()
      message.success('创建成功')
      setModalVisible(false)
      fetchOrgTree()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()
      message.success('更新成功')
      setEditModalVisible(false)
      fetchOrgTree()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleDelete = (id: string) => {
    message.success('删除成功')
    fetchOrgTree()
  }

  const handleSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      // 查找节点详情
      setSelectedNode({
        id: selectedKeys[0] as string,
        name: '选中节点',
        code: 'CODE',
        type: OrgType.DEPARTMENT,
        level: 1,
        status: 'ACTIVE',
      })
    }
  }

  const handleExpandAll = () => {
    const allKeys = getAllKeys(treeData)
    setExpandedKeys(allKeys)
  }

  const getAllKeys = (nodes: TreeDataNode[]): string[] => {
    const keys: string[] = []
    nodes.forEach(n => {
      keys.push(n.key as string)
      if (n.children) keys.push(...getAllKeys(n.children))
    })
    return keys
  }

  const handleCollapseAll = () => {
    setExpandedKeys([])
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <ApartmentOutlined style={{ marginRight: 8 }} />
            组织架构
          </Title>
          <Text type="secondary">组织设计、部门管理、职位体系</Text>
        </div>
        <div className="page-header-actions">
          <Input.Search
            placeholder="搜索组织"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <Button icon={<ExpandOutlined />} onClick={handleExpandAll} style={{ marginRight: 8 }}>
            展开全部
          </Button>
          <Button icon={<CompressOutlined />} onClick={handleCollapseAll} style={{ marginRight: 8 }}>
            收起全部
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedNode(null); form.resetFields(); setModalVisible(true) }}>
            新建组织
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">部门数量</Text>}
              value={stats.totalDepartments}
              prefix={<ApartmentOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">团队数量</Text>}
              value={stats.totalTeams}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">职位数量</Text>}
              value={stats.totalPositions}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">总员工数</Text>}
              value={stats.totalEmployees}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均团队规模</Text>}
              value={stats.avgTeamSize}
              suffix="人"
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">层级深度</Text>}
              value={stats.maxDepth}
              suffix="层"
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 组织架构树 */}
      <Card className="daoda-card" loading={loading}>
        <Tree
          showLine
          showIcon
          treeData={treeData}
          expandedKeys={expandedKeys}
          onExpand={(keys: React.Key[]) => setExpandedKeys(keys as string[])}
          onSelect={(selectedKeys: React.Key[]) => {
            if (selectedKeys.length > 0) {
              setSelectedNode({
                id: selectedKeys[0] as string,
                name: '选中节点',
                code: 'CODE',
                type: OrgType.DEPARTMENT,
                level: 1,
                status: 'ACTIVE',
              })
            }
          }}
          blockNode
          style={{ fontSize: 14 }}
        />
      </Card>

      {/* 选中节点详情 */}
      {selectedNode && (
        <Card className="daoda-card" style={{ marginTop: 16 }} title="组织详情">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="组织名称">{selectedNode.name}</Descriptions.Item>
            <Descriptions.Item label="组织编码">{selectedNode.code}</Descriptions.Item>
            <Descriptions.Item label="组织类型">
              <Tag color="blue">{selectedNode.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="层级">{selectedNode.level}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color="success">正常</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="员工数">{selectedNode.employeeCount || 0}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* 新建组织弹窗 */}
      <Modal
        title="新建组织"
        open={modalVisible}
        onOk={handleCreate}
        onCancel={() => setModalVisible(false)}
        width={500}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="组织名称" rules={[{ required: true, message: '请输入组织名称' }]}>
            <Input placeholder="请输入组织名称" />
          </Form.Item>
          <Form.Item name="code" label="组织编码" rules={[{ required: true, message: '请输入组织编码' }]}>
            <Input placeholder="请输入组织编码" />
          </Form.Item>
          <Form.Item name="type" label="组织类型" rules={[{ required: true, message: '请选择组织类型' }]}>
            <Select placeholder="请选择组织类型">
              <Option value={OrgType.DEPARTMENT}>部门</Option>
              <Option value={OrgType.TEAM}>团队</Option>
              <Option value={OrgType.POSITION}>职位</Option>
            </Select>
          </Form.Item>
          {selectedNode && (
            <Form.Item label="上级组织">
              <Input value={selectedNode.name} disabled />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* 编辑组织弹窗 */}
      <Modal
        title="编辑组织"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => setEditModalVisible(false)}
        width={500}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="组织名称" rules={[{ required: true, message: '请输入组织名称' }]}>
            <Input placeholder="请输入组织名称" />
          </Form.Item>
          <Form.Item name="code" label="组织编码" rules={[{ required: true, message: '请输入组织编码' }]}>
            <Input placeholder="请输入组织编码" />
          </Form.Item>
          <Form.Item name="type" label="组织类型">
            <Select placeholder="请选择组织类型">
              <Option value={OrgType.DEPARTMENT}>部门</Option>
              <Option value={OrgType.TEAM}>团队</Option>
              <Option value={OrgType.POSITION}>职位</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}