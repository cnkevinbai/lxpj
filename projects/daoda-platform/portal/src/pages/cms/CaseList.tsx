/**
 * 案例管理列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、发布功能
 */
import { useState } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Upload } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, RocketOutlined, PictureOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { caseService, Case, CaseStatus, CreateCaseDto, UpdateCaseDto } from '@/services/case.service'
import dayjs from 'dayjs'

// 案例状态映射
const statusMap: Record<CaseStatus, { color: string; text: string }> = {
  DRAFT: { color: 'orange', text: '草稿' },
  PUBLISHED: { color: 'green', text: '已发布' },
  ARCHIVED: { color: 'gray', text: '已归档' },
}

export default function CaseList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    customer: '',
    industry: '',
    status: undefined as CaseStatus | undefined,
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCase, setEditingCase] = useState<Case | null>(null)
  
  // 图片上传
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([])

  // 获取案例列表
  const { data, isLoading } = useQuery({
    queryKey: ['cases', filters, pagination],
    queryFn: () => caseService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 创建案例
  const createMutation = useMutation({
    mutationFn: (dto: CreateCaseDto) => caseService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      setImageFileList([])
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })

  // 更新案例
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCaseDto }) => 
      caseService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingCase(null)
      form.resetFields()
      setImageFileList([])
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })

  // 删除案例
  const deleteMutation = useMutation({
    mutationFn: (id: string) => caseService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })

  // 发布案例
  const publishMutation = useMutation({
    mutationFn: (id: string) => caseService.publish(id),
    onSuccess: () => {
      message.success('发布成功')
      queryClient.invalidateQueries({ queryKey: ['cases'] })
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
      customer: '',
      industry: '',
      status: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingCase(null)
    form.resetFields()
    setImageFileList([])
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Case) => {
    setEditingCase(record)
    form.setFieldsValue(record)
    
    // 处理图片集
    if (record.images) {
      try {
        const images = JSON.parse(record.images) as string[]
        setImageFileList(images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: 'done',
          url,
        })))
      } catch {
        setImageFileList([])
      }
    } else {
      setImageFileList([])
    }
    
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该案例吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 处理发布
  const handlePublish = (id: string) => {
    Modal.confirm({
      title: '确认发布',
      content: '确定要发布该案例吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => publishMutation.mutate(id),
    })
  }

  // 处理提交
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const submitData: any = {
        ...values,
      }
      
      // 处理图片集
      if (imageFileList.length > 0) {
        const imageUrls = imageFileList
          .map(file => {
            if (file.originFileObj) {
              return URL.createObjectURL(file.originFileObj)
            }
            return file.url || ''
          })
          .filter(Boolean)
        submitData.images = JSON.stringify(imageUrls)
      }
      
      if (editingCase) {
        updateMutation.mutate({ id: editingCase.id, dto: submitData })
      } else {
        createMutation.mutate(submitData)
      }
    })
  }

  // 表格列定义
  const columns: ColumnsType<Case> = [
    {
      title: '案例名称',
      dataIndex: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '客户名称',
      dataIndex: 'customer',
      width: 150,
      ellipsis: true,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      width: 100,
      render: (industry) => industry || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: CaseStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '图片数',
      width: 80,
      render: (_, record) => {
        if (!record.images) return 0
        try {
          const images = JSON.parse(record.images) as string[]
          return images.length
        } catch {
          return 0
        }
      },
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
            icon={<EyeOutlined />}
            onClick={() => window.open(`/cases/${record.id}`, '_blank')}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.status === 'DRAFT' && (
            <Button 
              type="link" 
              size="small"
              icon={<RocketOutlined />}
              onClick={() => handlePublish(record.id)}
            >
              发布
            </Button>
          )}
          <Button 
            type="link" 
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title="案例管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            添加案例
          </Button>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索案例名称/客户"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Input
              placeholder="客户名称"
              style={{ width: 150 }}
              value={filters.customer}
              onChange={e => setFilters(prev => ({ ...prev, customer: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="行业"
              allowClear
              style={{ width: 120 }}
              value={filters.industry}
              onChange={value => setFilters(prev => ({ ...prev, industry: value }))}
            >
              <Select.Option value="制造">制造</Select.Option>
              <Select.Option value="能源">能源</Select.Option>
              <Select.Option value="交通">交通</Select.Option>
              <Select.Option value="文旅">文旅</Select.Option>
              <Select.Option value="教育">教育</Select.Option>
              <Select.Option value="医疗">医疗</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Select.Option value="DRAFT">草稿</Select.Option>
              <Select.Option value="PUBLISHED">已发布</Select.Option>
              <Select.Option value="ARCHIVED">已归档</Select.Option>
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
          scroll={{ x: 1100 }}
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

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingCase ? '编辑案例' : '添加案例'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingCase(null)
          form.resetFields()
          setImageFileList([])
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'DRAFT' }}
        >
          <Form.Item
            name="title"
            label="案例名称"
            rules={[{ required: true, message: '请输入案例名称' }]}
          >
            <Input placeholder="请输入案例名称" />
          </Form.Item>
          
          <Form.Item
            name="customer"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>
          
          <Form.Item name="industry" label="所属行业">
            <Select allowClear placeholder="请选择行业">
              <Select.Option value="制造">制造</Select.Option>
              <Select.Option value="能源">能源</Select.Option>
              <Select.Option value="交通">交通</Select.Option>
              <Select.Option value="文旅">文旅</Select.Option>
              <Select.Option value="教育">教育</Select.Option>
              <Select.Option value="医疗">医疗</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入项目描述" 
              maxLength={500}
              showCount
            />
          </Form.Item>
          
          <Form.Item name="solution" label="解决方案">
            <Input.TextArea 
              rows={3} 
              placeholder="请输入解决方案" 
              maxLength={1000}
              showCount
            />
          </Form.Item>
          
          <Form.Item name="result" label="效果成果">
            <Input.TextArea 
              rows={3} 
              placeholder="请输入效果成果" 
              maxLength={500}
              showCount
            />
          </Form.Item>
          
          <Form.Item
            name="images"
            label="案例图片"
            extra="支持上传多张图片，将作为案例展示图"
          >
            <Upload
              listType="picture-card"
              fileList={imageFileList}
              multiple
              maxCount={10}
              beforeUpload={(file) => {
                setImageFileList(prev => [...prev, file as any])
                return false
              }}
              onRemove={(file) => {
                setImageFileList(prev => prev.filter(f => f.uid !== file.uid))
              }}
            >
              {imageFileList.length < 10 && (
                <div>
                  <PictureOutlined />
                  <div style={{ marginTop: 8 }}>上传案例图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="DRAFT">草稿</Select.Option>
              <Select.Option value="PUBLISHED">已发布</Select.Option>
              <Select.Option value="ARCHIVED">已归档</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
