import React, { useState, useEffect } from 'react'
import { Card, List, Button, Modal, Form, Input, Select, DatePicker, message, Timeline } from 'antd'
import { PlusOutlined, PhoneOutlined, EnvironmentOutlined, WechatOutlined, MailOutlined } from '@ant-design/icons'
import apiClient from '../../services/api'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

/**
 * 跟进记录页面
 */
const FollowUpLog: React.FC = () => {
  const [followUps, setFollowUps] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 从 URL 或 localStorage 获取目标信息
  const targetType = 'customer' // 或 'lead'
  const targetId = 'xxx' // 从 URL 参数获取

  useEffect(() => {
    loadFollowUps()
  }, [targetType, targetId])

  const loadFollowUps = async () => {
    try {
      const response = await apiClient.get(`/follow-up/target/${targetType}/${targetId}`)
      setFollowUps(response.data.data)
    } catch (error) {
      console.error('加载跟进记录失败', error)
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await apiClient.post('/follow-up', {
        ...values,
        targetType,
        targetId,
        userId: 'current-user-id', // 从登录信息获取
      })
      message.success('跟进记录创建成功')
      setModalVisible(false)
      form.resetFields()
      loadFollowUps()
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建失败')
    } finally {
      setLoading(false)
    }
  }

  const getFollowTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return <PhoneOutlined />
      case 'visit': return <EnvironmentOutlined />
      case 'wechat': return <WechatOutlined />
      case 'email': return <MailOutlined />
      default: return <PlusOutlined />
    }
  }

  const getFollowTypeColor = (type: string) => {
    switch (type) {
      case 'phone': return 'blue'
      case 'visit': return 'green'
      case 'wechat': return 'green'
      case 'email': return 'orange'
      default: return 'gray'
    }
  }

  return (
    <div className="p-4">
      <Card
        title="跟进记录"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            添加跟进
          </Button>
        }
      >
        <Timeline>
          {followUps.map((log: any) => (
            <Timeline.Item
              key={log.id}
              color={getFollowTypeColor(log.followType)}
              dot={getFollowTypeIcon(log.followType)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{log.content}</p>
                  <p className="text-sm text-gray-500">
                    跟进人：{log.user?.username} | 
                    {log.nextFollowupDate && (
                      <span> 下次跟进：{dayjs(log.nextFollowupDate).format('YYYY-MM-DD')}</span>
                    )}
                  </p>
                  {log.nextFollowupPlan && (
                    <p className="text-sm text-gray-400 mt-1">
                      计划：{log.nextFollowupPlan}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {dayjs(log.createdAt).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>

        {followUps.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            暂无跟进记录
          </div>
        )}
      </Card>

      {/* 添加跟进记录弹窗 */}
      <Modal
        title="添加跟进记录"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="followType"
            label="跟进方式"
            rules={[{ required: true, message: '请选择跟进方式' }]}
          >
            <Select placeholder="请选择跟进方式">
              <Option value="phone">电话跟进</Option>
              <Option value="visit">上门拜访</Option>
              <Option value="wechat">微信沟通</Option>
              <Option value="email">邮件沟通</Option>
              <Option value="other">其他方式</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <TextArea rows={4} placeholder="请输入跟进内容" />
          </Form.Item>

          <Form.Item
            name="nextFollowupDate"
            label="下次跟进日期"
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="nextFollowupPlan"
            label="下次跟进计划"
          >
            <TextArea rows={2} placeholder="请输入下次跟进计划" />
          </Form.Item>

          <Form.Item>
            <div className="flex gap-2">
              <Button type="primary" htmlType="submit" loading={loading} block>
                提交
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FollowUpLog
