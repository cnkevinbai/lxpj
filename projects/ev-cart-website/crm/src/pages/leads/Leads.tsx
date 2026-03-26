import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Space, Tag, Input, Modal, Form, message, Select, DatePicker, Popconfirm } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ExportOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Search } = Input
const { Option } = Select

interface Lead {
  id: string
  leadCode: string
  leadName: string
  company: string
  position: string
  phone: string
  email: string
  source: string
  status: string
  owner: string
  createdAt: string
}

const Leads: React.FC = () => {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    new: 'green',
    contacted: 'blue',
    qualified: 'purple',
    unqualified: 'red',
    converted: 'success',
  }

  const statusLabels: Record<string, string> = {
    new: '新线索',
    contacted: '已联系',
    qualified: '合格线索',
    unqualified: '不合格',
    converted: '已转化',
  }

  const sourceOptions = [
    { label: '线上咨询', value: 'online' },
    { label: '电话咨询', value: 'phone' },
    { label: '展会', value: 'exhibition' },
    { label: '客户推荐', value: 'referral' },
    { label: '社交媒体', value: 'social' },
    { label: '其他', value: 'other' },
  ]

  const fetchLeads = async () => {
    setLoading(true)
    try {
      // TODO: 调用 API
      const mockData: Lead[] = [
        {
          id: '1',
          leadCode: 'L20260313001',
          leadName: '张三',
          company: '某某科技公司',
          position: '采购经理',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          source: '线上咨询',
          status: 'new',
          owner: '销售 A',
          createdAt: '2026-03-13',
        },
        {
          id: '2',
          leadCode: 'L20260313002',
          leadName: '李四',
          company: '某某贸易公司',
          position: '总经理',
          phone: '13900139000',
          email: 'lisi@example.com',
          source: '电话咨询',
          status: 'contacted',
          owner: '销售 B',
          createdAt: '2026-03-12',
        },
      ]
      setLeads(mockData)
    } catch (error) {
      message.error('加载线索失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleCreate = async (values: any) => {
    try {
      // TODO: 调用 API
      message.success('创建线索成功')
      setCreateVisible(false)
      form.resetFields()
      fetchLeads()
    } catch (error) {
      message.error('创建失败')
    }
  }

  const handleConvert = (id: string) => {
    navigate(`/customers/create?leadId=${id}`)
  }

  const columns = [
    {
      title: '线索编号',
      dataIndex: 'leadCode',
      width: 140,
    },
    {
      title: '姓名',
      dataIndex: 'leadName',
      width: 100,
    },
    {
      title: '公司',
      dataIndex: 'company',
      width: 180,
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 100,
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 150,
      render: (_: any, record: Lead) => (
        <div>
          <div>{record.phone}</div>
          <div style={{ color: '#999', fontSize: '12px' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status] || status}</Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      width: 90,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Lead) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/leads/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/leads/${record.id}/edit`)}
          >
            编辑
          </Button>
          {record.status !== 'converted' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleConvert(record.id)}
            >
              转化
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateVisible(true)}
            >
              新建线索
            </Button>
            <Button icon={<ExportOutlined />}>导入线索</Button>
            <Button icon={<ExportOutlined />}>导出线索</Button>
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索线索姓名、公司、电话"
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={leads}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title="新建线索"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="leadName" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="company" label="公司" rules={[{ required: true, message: '请输入公司名称' }]}>
              <Input placeholder="请输入公司名称" />
            </Form.Item>
            <Form.Item name="position" label="职位">
              <Input placeholder="请输入职位" />
            </Form.Item>
            <Form.Item name="phone" label="手机" rules={[{ required: true, message: '请输入手机号码' }]}>
              <Input placeholder="请输入手机号码" />
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入有效的邮箱' }]}>
              <Input placeholder="请输入邮箱地址" />
            </Form.Item>
            <Form.Item name="source" label="来源" rules={[{ required: true, message: '请选择来源' }]}>
              <Select placeholder="请选择来源">
                {sourceOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Leads
