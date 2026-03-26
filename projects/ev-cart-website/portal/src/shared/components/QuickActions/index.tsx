import { useState } from 'react'
import { Button, Dropdown, Modal, Form, Input, Select, message, Space } from 'antd'
import {
  PlusOutlined,
  UserAddOutlined,
  TeamOutlined,
  FileAddOutlined,
  DollarOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { TextArea } = Input

interface QuickActionsProps {
  onActionSuccess?: (action: string) => void
}

export default function QuickActions({ onActionSuccess }: QuickActionsProps) {
  const [modalOpen, setModalOpen] = useState<string | null>(null)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const handleAction = (action: string) => {
    setModalOpen(action)
  }

  const handleSubmit = async (values: any) => {
    setSubmitting(true)
    try {
      // TODO: 调用实际 API
      // if (modalOpen === 'lead') await leadApi.create(values)
      // if (modalOpen === 'customer') await customerApi.create(values)
      // if (modalOpen === 'followup') await followupApi.create(values)
      
      message.success('创建成功')
      setModalOpen(null)
      form.resetFields()
      onActionSuccess?.(modalOpen!)
    } catch (error) {
      message.error('创建失败')
    } finally {
      setSubmitting(false)
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'lead',
      icon: <UserAddOutlined />,
      label: '新建线索',
      onClick: () => handleAction('lead'),
    },
    {
      key: 'customer',
      icon: <TeamOutlined />,
      label: '新建客户',
      onClick: () => handleAction('customer'),
    },
    {
      key: 'opportunity',
      icon: <FileAddOutlined />,
      label: '新建商机',
      onClick: () => handleAction('opportunity'),
    },
    {
      key: 'order',
      icon: <DollarOutlined />,
      label: '新建订单',
      onClick: () => handleAction('order'),
    },
    {
      key: 'followup',
      icon: <PhoneOutlined />,
      label: '跟进记录',
      onClick: () => handleAction('followup'),
    },
  ]

  const renderModal = () => {
    if (!modalOpen) return null

    const titles: Record<string, string> = {
      lead: '新建线索',
      customer: '新建客户',
      opportunity: '新建商机',
      order: '新建订单',
      followup: '跟进记录',
    }

    return (
      <Modal
        title={titles[modalOpen]}
        open={!!modalOpen}
        onCancel={() => setModalOpen(null)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {modalOpen === 'lead' && (
            <>
              <Form.Item label="客户名称" name="companyName" rules={[{ required: true }]}>
                <Input placeholder="请输入客户名称" />
              </Form.Item>
              <Form.Item label="联系人" name="contactName">
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
              <Form.Item label="联系电话" name="phone">
                <Input placeholder="请输入联系电话" />
              </Form.Item>
              <Form.Item label="线索来源" name="source">
                <Select>
                  <Select.Option value="website">官网</Select.Option>
                  <Select.Option value="phone">电话咨询</Select.Option>
                  <Select.Option value="exhibition">展会</Select.Option>
                  <Select.Option value="referral">客户推荐</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {modalOpen === 'customer' && (
            <>
              <Form.Item label="客户名称" name="companyName" rules={[{ required: true }]}>
                <Input placeholder="请输入客户名称" />
              </Form.Item>
              <Form.Item label="联系人" name="contactName">
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
              <Form.Item label="联系电话" name="phone">
                <Input placeholder="请输入联系电话" />
              </Form.Item>
              <Form.Item label="客户等级" name="level">
                <Select>
                  <Select.Option value="A">A 类 - 重点客户</Select.Option>
                  <Select.Option value="B">B 类 - 普通客户</Select.Option>
                  <Select.Option value="C">C 类 - 潜在客户</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {modalOpen === 'followup' && (
            <>
              <Form.Item label="客户" name="customerId" rules={[{ required: true }]}>
                <Select placeholder="选择客户">
                  <Select.Option value="1">成都某某科技</Select.Option>
                  <Select.Option value="2">重庆某某制造</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="跟进方式" name="method">
                <Select>
                  <Select.Option value="phone">电话</Select.Option>
                  <Select.Option value="wechat">微信</Select.Option>
                  <Select.Option value="visit">拜访</Select.Option>
                  <Select.Option value="email">邮件</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="跟进内容" name="content" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="请输入跟进内容" />
              </Form.Item>
              <Form.Item label="下次联系时间" name="nextContactAt">
                <Input type="datetime-local" />
              </Form.Item>
            </>
          )}

          {(modalOpen === 'opportunity' || modalOpen === 'order') && (
            <div style={{ textAlign: 'center', padding: 32, color: '#999' }}>
              功能开发中...
            </div>
          )}

          <Form.Item style={{ marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalOpen(null)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  return (
    <>
      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
        <Button type="primary" icon={<PlusOutlined />}>
          快速创建
        </Button>
      </Dropdown>
      {renderModal()}
    </>
  )
}
