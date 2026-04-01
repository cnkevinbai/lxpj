/**
 * Banner管理页面
 * 首页轮播图管理
 */
import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Switch,
  message,
  Typography,
  Image,
  DatePicker,
  InputNumber,
  Popconfirm,
  Row,
  Col,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

// Banner 接口
interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl: string
  position: string
  sort: number
  status: 'active' | 'inactive'
  startTime?: string
  endTime?: string
  createdAt: string
}

// 位置选项
const POSITIONS = [
  { value: 'home', label: '首页顶部' },
  { value: 'product', label: '产品页' },
  { value: 'solution', label: '解决方案页' },
  { value: 'about', label: '关于我们页' },
]

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([
    { id: '1', title: '智能车辆管理系统', imageUrl: 'https://via.placeholder.com/1200x400/6600ff/ffffff?text=Smart+Vehicle', linkUrl: '/products/vehicle', position: 'home', sort: 1, status: 'active', createdAt: '2026-03-01' },
    { id: '2', title: '智慧景区解决方案', imageUrl: 'https://via.placeholder.com/1200x400/13c2c2/ffffff?text=Smart+Park', linkUrl: '/solutions/park', position: 'home', sort: 2, status: 'active', createdAt: '2026-03-05' },
    { id: '3', title: '高尔夫球场管理', imageUrl: 'https://via.placeholder.com/1200x400/52c41a/ffffff?text=Golf+Management', linkUrl: '/solutions/golf', position: 'home', sort: 3, status: 'active', createdAt: '2026-03-10' },
    { id: '4', title: '新品发布', imageUrl: 'https://via.placeholder.com/1200x400/fa8c16/ffffff?text=New+Product', linkUrl: '/news/new-product', position: 'product', sort: 1, status: 'inactive', createdAt: '2026-03-15' },
  ])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [form] = Form.useForm()

  // 新建/编辑
  const handleCreate = () => {
    setEditingBanner(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Banner) => {
    setEditingBanner(record)
    form.setFieldsValue({
      ...record,
      dateRange: record.startTime && record.endTime ? [dayjs(record.startTime), dayjs(record.endTime)] : null,
    })
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingBanner) {
        setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...values } : b))
        message.success('更新成功')
      } else {
        const newBanner: Banner = {
          id: Date.now().toString(),
          ...values,
          status: 'active',
          createdAt: dayjs().format('YYYY-MM-DD'),
        }
        setBanners(prev => [...prev, newBanner])
        message.success('创建成功')
      }
      setModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 删除
  const handleDelete = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id))
    message.success('删除成功')
  }

  // 排序
  const handleMoveUp = (id: string) => {
    const index = banners.findIndex(b => b.id === id)
    if (index > 0) {
      const newBanners = [...banners]
      ;[newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]]
      newBanners.forEach((b, i) => b.sort = i + 1)
      setBanners(newBanners)
    }
  }

  const handleMoveDown = (id: string) => {
    const index = banners.findIndex(b => b.id === id)
    if (index < banners.length - 1) {
      const newBanners = [...banners]
      ;[newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]]
      newBanners.forEach((b, i) => b.sort = i + 1)
      setBanners(newBanners)
    }
  }

  // 切换状态
  const handleToggleStatus = (id: string) => {
    setBanners(prev => prev.map(b =>
      b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
    ))
  }

  // 表格列定义
  const columns: ColumnsType<Banner> = [
    {
      title: '预览',
      dataIndex: 'imageUrl',
      width: 200,
      render: (url: string) => (
        <Image
          src={url}
          width={180}
          height={60}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 150,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '位置',
      dataIndex: 'position',
      width: 100,
      render: (pos: string) => {
        const config = POSITIONS.find(p => p.value === pos)
        return <Tag>{config?.label || pos}</Tag>
      },
    },
    {
      title: '链接',
      dataIndex: 'linkUrl',
      ellipsis: true,
      render: (url: string) => <Text code>{url}</Text>,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      render: (sort: number, record) => (
        <Space>
          <Text>{sort}</Text>
          <Button type="text" size="small" icon={<ArrowUpOutlined />} onClick={() => handleMoveUp(record.id)} />
          <Button type="text" size="small" icon={<ArrowDownOutlined />} onClick={() => handleMoveDown(record.id)} />
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string, record) => (
        <Switch
          checked={status === 'active'}
          onChange={() => handleToggleStatus(record.id)}
          size="small"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">Banner管理</Title>
          <Text type="secondary">管理网站轮播图</Text>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建Banner
          </Button>
        </div>
      </div>

      {/* Banner 列表 */}
      <Card className="daoda-card">
        <Table
          columns={columns}
          dataSource={banners}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingBanner ? '编辑Banner' : '新建Banner'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="Banner标题" />
          </Form.Item>
          <Form.Item name="imageUrl" label="图片URL" rules={[{ required: true, message: '请输入图片URL' }]}>
            <Input placeholder="图片地址" />
          </Form.Item>
          <Form.Item name="linkUrl" label="跳转链接">
            <Input placeholder="点击后跳转的链接" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="position" label="显示位置" initialValue="home">
                <Select>
                  {POSITIONS.map(p => (
                    <Option key={p.value} value={p.value}>{p.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sort" label="排序" initialValue={1}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="dateRange" label="生效时间">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}