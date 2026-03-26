import React, { useState } from 'react'
import { Card, Input, Button, Descriptions, Progress, Alert, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { queryCredit, syncCustomerCredit } from './service'

const CreditQuery: React.FC = () => {
  const [customerId, setCustomerId] = useState('')
  const [credit, setCredit] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!customerId) return
    setLoading(true)
    try {
      const result = await queryCredit(customerId)
      setCredit(result)
    } catch (error) {
      console.error('查询信用失败', error)
    } finally {
      setLoading(false)
    }
  }

  const creditPercent = credit ? (credit.used_credit / credit.credit_limit) * 100 : 0

  return (
    <div className="p-4">
      <Card title="客户信用查询">
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="客户 ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            style={{ width: 300 }}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
            查询
          </Button>
        </div>

        {credit && (
          <>
            {credit.available_credit < credit.credit_limit * 0.2 && (
              <Alert
                message="信用额度预警"
                description="客户可用信用额度不足 20%，请注意风险"
                type="warning"
                showIcon
                className="mb-4"
              />
            )}

            <Descriptions title="信用信息" column={2} bordered>
              <Descriptions.Item label="客户 ID">{credit.customer_id}</Descriptions.Item>
              <Descriptions.Item label="信用额度">¥{credit.credit_limit.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="已用额度">¥{credit.used_credit.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="可用额度">
                <span className="text-green-600 font-bold">¥{credit.available_credit.toLocaleString()}</span>
              </Descriptions.Item>
              <Descriptions.Item label="应收账款">¥{credit.receivables.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="应付账款">¥{credit.payables.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="额度使用率" span={2}>
                <Progress 
                  percent={creditPercent} 
                  strokeColor={creditPercent > 80 ? '#ff4d4f' : '#52c41a'} 
                />
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>
    </div>
  )
}

export default CreditQuery
