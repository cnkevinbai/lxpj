/**
 * 用户反馈组件
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState } from 'react'
import { Modal, Form, Input, Select, Rate, message, Button } from 'antd'
import { FeedbackOutlined } from '@ant-design/icons'

const { TextArea } = Input

interface FeedbackModalProps {
  open: boolean
  onClose: () => void
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: any) => {
    setSubmitting(true)
    try {
      // TODO: 发送到后端
      console.log('Feedback:', values)
      message.success('反馈提交成功，感谢您的反馈！')
      form.resetFields()
      onClose()
    } catch (error) {
      message.error('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FeedbackOutlined />
          用户反馈
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
      >
        <Form.Item
          label="反馈类型"
          name="type"
          rules={[{ required: true, message: '请选择反馈类型' }]}
        >
          <Select placeholder="请选择反馈类型">
            <Select.Option value="bug">功能异常</Select.Option>
            <Select.Option value="suggestion">功能建议</Select.Option>
            <Select.Option value="ui">界面问题</Select.Option>
            <Select.Option value="performance">性能问题</Select.Option>
            <Select.Option value="other">其他</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="满意度评分"
          name="rating"
        >
          <Rate />
        </Form.Item>

        <Form.Item
          label="问题描述"
          name="description"
          rules={[{ required: true, message: '请输入问题描述' }]}
        >
          <TextArea
            rows={4}
            placeholder="请详细描述您遇到的问题或建议..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="联系方式（可选）"
          name="contact"
        >
          <Input placeholder="手机号或邮箱，方便我们联系您" />
        </Form.Item>

        <Form.Item
          label="截图（可选）"
          name="screenshot"
        >
          <div style={{
            border: '2px dashed #d9d9d9',
            borderRadius: 8,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <div style={{ color: '#999', marginBottom: 8 }}>
              点击上传或拖拽文件到此处
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>
              支持 PNG、JPG 格式，最大 5MB
            </div>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={onClose}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交反馈
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
