/**
 * 用户管理页面
 * 支持搜索、筛选、分页、新建、编辑、删除、状态切换、密码重置功能
 */
import { useState } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Dropdown, Typography, Avatar, Upload, Switch } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, MoreOutlined, KeyOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService, User, UserRole, UserStatus, CreateUserDto, UpdateUserDto } from '@/services/user.service'
import dayjs from 'dayjs'

const { Text } = Typography

// 角色映射
const roleMap: Record<UserRole, { color: string; text: string }> = {
  ADMIN: { color: 'red', text: '管理员' },
  MANAGER: { color: 'purple', text: '经理' },
  SALES: { color: 'blue', text: '销售' },
  TECHNICIAN: { color: 'cyan', text: '技术' },
  USER: { color: 'default', text: '普通用户' },
}



export default function UserManagement() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [resetPasswordForm] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    role: undefined as UserRole | undefined,
    status: undefined as UserStatus | undefined,
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([])

  // 获取用户列表
  const { data, isLoading } = useQuery({
    queryKey: ['users', filters, pagination],
    queryFn: () => userService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 创建用户
  const createMutation = useMutation({
    mutationFn: (dto: CreateUserDto) => userService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      setAvatarFileList([])
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  // 更新用户
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) => 
      userService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingUser(null)
      form.resetFields()
      setAvatarFileList([])
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  // 删除用户
  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  // 批量更新状态
  const batchStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: UserStatus }) => 
      userService.batchUpdateStatus(ids, status),
    onSuccess: () => {
      message.success('状态更新成功')
      setSelectedRowKeys([])
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  // 重置密码
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => 
      userService.resetPassword(id, password),
    onSuccess: () => {
      message.success('密码重置成功')
      setPasswordModalVisible(false)
      resetPasswordForm.resetFields()
      queryClient.invalidateQueries({ queryKey: ['users'] })
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
      role: undefined,
      status: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingUser(null)
    form.resetFields()
    setAvatarFileList([])
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: User) => {
    setEditingUser(record)
    form.setFieldsValue(record)
    if (record.avatar) {
      setAvatarFileList([
        {
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: record.avatar,
        },
      ])
    }
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const dto: any = { ...values }
      
      // 处理头像
      if (avatarFileList.length > 0 && avatarFileList[0].originFileObj) {
        // 这里应该调用上传接口，暂时使用 mock
        dto.avatar = '/avatars/' + avatarFileList[0].originFileObj.name
      } else if (avatarFileList.length === 0) {
        dto.avatar = null
      }
      
      if (editingUser) {
        updateMutation.mutate({ id: editingUser.id, dto })
      } else {
        createMutation.mutate(dto)
      }
    })
  }

  // 处理密码重置
  const handleResetPassword = () => {
    resetPasswordForm.validateFields().then(values => {
      if (editingUser) {
        resetPasswordMutation.mutate({ id: editingUser.id, password: values.newPassword })
      }
    })
  }

  // 处理状态切换
  const handleStatusChange = (record: User, checked: boolean) => {
    updateMutation.mutate({
      id: record.id,
      dto: { status: checked ? 'ACTIVE' : 'INACTIVE' },
    })
  }

  // 处理批量启用
  const handleBatchEnable = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择用户')
      return
    }
    batchStatusMutation.mutate({ ids: selectedRowKeys as string[], status: 'ACTIVE' })
  }

  // 处理批量禁用
  const handleBatchDisable = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择用户')
      return
    }
    batchStatusMutation.mutate({ ids: selectedRowKeys as string[], status: 'INACTIVE' })
  }

  // 头像上传组件
  const avatarUploadProps = {
    onRemove: () => setAvatarFileList([]),
    beforeUpload: (file: UploadFile) => {
      const isImage = file.type?.startsWith('image/')
      if (!isImage) {
        message.error('只能上传图片文件')
        return false
      }
      const isLt2M = (file.size || 0) / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB')
        return false
      }
      setAvatarFileList([file])
      return false
    },
    fileList: avatarFileList,
  }

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: '用户',
      dataIndex: 'name',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={!record.avatar ? <UserOutlined /> : undefined} />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    { 
      title: '手机号', 
      dataIndex: 'phone', 
      width: 130,
      render: (phone: string | null) => phone || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      render: (role: UserRole) => (
        <Tag color={roleMap[role].color}>{roleMap[role].text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: UserStatus, record: User) => (
        <Switch
          checked={status === 'ACTIVE'}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          onChange={(checked) => handleStatusChange(record, checked)}
          loading={updateMutation.isPending}
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginAt',
      width: 160,
      render: (lastLoginAt: string | null) => 
        lastLoginAt ? dayjs(lastLoginAt).format('YYYY-MM-DD HH:mm') : '从未登录',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (createdAt: string) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 220,
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
            icon={<KeyOutlined />}
            onClick={() => {
              setEditingUser(record)
              resetPasswordForm.resetFields()
              setPasswordModalVisible(true)
            }}
          >
            重置密码
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

  return (
    <>
      <Card
        title="用户管理"
        extra={
          <Space>
            <Button 
              disabled={selectedRowKeys.length === 0}
              onClick={handleBatchEnable}
            >
              批量启用
            </Button>
            <Button 
              disabled={selectedRowKeys.length === 0}
              onClick={handleBatchDisable}
            >
              批量禁用
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建用户
            </Button>
          </Space>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索用户名/姓名/邮箱/手机"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="角色"
              allowClear
              style={{ width: 120 }}
              value={filters.role}
              onChange={value => setFilters(prev => ({ ...prev, role: value }))}
            >
              <Select.Option value="ADMIN">管理员</Select.Option>
              <Select.Option value="MANAGER">经理</Select.Option>
              <Select.Option value="SALES">销售</Select.Option>
              <Select.Option value="TECHNICIAN">技术</Select.Option>
              <Select.Option value="USER">普通用户</Select.Option>
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Select.Option value="ACTIVE">启用</Select.Option>
              <Select.Option value="INACTIVE">禁用</Select.Option>
              <Select.Option value="BANNED">封禁</Select.Option>
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
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>

      {/* 新建/编辑用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingUser(null)
          form.resetFields()
          setAvatarFileList([])
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ role: 'USER' }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: !editingUser, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input 
              placeholder="请输入邮箱" 
              disabled={!!editingUser}
            />
          </Form.Item>
          
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度至少 6 位' },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          
          <Form.Item name="phone" label="手机号">
            <Input placeholder="请输入手机号" />
          </Form.Item>
          
          <Form.Item name="role" label="角色">
            <Select>
              <Select.Option value="ADMIN">管理员</Select.Option>
              <Select.Option value="MANAGER">经理</Select.Option>
              <Select.Option value="SALES">销售</Select.Option>
              <Select.Option value="TECHNICIAN">技术</Select.Option>
              <Select.Option value="USER">普通用户</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="头像" name="avatar">
            <Upload {...avatarUploadProps} maxCount={1} accept="image/*">
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={passwordModalVisible}
        onOk={handleResetPassword}
        onCancel={() => {
          setPasswordModalVisible(false)
          resetPasswordForm.resetFields()
        }}
        confirmLoading={resetPasswordMutation.isPending}
      >
        <Form form={resetPasswordForm} layout="vertical">
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少 6 位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
