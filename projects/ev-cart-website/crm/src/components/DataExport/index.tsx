import { useState } from 'react'
import { Button, Modal, Form, Select, Radio, message, Space } from 'antd'
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons'

interface DataExportProps {
  type: 'lead' | 'customer' | 'order' | 'opportunity'
  total?: number
  onExport?: (options: ExportOptions) => Promise<void>
}

interface ExportOptions {
  format: 'excel' | 'csv' | 'pdf'
  fields: string[]
  scope: 'all' | 'selected' | 'filtered'
  ids?: string[]
}

const formatOptions = [
  { value: 'excel', label: 'Excel (.xlsx)', icon: <FileExcelOutlined /> },
  { value: 'csv', label: 'CSV (.csv)', icon: <FileTextOutlined /> },
  { value: 'pdf', label: 'PDF (.pdf)', icon: <FilePdfOutlined /> },
]

const fieldOptions: Record<string, { label: string; value: string }[]> = {
  lead: [
    { label: '客户名称', value: 'companyName' },
    { label: '联系人', value: 'contactName' },
    { label: '联系电话', value: 'phone' },
    { label: '线索来源', value: 'source' },
    { label: '状态', value: 'status' },
    { label: '负责人', value: 'owner' },
    { label: '创建时间', value: 'createdAt' },
  ],
  customer: [
    { label: '客户名称', value: 'companyName' },
    { label: '联系人', value: 'contactName' },
    { label: '联系电话', value: 'phone' },
    { label: '客户等级', value: 'level' },
    { label: '行业', value: 'industry' },
    { label: '地址', value: 'address' },
    { label: '负责人', value: 'owner' },
    { label: '创建时间', value: 'createdAt' },
  ],
  order: [
    { label: '订单号', value: 'orderNo' },
    { label: '客户', value: 'customer' },
    { label: '金额', value: 'amount' },
    { label: '状态', value: 'status' },
    { label: '付款状态', value: 'paymentStatus' },
    { label: '创建时间', value: 'createdAt' },
  ],
  opportunity: [
    { label: '商机名称', value: 'name' },
    { label: '客户', value: 'customer' },
    { label: '预计金额', value: 'estimatedAmount' },
    { label: '阶段', value: 'stage' },
    { label: '成功率', value: 'probability' },
    { label: '负责人', value: 'owner' },
  ],
}

export default function DataExport({ type, total = 0, onExport }: DataExportProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [exporting, setExporting] = useState(false)

  const handleExport = async (values: any) => {
    setExporting(true)
    try {
      await onExport?.({
        format: values.format,
        fields: values.fields,
        scope: values.scope,
      })
      message.success('导出成功，文件正在下载')
      setModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('导出失败')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <Button
        icon={<DownloadOutlined />}
        onClick={() => setModalOpen(true)}
      >
        导出
      </Button>

      <Modal
        title={
          <Space>
            <FileExcelOutlined style={{ color: '#52c41a' }} />
            导出数据
          </Space>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleExport}>
          <Form.Item
            label="导出格式"
            name="format"
            initialValue="excel"
            rules={[{ required: true }]}
          >
            <Radio.Group options={formatOptions} />
          </Form.Item>

          <Form.Item
            label="导出范围"
            name="scope"
            initialValue="filtered"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="all">全部数据 ({total} 条)</Radio>
              <Radio value="filtered">当前筛选结果</Radio>
              <Radio value="selected">手动选择</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="选择字段"
            name="fields"
            initialValue={fieldOptions[type]?.map(f => f.value) || []}
            rules={[{ required: true, message: '请至少选择一个字段' }]}
          >
            <Select mode="multiple" maxTagCount="responsive">
              {fieldOptions[type]?.map(field => (
                <Select.Option key={field.value} value={field.value}>
                  {field.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalOpen(false)}>取消</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={exporting}
                icon={<DownloadOutlined />}
              >
                开始导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
