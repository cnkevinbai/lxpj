/**
 * 新闻管理列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、发布功能
 */
import { useState } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Upload } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, RocketOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { newsService, News, NewsStatus, CreateNewsDto, UpdateNewsDto } from '@/services/news.service'
import dayjs from 'dayjs'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// 新闻状态映射
const statusMap: Record<NewsStatus, { color: string; text: string }> = {
  DRAFT: { color: 'orange', text: '草稿' },
  PUBLISHED: { color: 'green', text: '已发布' },
  ARCHIVED: { color: 'gray', text: '已归档' },
}

// 富文本编辑器模块配置
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
}

export default function NewsList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as NewsStatus | undefined,
    category: '',
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  
  // 图片上传
  const [coverFileList, setCoverFileList] = useState<UploadFile[]>([])

  // 获取新闻列表
  const { data, isLoading } = useQuery({
    queryKey: ['news', filters, pagination],
    queryFn: () => newsService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 创建新闻
  const createMutation = useMutation({
    mutationFn: (dto: CreateNewsDto) => newsService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      setCoverFileList([])
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })

  // 更新新闻
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateNewsDto }) => 
      newsService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingNews(null)
      form.resetFields()
      setCoverFileList([])
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })

  // 删除新闻
  const deleteMutation = useMutation({
    mutationFn: (id: string) => newsService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })

  // 发布新闻
  const publishMutation = useMutation({
    mutationFn: (id: string) => newsService.publish(id),
    onSuccess: () => {
      message.success('发布成功')
      queryClient.invalidateQueries({ queryKey: ['news'] })
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
      category: '',
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingNews(null)
    form.resetFields()
    setCoverFileList([])
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: News) => {
    setEditingNews(record)
    form.setFieldsValue(record)
    if (record.cover) {
      setCoverFileList([{
        uid: '-1',
        name: 'cover.jpg',
        status: 'done',
        url: record.cover,
      }])
    } else {
      setCoverFileList([])
    }
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该新闻吗？此操作不可恢复。',
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
      content: '确定要发布该新闻吗？',
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
        content: values.content || '',
      }
      
      // 处理封面图
      if (coverFileList.length > 0 && coverFileList[0].originFileObj) {
        // 实际项目中需要上传到服务器
        const file = coverFileList[0].originFileObj
        submitData.cover = URL.createObjectURL(file)
      } else if (coverFileList.length > 0 && coverFileList[0].url) {
        submitData.cover = coverFileList[0].url
      }
      
      if (editingNews) {
        updateMutation.mutate({ id: editingNews.id, dto: submitData })
      } else {
        createMutation.mutate(submitData)
      }
    })
  }

  // 表格列定义
  const columns: ColumnsType<News> = [
    {
      title: '标题',
      dataIndex: 'title',
      width: 300,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      render: (category) => category || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: NewsStatus) => (
        <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      width: 80,
      sorter: (a, b) => a.viewCount - b.viewCount,
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      width: 160,
      render: (publishedAt: string | null) => 
        publishedAt ? dayjs(publishedAt).format('YYYY-MM-DD HH:mm') : '-',
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
            onClick={() => window.open(`/news/${record.id}`, '_blank')}
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
        title="新闻管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            发布新闻
          </Button>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索新闻标题"
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
              <Select.Option value="DRAFT">草稿</Select.Option>
              <Select.Option value="PUBLISHED">已发布</Select.Option>
              <Select.Option value="ARCHIVED">已归档</Select.Option>
            </Select>
            <Input
              placeholder="分类"
              style={{ width: 120 }}
              value={filters.category}
              onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
              onPressEnter={handleSearch}
            />
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

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingNews ? '编辑新闻' : '发布新闻'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingNews(null)
          form.resetFields()
          setCoverFileList([])
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'DRAFT' }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入新闻标题' }]}
          >
            <Input placeholder="请输入新闻标题" />
          </Form.Item>
          
          <Form.Item
            name="summary"
            label="摘要"
            rules={[{ required: true, message: '请输入新闻摘要' }]}
          >
            <Input.TextArea 
              rows={2} 
              placeholder="请输入新闻摘要（200 字以内）" 
              maxLength={200}
              showCount
            />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入新闻内容' }]}
          >
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
              <ReactQuill 
                theme="snow"
                modules={quillModules}
                placeholder="请输入新闻内容..."
                style={{ height: 300 }}
                value={form.getFieldValue('content')}
                onChange={(value) => form.setFieldValue('content', value)}
              />
            </div>
          </Form.Item>
          
          <Form.Item
            name="cover"
            label="封面图"
          >
            <Upload
              listType="picture-card"
              fileList={coverFileList}
              maxCount={1}
              beforeUpload={(file) => {
                setCoverFileList([file as any])
                return false
              }}
              onRemove={() => setCoverFileList([])}
            >
              {coverFileList.length < 1 && '+ 上传封面图'}
            </Upload>
          </Form.Item>
          
          <Form.Item name="category" label="分类">
            <Select allowClear placeholder="请选择分类">
              <Select.Option value="company">公司新闻</Select.Option>
              <Select.Option value="product">产品动态</Select.Option>
              <Select.Option value="industry">行业资讯</Select.Option>
              <Select.Option value="event">活动展会</Select.Option>
              <Select.Option value="media">媒体报道</Select.Option>
            </Select>
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
