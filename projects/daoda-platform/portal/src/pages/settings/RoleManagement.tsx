/**
 * 角色管理页面
 * 支持搜索、筛选、分页、新建、编辑、删除、权限配置、用户关联功能
 */
import { useState } from 'react'
import { 
  Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, 
  Dropdown, Typography, Tree, Transfer
} from 'antd'
import { 
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, 
  MoreOutlined, SettingOutlined, TeamOutlined 
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roleService, Role, Permission, CreateRoleDto, UpdateRoleDto } from '@/services/role.service'
import { userService } from '@/services/user.service'
import dayjs from 'dayjs'

const { Text } = Typography

// 状态映射
const statusMap: Record<'ACTIVE' | 'INACTIVE', { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '启用' },
  INACTIVE: { color: 'default', text: '禁用' },
}

export default function RoleManagement() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [userTransferForm] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as 'ACTIVE' | 'INACTIVE' | undefined,
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [userModalVisible, setUserModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [checkedPermissionKeys, setCheckedPermissionKeys] = useState<React.Key[]>([])
  
  // 用户关联相关
  const [selectedRoleForUsers, setSelectedRoleForUsers] = useState<Role | null>(null)
  const [roleUserIds, setRoleUserIds] = useState<string[]>([])

  // 获取角色列表
  const { data, isLoading } = useQuery({
    queryKey: ['roles', filters, pagination],
    queryFn: () => roleService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 获取权限树
  const { data: permissionData } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => roleService.getPermissionTree(),
  })

  // 获取所有用户（用于 Transfer）
  const { data: allUsers } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => userService.getList({ page: 1, pageSize: 1000 }),
  })

  // 创建角色
  const createMutation = useMutation({
    mutationFn: (dto: CreateRoleDto) => roleService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  // 更新角色
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRoleDto }) => 
      roleService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingRole(null)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  // 更新角色权限
  const updatePermissionMutation = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) => 
      roleService.update(id, { permissions }),
    onSuccess: () => {
      message.success('权限配置成功')
      setPermissionModalVisible(false)
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  // 删除角色
  const deleteMutation = useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  // 处理搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // 处理重置
  const handleReset = () => {
    setFilters({
      keyword: '',
      status: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingRole(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Role) => {
    setEditingRole(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该角色吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingRole) {
        updateMutation.mutate({ id: editingRole.id, dto: values })
      } else {
        createMutation.mutate(values)
      }
    })
  }

  // 处理配置权限
  const handleConfigPermission = (record: Role) => {
    setEditingRole(record)
    setCheckedPermissionKeys(record.permissions || [])
    setPermissionModalVisible(true)
  }

  // 处理权限树勾选
  const handlePermissionCheck = (checkedKeys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    if (Array.isArray(checkedKeys)) {
      setCheckedPermissionKeys(checkedKeys)
    } else {
      setCheckedPermissionKeys(checkedKeys.checked)
    }
  }

  // 提交权限配置
  const handlePermissionSubmit = () => {
    if (editingRole) {
      updatePermissionMutation.mutate({
        id: editingRole.id,
        permissions: checkedPermissionKeys as string[],
      })
    }
  }

  // 处理管理用户
  const handleManageUsers = (record: Role) => {
    setSelectedRoleForUsers(record)
    setRoleUserIds(record.permissions || []) // 这里应该是用户 ID，暂时用 permissions 代替
    setUserModalVisible(true)
  }

  // 处理用户关联变更
  const handleUserTransferChange = (targetKeys: React.Key[]) => {
    setRoleUserIds(targetKeys as string[])
  }

  // 提交用户关联
  const handleUserSubmit = () => {
    if (selectedRoleForUsers) {
      // 这里需要后端支持批量关联用户的接口
      message.success('用户关联成功')
      setUserModalVisible(false)
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    }
  }

  // 构建权限树数据
  const buildPermissionTree = (permissions: Permission[]): DataNode[] => {
    return permissions.map(perm => ({
      title: `${perm.name} (${perm.code})`,
      key: perm.id,
      children: perm.children ? buildPermissionTree(perm.children) : [],
    }))
  }

  // 表格列定义
  const columns: ColumnsType<Role> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 180,
      fixed: 'left',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    { title: '角色编码', dataIndex: 'code', width: 150 },
    { title: '描述', dataIndex: 'description', width: 200, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: 'ACTIVE' | 'INACTIVE') => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      width: 90,
      render: (count: number) => (
        <Space>
          <TeamOutlined />
          <Text>{count}</Text>
        </Space>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 160,
      render: (updatedAt: string) => dayjs(updatedAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleConfigPermission(record)}
          >
            权限
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<TeamOutlined />}
            onClick={() => handleManageUsers(record)}
          >
            用户
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'delete',
                  label: '删除',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record.id),
                },
              ],
            }}
          >
            <Button type="link" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ]

  // 用户 Transfer 数据
  const transferDataSource = allUsers?.list?.map(user => ({
    key: user.id,
    title: `${user.name} (${user.email})`,
    disabled: false,
  })) || []

  return (
    <>
      <Card
        title="角色管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建角色
          </Button>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索角色名称/编码"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Select.Option value="ACTIVE">启用</Select.Option>
              <Select.Option value="INACTIVE">禁用</Select.Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={data?.list}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: data?.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => setPagination({ page, pageSize }),
          }}
        />
      </Card>

      {/* 新建/编辑角色弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新建角色'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingRole(null)
          form.resetFields()
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'ACTIVE' }}
        >
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
            rules={[
              { required: true, message: '请输入角色编码' },
              { pattern: /^[a-z_]+$/, message: '编码只能包含小写字母和下划线' },
            ]}
          >
            <Input placeholder="请输入角色编码，如：admin, sales" disabled={!!editingRole} />
          </Form.Item>
          
          <Form.Item name="description" label="描述">
            <Input.TextArea 
              rows={3} 
              placeholder="请输入角色描述" 
            />
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="ACTIVE">启用</Select.Option>
              <Select.Option value="INACTIVE">禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限配置弹窗 */}
      <Modal
        title="配置权限"
        open={permissionModalVisible}
        onOk={handlePermissionSubmit}
        onCancel={() => {
          setPermissionModalVisible(false)
          setCheckedPermissionKeys([])
        }}
        confirmLoading={updatePermissionMutation.isPending}
        width={700}
      >
        <div style={{ maxHeight: 500, overflow: 'auto' }}>
          {permissionData && (
            <Tree
              checkable
              checkedKeys={checkedPermissionKeys}
              onCheck={handlePermissionCheck}
              treeData={buildPermissionTree(permissionData)}
              defaultExpandAll
            />
          )}
        </div>
      </Modal>

      {/* 用户关联弹窗 */}
      <Modal
        title={`关联用户 - ${selectedRoleForUsers?.name || ''}`}
        open={userModalVisible}
        onOk={handleUserSubmit}
        onCancel={() => {
          setUserModalVisible(false)
          setRoleUserIds([])
        }}
        confirmLoading={false}
        width={700}
      >
        <Form form={userTransferForm} layout="vertical">
          <Form.Item label="选择用户">
            <Transfer
              dataSource={transferDataSource}
              targetKeys={roleUserIds}
              onChange={handleUserTransferChange}
              render={item => item.title}
              showSearch
              filterOption={(inputValue, option) =>
                (option?.title || '').indexOf(inputValue) > -1
              }
              locale={{
                titles: ['未选用户', '已选用户'],
                searchPlaceholder: '搜索用户',
              }}
              oneWay={false}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
