import React, { useState } from 'react'
import { Modal, Form, Select, DatePicker, Button, message, Radio } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import apiClient from '../../services/api'

const { Option } = Select
const { RangePicker } = DatePicker

interface ExportDataProps {
  visible: boolean
  type: string
  onClose: () => void
}

/**
 * 数据导出组件
 */
const ExportData: React.FC<ExportDataProps> = ({
  visible,
  type,
  onClose,
}) => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleExport = async (values: any) => {
    setLoading(true)
    try {
      const [startDate, endDate] = values.dateRange.map((d: any) => d.format('YYYY-MM-DD'))
      
      const response = await apiClient.get(`/export/${type}`, {
        params: {
          startDate,
          endDate,
          format: values.format,
        },
        responseType: 'blob',
      })

      // 创建下载链接
      const blob = new Blob([response.data], {
        type: values.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${type}_${startDate}_${endDate}.${values.format === 'pdf' ? 'pdf' : 'xlsx'}`
      link.click()
      window.URL.revokeObjectURL(url)

      message.success('导出成功')
      onClose()
    } catch (error: any) {
      message.error(error.response?.data?.message || '导出失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="导出数据"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleExport}
        initialValues={{
          format: 'xlsx',
        }}
      >
        <Form.Item
          name="dateRange"
          label="日期范围"
          rules={[{ required: true, message: '请选择日期范围' }]}
        >
          <RangePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="format"
          label="导出格式"
          rules={[{ required: true, message: '请选择导出格式' }]}
        >
          <Radio.Group>
            <Radio value="xlsx">Excel (.xlsx)</Radio>
            <Radio value="pdf">PDF (.pdf)</Radio>
            <Radio value="csv">CSV (.csv)</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <div className="flex gap-2">
            <Button type="primary" htmlType="submit" loading={loading} icon={<DownloadOutlined />}>
              导出
            </Button>
            <Button onClick={onClose}>
              取消
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ExportData
