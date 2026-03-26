/**
 * 视频管理列表页面
 * 支持搜索、筛选、分页、新建、编辑、删除、发布功能
 */
import { useState } from 'react'
import { Table, Card, Button, Input, Select, Space, Tag, Modal, Form, message, Upload } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, RocketOutlined, UploadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { videoService, Video, VideoStatus, CreateVideoDto, UpdateVideoDto } from '@/services/video.service'
import dayjs from 'dayjs'

// 视频状态映射
const statusMap: Record<VideoStatus, { color: string; text: string }> = {
  DRAFT: { color: 'orange', text: '草稿' },
  PUBLISHED: { color: 'green', text: '已发布' },
  ARCHIVED: { color: 'gray', text: '已归档' },
}

// 格式化时长
const formatDuration = (seconds: number | null): string => {
  if (!seconds) return '-'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function VideoList() {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    status: undefined as VideoStatus | undefined,
  })
  
  // 分页
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  })
  
  // 弹窗控制
  const [modalVisible, setModalVisible] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  
  // 文件上传
  const [coverFileList, setCoverFileList] = useState<UploadFile[]>([])
  const [videoFileList, setVideoFileList] = useState<UploadFile[]>([])

  // 获取视频列表
  const { data, isLoading } = useQuery({
    queryKey: ['videos', filters, pagination],
    queryFn: () => videoService.getList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    }),
  })

  // 创建视频
  const createMutation = useMutation({
    mutationFn: (dto: CreateVideoDto) => videoService.create(dto),
    onSuccess: () => {
      message.success('创建成功')
      setModalVisible(false)
      form.resetFields()
      setCoverFileList([])
      setVideoFileList([])
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })

  // 更新视频
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateVideoDto }) => 
      videoService.update(id, dto),
    onSuccess: () => {
      message.success('更新成功')
      setModalVisible(false)
      setEditingVideo(null)
      form.resetFields()
      setCoverFileList([])
      setVideoFileList([])
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })

  // 删除视频
  const deleteMutation = useMutation({
    mutationFn: (id: string) => videoService.delete(id),
    onSuccess: () => {
      message.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })

  // 发布视频
  const publishMutation = useMutation({
    mutationFn: (id: string) => videoService.publish(id),
    onSuccess: () => {
      message.success('发布成功')
      queryClient.invalidateQueries({ queryKey: ['videos'] })
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
      category: '',
      status: undefined,
    })
    setPagination({ page: 1, pageSize: 10 })
  }

  // 处理新建
  const handleCreate = () => {
    setEditingVideo(null)
    form.resetFields()
    setCoverFileList([])
    setVideoFileList([])
    setModalVisible(true)
  }

  // 处理编辑
  const handleEdit = (record: Video) => {
    setEditingVideo(record)
    form.setFieldsValue({
      ...record,
      duration: record.duration ? Math.floor(record.duration / 60) + ':' + (record.duration % 60).toString().padStart(2, '0') : undefined,
    })
    
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
    
    if (record.url) {
      setVideoFileList([{
        uid: '-2',
        name: 'video.mp4',
        status: 'done',
        url: record.url,
      }])
    } else {
      setVideoFileList([])
    }
    
    setModalVisible(true)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该视频吗？此操作不可恢复。',
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
      content: '确定要发布该视频吗？',
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
      
      // 处理封面图
      if (coverFileList.length > 0 && coverFileList[0].originFileObj) {
        const file = coverFileList[0].originFileObj
        submitData.cover = URL.createObjectURL(file)
      } else if (coverFileList.length > 0 && coverFileList[0].url) {
        submitData.cover = coverFileList[0].url
      }
      
      // 处理视频文件/链接
      if (videoFileList.length > 0) {
        if (videoFileList[0].originFileObj) {
          // 实际项目中需要上传到服务器
          submitData.url = URL.createObjectURL(videoFileList[0].originFileObj)
        } else if (videoFileList[0].url) {
          submitData.url = videoFileList[0].url
        }
      }
      
      // 解析时长
      if (values.duration) {
        const parts = values.duration.split(':')
        if (parts.length === 2) {
          submitData.duration = parseInt(parts[0]) * 60 + parseInt(parts[1])
        }
      }
      
      if (editingVideo) {
        updateMutation.mutate({ id: editingVideo.id, dto: submitData })
      } else {
        createMutation.mutate(submitData)
      }
    })
  }

  // 表格列定义
  const columns: ColumnsType<Video> = [
    {
      title: '视频标题',
      dataIndex: 'title',
      width: 250,
      ellipsis: true,
      render: (title, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {record.cover && (
            <img 
              src={record.cover} 
              alt={title}
              style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
            />
          )}
          <span style={{ flex: 1 }}>{title}</span>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      render: (category) => category || '-',
    },
    {
      title: '时长',
      dataIndex: 'duration',
      width: 80,
      render: (duration: number | null) => formatDuration(duration),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: VideoStatus) => (
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
            onClick={() => window.open(`/videos/${record.id}`, '_blank')}
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
        title="视频管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            上传视频
          </Button>
        }
      >
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索视频标题"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={filters.keyword}
              onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              onPressEnter={handleSearch}
            />
            <Select
              placeholder="分类"
              allowClear
              style={{ width: 120 }}
              value={filters.category}
              onChange={value => setFilters(prev => ({ ...prev, category: value }))}
            >
              <Select.Option value="product">产品介绍</Select.Option>
              <Select.Option value="tutorial">使用教程</Select.Option>
              <Select.Option value="event">活动记录</Select.Option>
              <Select.Option value="promo">宣传推广</Select.Option>
              <Select.Option value="other">其他</Select.Option>
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
        title={editingVideo ? '编辑视频' : '上传视频'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          setEditingVideo(null)
          form.resetFields()
          setCoverFileList([])
          setVideoFileList([])
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'DRAFT' }}
        >
          <Form.Item
            name="title"
            label="视频标题"
            rules={[{ required: true, message: '请输入视频标题' }]}
          >
            <Input placeholder="请输入视频标题" />
          </Form.Item>
          
          <Form.Item name="description" label="视频描述">
            <Input.TextArea 
              rows={2} 
              placeholder="请输入视频描述" 
              maxLength={300}
              showCount
            />
          </Form.Item>
          
          <Form.Item
            name="cover"
            label="封面图"
            extra="建议尺寸：1280x720 像素"
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
              {coverFileList.length < 1 && '+ 上传封面'}
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="url"
            label="视频文件/链接"
            rules={[{ required: true, message: '请上传视频文件或输入视频链接' }]}
            extra="支持上传 MP4 格式文件或填写外部视频链接"
          >
            <Upload
              listType="picture"
              fileList={videoFileList}
              maxCount={1}
              accept="video/*"
              beforeUpload={(file) => {
                setVideoFileList([file as any])
                return false
              }}
              onRemove={() => setVideoFileList([])}
            >
              {videoFileList.length < 1 && (
                <Button icon={<UploadOutlined />}>选择视频文件</Button>
              )}
            </Upload>
            <Input
              placeholder="或输入视频链接 (如 YouTube, Bilibili 等)"
              style={{ marginTop: 8 }}
              value={form.getFieldValue('url')}
              onChange={e => form.setFieldValue('url', e.target.value)}
            />
          </Form.Item>
          
          <Form.Item name="duration" label="视频时长">
            <Input placeholder="格式：分：秒 (如 3:25)" maxLength={5} />
          </Form.Item>
          
          <Form.Item name="category" label="视频分类">
            <Select allowClear placeholder="请选择分类">
              <Select.Option value="product">产品介绍</Select.Option>
              <Select.Option value="tutorial">使用教程</Select.Option>
              <Select.Option value="event">活动记录</Select.Option>
              <Select.Option value="promo">宣传推广</Select.Option>
              <Select.Option value="other">其他</Select.Option>
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
