/**
 * 搜索筛选栏组件
 * 统一的搜索筛选 UI
 */
import { Form, Input, Select, DatePicker, Button, Space, Collapse } from 'antd'
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'

const { RangePicker } = DatePicker
const { Panel } = Collapse

interface FilterField {
  name: string
  label: string
  type: 'input' | 'select' | 'date' | 'dateRange'
  placeholder?: string
  options?: { label: string; value: string }[]
  span?: number
}

interface SearchBarProps {
  fields: FilterField[]
  onSearch: (values: Record<string, any>) => void
  onReset?: () => void
  loading?: boolean
  defaultCollapsed?: boolean
}

export default function SearchBar({ fields, onSearch, onReset, loading, defaultCollapsed = true }: SearchBarProps) {
  const [form] = Form.useForm()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  // 显示的字段数量
  const visibleFields = collapsed ? fields.slice(0, 3) : fields
  const hasMore = fields.length > 3

  useEffect(() => {
    // 初始化时设置默认值
    const defaults: Record<string, any> = {}
    fields.forEach(f => {
      if (f.type === 'select' && f.options?.length) {
        // selects 默认不选
      }
    })
    form.setFieldsValue(defaults)
  }, [fields, form])

  const handleSearch = () => {
    const values = form.getFieldsValue()
    // 过滤空值
    const filtered = Object.entries(values).reduce((acc, [key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        acc[key] = val
      }
      return acc
    }, {} as Record<string, any>)
    onSearch(filtered)
  }

  const handleReset = () => {
    form.resetFields()
    onReset?.()
  }

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'input':
        return (
          <Form.Item name={field.name} label={field.label}>
            <Input placeholder={field.placeholder || `请输入${field.label}`} allowClear />
          </Form.Item>
        )
      case 'select':
        return (
          <Form.Item name={field.name} label={field.label}>
            <Select placeholder={field.placeholder || `请选择${field.label}`} allowClear options={field.options} />
          </Form.Item>
        )
      case 'date':
        return (
          <Form.Item name={field.name} label={field.label}>
            <DatePicker style={{ width: '100%' }} placeholder={field.placeholder || `请选择${field.label}`} />
          </Form.Item>
        )
      case 'dateRange':
        return (
          <Form.Item name={field.name} label={field.label}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        )
      default:
        return null
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline">
        <Space wrap>
          {visibleFields.map(field => (
            <div key={field.name} style={{ minWidth: field.span ? field.span * 100 : 200 }}>
              {renderField(field)}
            </div>
          ))}
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              {hasMore && (
                <Button type="link" onClick={() => setCollapsed(!collapsed)}>
                  {collapsed ? <>展开 <DownOutlined /></> : <>收起 <UpOutlined /></>}
                </Button>
              )}
            </Space>
          </Form.Item>
        </Space>
      </Form>
    </div>
  )
}