import React, { useState, useEffect } from 'react'
import { Card, List, Tag, Button, Empty } from 'antd'
import {
  ThunderboltOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import apiClient from '../services/api'
import { useAuth } from '../hooks/useAuth'

/**
 * 智能推荐页面
 */
const SmartRecommendations: React.FC = () => {
  const { user } = useAuth()
  const [leadRecs, setLeadRecs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/recommend/leads', {
        params: { userId: user?.id, limit: 10 },
      })
      setLeadRecs(response.data)
    } catch (error) {
      console.error('加载推荐失败', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'red'
    if (score >= 60) return 'orange'
    return 'green'
  }

  return (
    <div className="p-4">
      <Card title="智能推荐" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            title={<ThunderboltOutlined className="mr-2" />}
            size="small"
            hoverable
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-blue">
                {leadRecs.filter((l: any) => l.score >= 80).length}
              </div>
              <div className="text-sm text-gray-500">高优先级线索</div>
            </div>
          </Card>

          <Card
            title={<ClockCircleOutlined className="mr-2" />}
            size="small"
            hoverable
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {leadRecs.filter((l: any) => l.score >= 60 && l.score < 80).length}
              </div>
              <div className="text-sm text-gray-500">中优先级线索</div>
            </div>
          </Card>

          <Card
            title={<CheckCircleOutlined className="mr-2" />}
            size="small"
            hoverable
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {leadRecs.filter((l: any) => l.score < 60).length}
              </div>
              <div className="text-sm text-gray-500">低优先级线索</div>
            </div>
          </Card>
        </div>
      </Card>

      <Card title="优先跟进线索">
        {leadRecs.length > 0 ? (
          <List
            dataSource={leadRecs}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <Button type="primary" size="small">立即联系</Button>,
                  <Button size="small">稍后处理</Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center gap-2">
                      <span>{item.name}</span>
                      <Tag color={getPriorityColor(item.score)}>
                        优先级：{item.score}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="text-sm text-gray-600">
                      <div>手机：{item.phone}</div>
                      <div>来源：{item.source} | 意向：{item.productInterest}</div>
                      <div>创建时间：{new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无推荐线索" />
        )}
      </Card>
    </div>
  )
}

export default SmartRecommendations
