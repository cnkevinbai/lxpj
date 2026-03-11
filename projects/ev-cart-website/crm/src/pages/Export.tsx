import React, { useState } from 'react'
import { Card, Button, DatePicker, Select, Space, message, Table } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import apiClient from '../services/api'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const Export: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [dataType, setDataType] = useState('customers')
  const [dateRange, setDateRange] = useState<[any, any] | null>(null)

  const handleExport = async () => {
    setLoading(true)
    try {
      const [startDate, endDate] = dateRange || []
      
      const response = await apiClient.get(`/export/${dataType}`, {
        params: {
          startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : undefined,
        },
        responseType: 'blob',
      })

      // 创建下载链接
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${dataType}_${dayjs().format('YYYYMMDD')}.xlsx`
      link.click()
      window.URL.revokeObjectURL(url)

      message.success('导出成功')
    } catch (error: any) {
      message.error('导出失败：' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">数据导出</h1>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">数据类型</label>
            <Select
              value={dataType}
              onChange={setDataType}
              style={{ width: 200 }}
            >
              <Select.Option value="customers">客户数据</Select.Option>
              <Select.Option value="leads">线索数据</Select.Option>
              <Select.Option value="opportunities">商机数据</Select.Option>
              <Select.Option value="orders">订单数据</Select.Option>
              <Select.Option value="dealers">经销商数据</Select.Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">日期范围</label>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [any, any] | null)}
            />
          </div>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={loading}
          >
            导出 Excel
          </Button>
        </div>
      </Card>

      <Card title="导出说明">
        <div className="space-y-2 text-sm text-gray-600">
          <p>✅ 支持导出客户、线索、商机、订单、经销商数据</p>
          <p>✅ 可选择日期范围筛选数据</p>
          <p>✅ 导出格式为 Excel (.xlsx)</p>
          <p>✅ 单次最多导出 10000 条数据</p>
          <p>⚠️ 大数据量导出可能需要较长时间，请耐心等待</p>
        </div>
      </Card>
    </div>
  )
}

export default Export
