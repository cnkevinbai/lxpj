/**
 * 客户跟进记录页面
 * 记录客户沟通历史、跟进提醒
 */
import { useState, useEffect } from 'react'
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
  DatePicker,
  message,
  Typography,
  Timeline,
  Avatar,
  Badge,
  Tooltip,
  Empty,
  Spin,
} from 'antd'
import {
  PlusOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  BellOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { customerService } from '@/services/customer.service'

const { Text, Title, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

// 跟进类型
const FOLLOW_TYPE_MAP: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
  phone: { color: 'blue', icon: <PhoneOutlined />, text: '电话沟通' },
  email: { color: 'green', icon: <MailOutlined />, text: '邮件往来' },
  visit: { color: 'purple', icon: <UserOutlined />, text: '上门拜访' },
  meeting: { color: 'orange', icon: <CalendarOutlined />, text: '会议沟通' },
  wechat: { color: 'cyan', icon: <MessageOutlined />, text: '微信沟通' },
  other: { color: 'default', icon: <MessageOutlined />, text: '其他方式' },
}

// 跟进记录接口
interface FollowUpRecord {
  id: string
  customerId: string
  customerName: string
  type: string
  content: string
  result: string
  nextFollowDate?: string
  nextFollowContent?: string
  operatorId: string
  operatorName: string
  createdAt: string
  hasReminder?: boolean
}

// 提醒项接口
interface Reminder {
  id: string
  customerId: string
  customerName: string
  remindDate: string
  content: string
  status: 'pending' | 'completed' | 'overdue'
}

export default function CustomerFollowUp() {
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpRecord | null>(null)
  const [form] = Form.useForm()
  const [customers, setCustomers] = useState<any[]>([])

  // 加载数据
  useEffect(() => {
    fetchFollowUps()
    fetchReminders()
    fetchCustomers()
  }, [])

  const fetchFollowUps = async () => {
    setLoading(true)
    try {
      // 模拟数据
      const mockData: FollowUpRecord[] = [
        {
          id: '1',
          customerId: 'c1',
          customerName: '北京景区管理有限公司',
          type: 'phone',
          content: '沟通项目需求，客户对智能车辆管理系统感兴趣，希望了解详细方案',
          result: '已发送方案文档，约定下周三上门演示',
          nextFollowDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
          nextFollowContent: '上门演示产品',
          operatorId: 'u1',
          operatorName: '张三',
          createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
          hasReminder: true,
        },
        {
          id: '2',
          customerId: 'c2',
          customerName: '上海高尔夫俱乐部',
          type: 'visit',
          content: '现场考察客户场地，讨论系统部署方案',
          result: '已确定部署方案，预计下月签约',
          operatorId: 'u1',
          operatorName: '张三',
          createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          id: '3',
          customerId: 'c3',
          customerName: '深圳智慧园区',
          type: 'meeting',
          content: '项目启动会，明确项目里程碑和交付时间',
          result: '项目正式启动，首期交付时间确定为6月底',
          nextFollowDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
          nextFollowContent: '项目进度汇报',
          operatorId: 'u2',
          operatorName: '李四',
          createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
          hasReminder: true,
        },
      ]
      setFollowUps(mockData)
    } catch (error) {
      console.error('Failed to fetch follow-ups:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReminders = async () => {
    // 模拟今日提醒数据
    const mockReminders: Reminder[] = [
      {
        id: 'r1',
        customerId: 'c1',
        customerName: '北京景区管理有限公司',
        remindDate: dayjs().format('YYYY-MM-DD'),
        content: '上门演示产品',
        status: 'pending',
      },
      {
        id: 'r2',
        customerId: 'c4',
        customerName: '广州游乐园',
        remindDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        content: '合同续约沟通',
        status: 'overdue',
      },
    ]
    setReminders(mockReminders)
  }

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getList({ page: 1, pageSize: 100 })
      setCustomers(data.list || [])
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }

  // 新建跟进记录
  const handleCreate = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      console.log('Submit values:', values)
      message.success('跟进记录已保存')
      setModalVisible(false)
      fetchFollowUps()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 查看跟进详情
  const handleViewDetail = (record: FollowUpRecord) => {
    setSelectedFollowUp(record)
    setDetailVisible(true)
  }

  // 表格列定义
  const columns: ColumnsType<FollowUpRecord> = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 180,
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          {record.hasReminder && (
            <Tooltip title="有待办提醒">
              <BellOutlined style={{ color: '#fa8c16' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '跟进方式',
      dataIndex: 'type',
      width: 120,
      render: (type: string) => {
        const config = FOLLOW_TYPE_MAP[type] || FOLLOW_TYPE_MAP.other
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        )
      },
    },
    {
      title: '跟进内容',
      dataIndex: 'content',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 250 }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '跟进结果',
      dataIndex: 'result',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 200 }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '下次跟进',
      dataIndex: 'nextFollowDate',
      width: 140,
      render: (date: string, record) => (
        date ? (
          <Space direction="vertical" size={0}>
            <Text>{dayjs(date).format('MM-DD')}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.nextFollowContent}</Text>
          </Space>
        ) : '-'
      ),
    },
    {
      title: '跟进人',
      dataIndex: 'operatorName',
      width: 100,
      render: (name: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: '跟进时间',
      dataIndex: 'createdAt',
      width: 160,
      render: (time: string) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{dayjs(time).format('MM-DD HH:mm')}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} />
        </Space>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">客户跟进记录</Title>
          <Text type="secondary">记录客户沟通历史，设置跟进提醒</Text>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建跟进
          </Button>
        </div>
      </div>

      {/* 今日提醒区 */}
      {reminders.length > 0 && (
        <Card className="daoda-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BellOutlined style={{ color: '#fa8c16', fontSize: 18 }} />
            <Text strong>今日待跟进 ({reminders.length})</Text>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {reminders.map(r => (
              <Card
                key={r.id}
                size="small"
                className="daoda-card"
                style={{ width: 280, cursor: 'pointer' }}
                hoverable
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>{r.customerName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{r.content}</Text>
                  </div>
                  <Badge status={r.status === 'overdue' ? 'error' : 'warning'} />
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* 跟进记录列表 */}
      <Card className="daoda-card">
        <Spin spinning={loading}>
          {followUps.length === 0 ? (
            <Empty description="暂无跟进记录" />
          ) : (
            <Table
              columns={columns}
              dataSource={followUps}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          )}
        </Spin>
      </Card>

      {/* 新建跟进弹窗 */}
      <Modal
        title="新建跟进记录"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="customerId" label="客户" rules={[{ required: true, message: '请选择客户' }]}>
            <Select
              showSearch
              placeholder="请选择客户"
              optionFilterProp="children"
            >
              {customers.map(c => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
              <Option value="c1">北京景区管理有限公司</Option>
              <Option value="c2">上海高尔夫俱乐部</Option>
              <Option value="c3">深圳智慧园区</Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="跟进方式" rules={[{ required: true, message: '请选择跟进方式' }]}>
            <Select placeholder="请选择跟进方式">
              <Option value="phone">电话沟通</Option>
              <Option value="email">邮件往来</Option>
              <Option value="visit">上门拜访</Option>
              <Option value="meeting">会议沟通</Option>
              <Option value="wechat">微信沟通</Option>
              <Option value="other">其他方式</Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="跟进内容" rules={[{ required: true, message: '请输入跟进内容' }]}>
            <TextArea rows={3} placeholder="请详细描述沟通内容" />
          </Form.Item>
          <Form.Item name="result" label="跟进结果">
            <TextArea rows={2} placeholder="请输入跟进结果" />
          </Form.Item>
          <Form.Item label="下次跟进计划">
            <Space>
              <Form.Item name="nextFollowDate" noStyle>
                <DatePicker placeholder="选择日期" />
              </Form.Item>
              <Form.Item name="nextFollowContent" noStyle>
                <Input placeholder="跟进内容" style={{ width: 200 }} />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item name="hasReminder" valuePropName="checked">
            <Tag color="orange">
              <BellOutlined /> 设置提醒
            </Tag>
          </Form.Item>
        </Form>
      </Modal>

      {/* 跟进详情弹窗 */}
      <Modal
        title="跟进详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedFollowUp && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">客户名称</Text>
              <br />
              <Text strong style={{ fontSize: 16 }}>{selectedFollowUp.customerName}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">跟进方式</Text>
              <br />
              <Tag color={FOLLOW_TYPE_MAP[selectedFollowUp.type]?.color || 'default'}>
                {FOLLOW_TYPE_MAP[selectedFollowUp.type]?.text || '未知'}
              </Tag>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">跟进内容</Text>
              <br />
              <Text>{selectedFollowUp.content}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">跟进结果</Text>
              <br />
              <Text>{selectedFollowUp.result || '-'}</Text>
            </div>
            {selectedFollowUp.nextFollowDate && (
              <div style={{ marginBottom: 16, padding: 12, background: 'rgba(102, 0, 255, 0.1)', borderRadius: 8 }}>
                <Text type="secondary">下次跟进计划</Text>
                <br />
                <Text strong>{dayjs(selectedFollowUp.nextFollowDate).format('YYYY年MM月DD日')}</Text>
                <br />
                <Text>{selectedFollowUp.nextFollowContent}</Text>
              </div>
            )}
            <div style={{ color: '#64748b', fontSize: 12, marginTop: 16 }}>
              跟进人: {selectedFollowUp.operatorName} | 时间: {dayjs(selectedFollowUp.createdAt).format('YYYY-MM-DD HH:mm')}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}