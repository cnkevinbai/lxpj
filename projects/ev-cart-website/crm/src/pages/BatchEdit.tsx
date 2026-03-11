import React, { useState } from 'react'
import { Modal, Form, Select, Button, message } from 'antd'
import apiClient from '../services/api'

interface BatchEditProps {
  visible: boolean
  type: string
  ids: string[]
  onClose: () => void
  onSuccess: () => void
}

/**
 * 批量编辑组件
 */
const BatchEdit: React.FC<BatchEditProps> = ({
  visible,
  type,
  ids,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await apiClient.post(`/batch/${type}`, {
        ids,
        updates: values,
      })
      message.success('批量更新成功')
      onSuccess()
      onClose()
    } catch (error: any) {
      message.error(error.response?.data?.message || '批量更新失败')
    } finally {
      setLoading(false)
    }
  }

  const getFields = () => {
    if (type === 'leads') {
      return (
        <>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态">
              <Select.Option value="new">新线索</Select.Option>
              <Select.Option value="contacted">已联系</Select.Option>
              <Select.Option value="qualified">已确认</Select.Option>
              <Select.Option value="converted">已转化</Select.Option>
              <Select.Option value="lost">已流失</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="ownerId" label="负责人">
            <Select placeholder="请选择负责人">
              {/* 从 API 加载业务员列表 */}
            </Select>
          </Form.Item>
        </>
      )
    }

    if (type === 'customers') {
      return (
        <>
          <Form.Item name="level" label="客户等级">
            <Select placeholder="请选择等级">
              <Select.Option value="A">A 级 (高意向)</Select.Option>
              <Select.Option value="B">B 级 (中意向)</Select.Option>
              <Select.Option value="C">C 级 (低意向)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态">
              <Select.Option value="potential">潜在</Select.Option>
              <Select.Option value="active">活跃</Select.Option>
              <Select.Option value="inactive">不活跃</Select.Option>
              <Select.Option value="lost">流失</Select.Option>
            </Select>
          </Form.Item>
        </>
      )
    }

    return null
  }

  return (
    <Modal
      title={`批量编辑 (${ids.length}条)`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {getFields()}
        <Form.Item>
          <div className="flex gap-2">
            <Button type="primary" htmlType="submit" loading={loading} block>
              确认更新
            </Button>
            <Button onClick={onClose}>取消</Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BatchEdit
