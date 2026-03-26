/**
 * 客户详情页面
 * 显示客户基本信息、跟进记录、关联订单
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tabs, Button, Space, Tag, Timeline, Modal, Form, Input, List, Empty, Typography, Divider, Select, message } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerService, Customer, FollowUp, CreateFollowUpDto } from '@/services/customer.service'
import { orderService, Order } from '@/services/order.service'
import dayjs from 'dayjs'

const { Text, Paragraph } = Typography

// 客户级别映射
const levelMap: Record<string, { color: string; text: string }> = {
  A: { color: 'gold', text: 'A 级' },
  B: { color: 'blue', text: 'B 级' },
  C: { color: 'default', text: 'C 级' },
}

// 客户状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  ACTIVE: { color: 'green', text: '活跃' },
  INACTIVE: { color: 'orange', text: '待跟进' },
  LOST: { color: 'red', text: '流失' },
}

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  
  // 弹窗控制
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)

  // 获取客户详情
  const { data: customer, isLoading: customerLoading } = useQuery<Customer>({
    queryKey: ['customer', id],
    queryFn: () => customerService.getOne(id!),
    enabled: !!id,
  })

  // 获取跟进记录
  const { data: followUps } = useQuery<FollowUp[]>({
    queryKey: ['followUps', id],
    queryFn: () => customerService.getFollowUps(id!),
    enabled: !!id,
  })

  // 获取关联订单
  const { data: orders } = useQuery<{ list: Order[]; total: number }>({
    queryKey: ['customerOrders', id],
    queryFn: () => orderService.getList({ customerId: id, pageSize: 10 }),
    enabled: !!id,
  })

  // 添加跟进记录
  const addFollowUpMutation = useMutation({
    mutationFn: (dto: CreateFollowUpDto) => customerService.addFollowUp(id!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followUps', id] })
      queryClient.invalidateQueries({ queryKey: ['customer', id] })
      message.success('添加成功')
      setFollowUpModalVisible(false)
      form.resetFields()
    },
  })

  // 更新客户
  const updateMutation = useMutation({
    mutationFn: (dto: any) => customerService.update(id!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      message.success('更新成功')
      setEditModalVisible(false)
    },
  })

  // 删除客户
  const deleteMutation = useMutation({
    mutationFn: () => customerService.delete(id!),
    onSuccess: () => {
      message.success('删除成功')
      navigate('/crm/customers')
    },
  })

  // 处理添加跟进
  const handleAddFollowUp = () => {
    form.validateFields().then(values => {
      addFollowUpMutation.mutate(values)
    })
  }

  // 处理更新客户
  const handleUpdate = () => {
    form.validateFields().then(values => {
      updateMutation.mutate(values)
    })
  }

  // 处理删除
  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该客户吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(),
    })
  }

  if (customerLoading) {
    return <Card loading={true} />
  }

  if (!customer) {
    return <Card><Empty description="客户不存在" /></Card>
  }

  return (
    <>
      {/* 客户基本信息 */}
      <Card
        title="客户详情"
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => {
              form.setFieldsValue(customer)
              setEditModalVisible(true)
            }}>
              编辑
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
              删除
            </Button>
          </Space>
        }
      >
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="客户名称" span={2}>
            <Text strong>{customer.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="客户编号">{customer.id.slice(0, 8)}</Descriptions.Item>
          
          <Descriptions.Item label="联系人">{customer.contact}</Descriptions.Item>
          <Descriptions.Item label="联系电话">
            <Text copyable>{customer.phone}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="电子邮箱">
            {customer.email || '-'}
          </Descriptions.Item>
          
          <Descriptions.Item label="客户级别">
            <Tag color={levelMap[customer.level]?.color || 'default'}>
              {levelMap[customer.level]?.text || customer.level}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusMap[customer.status]?.color || 'default'}>
              {statusMap[customer.status]?.text || customer.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="来源">{customer.source || '-'}</Descriptions.Item>
          
          <Descriptions.Item label="所属行业">{customer.industry || '-'}</Descriptions.Item>
          <Descriptions.Item label="所在地区">
            {`${customer.province || ''}${customer.city || ''}` || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="地址">{customer.address || '-'}</Descriptions.Item>
          
          <Descriptions.Item label="创建时间">
            {dayjs(customer.createdAt).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {dayjs(customer.updatedAt).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="备注" span={3}>
            <Paragraph style={{ marginBottom: 0 }}>{customer.remark || '无'}</Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 跟进记录与订单 */}
      <Card style={{ marginTop: 16 }}>
        <Tabs
          items={[
            {
              key: 'followups',
              label: `跟进记录 (${followUps?.length || 0})`,
              children: (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => {
                        form.resetFields()
                        setFollowUpModalVisible(true)
                      }}
                    >
                      添加跟进
                    </Button>
                  </div>
                  
                  {followUps && followUps.length > 0 ? (
                    <Timeline
                      items={followUps.map(followUp => ({
                        color: '#1890ff',
                        children: (
                          <Card size="small" style={{ marginBottom: 12 }}>
                            <Paragraph style={{ marginBottom: 8 }}>{followUp.content}</Paragraph>
                            <div style={{ fontSize: 12, color: '#999' }}>
                              创建时间：{dayjs(followUp.createdAt).format('YYYY-MM-DD HH:mm')}
                              {followUp.nextTime && (
                                <span style={{ marginLeft: 16 }}>
                                  下次跟进：{dayjs(followUp.nextTime).format('YYYY-MM-DD')}
                                </span>
                              )}
                            </div>
                          </Card>
                        ),
                      }))}
                    />
                  ) : (
                    <Empty description="暂无跟进记录" />
                  )}
                </>
              ),
            },
            {
              key: 'orders',
              label: `关联订单 (${orders?.total || 0})`,
              children: orders && orders.list.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={orders.list}
                  renderItem={(order) => (
                    <List.Item
                      actions={[
                        <Button 
                          type="link" 
                          key="view"
                          onClick={() => navigate(`/crm/orders/${order.id}`)}
                        >
                          查看详情
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <Text strong>{order.orderNo}</Text>
                            <Tag color={order.status === 'COMPLETED' ? 'green' : 'blue'}>
                              {order.status}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Space split={<Divider type="vertical" />}>
                            <Text>金额：¥{order.totalAmount.toLocaleString()}</Text>
                            <Text>付款状态：{order.paymentStatus}</Text>
                            <Text>创建时间：{dayjs(order.createdAt).format('YYYY-MM-DD')}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无关联订单" />
              ),
            },
          ]}
        />
      </Card>

      {/* 添加跟进记录弹窗 */}
      <Modal
        title="添加跟进记录"
        open={followUpModalVisible}
        onOk={handleAddFollowUp}
        onCancel={() => {
          setFollowUpModalVisible(false)
          form.resetFields()
        }}
        confirmLoading={addFollowUpMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="content"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入跟进内容" />
          </Form.Item>
          
          <Form.Item name="nextTime" label="下次跟进时间">
            <Input type="datetime-local" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑客户弹窗 */}
      <Modal
        title="编辑客户"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => {
          setEditModalVisible(false)
          form.resetFields()
        }}
        confirmLoading={updateMutation.isPending}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="客户名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contact" label="联系人" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="电子邮箱">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input />
          </Form.Item>
          <Form.Item name="level" label="客户级别">
            <Select>
              <Select.Option value="A">A 级</Select.Option>
              <Select.Option value="B">B 级</Select.Option>
              <Select.Option value="C">C 级</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="ACTIVE">活跃</Select.Option>
              <Select.Option value="INACTIVE">待跟进</Select.Option>
              <Select.Option value="LOST">流失</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="source" label="来源">
            <Select allowClear>
              <Select.Option value="线上">线上</Select.Option>
              <Select.Option value="线下">线下</Select.Option>
              <Select.Option value="展会">展会</Select.Option>
              <Select.Option value="转介绍">转介绍</Select.Option>
              <Select.Option value="广告">广告</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="industry" label="行业">
            <Input />
          </Form.Item>
          <Form.Item name="province" label="省份">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="城市">
            <Input />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
