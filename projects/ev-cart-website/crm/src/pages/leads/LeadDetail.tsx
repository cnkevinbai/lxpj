import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Descriptions, Tag, Button, Space, Timeline, message, Alert } from 'antd'
import { PhoneOutlined, MailOutlined, ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const statusColors: Record<string, string> = {
    new: 'green',
    contacted: 'blue',
    qualified: 'purple',
    unqualified: 'red',
    converted: 'success',
  }

  useEffect(() => {
    const fetchLead = async () => {
      try {
        // Mock data
        const mockData = {
          id: id || '1',
          leadCode: 'L20260313001',
          leadName: '张三',
          company: '某某科技公司',
          position: '采购经理',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          source: '线上咨询',
          status: 'new',
          owner: '销售 A',
          createdAt: '2026-03-13',
          remark: '客户对智能换电柜感兴趣，需要进一步了解产品详情',
        }
        setLead(mockData)
      } catch (error) {
        message.error('加载失败')
      } finally {
        setLoading(false)
      }
    }
    fetchLead()
  }, [id])

  if (loading) return <div>加载中...</div>
  if (!lead) return <Alert message="线索不存在" type="error" />

  return (
    <div>
      <Card
        title="线索详情"
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/leads')}>
              返回列表
            </Button>
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/leads/${id}/edit`)}>
              编辑
            </Button>
          </Space>
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="线索编号">{lead.leadCode}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusColors[lead.status]}>{lead.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="姓名">{lead.leadName}</Descriptions.Item>
          <Descriptions.Item label="公司">{lead.company}</Descriptions.Item>
          <Descriptions.Item label="职位">{lead.position}</Descriptions.Item>
          <Descriptions.Item label="来源">{lead.source}</Descriptions.Item>
          <Descriptions.Item label="手机">
            <Space>
              <PhoneOutlined />
              {lead.phone}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            <Space>
              <MailOutlined />
              {lead.email}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="负责人">{lead.owner}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{lead.createdAt}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{lead.remark}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24 }}>
          <h3>跟进记录</h3>
          <Timeline
            items={[
              {
                color: 'green',
                children: (
                  <div>
                    <div>线索创建</div>
                    <div style={{ color: '#999', fontSize: '12px' }}>2026-03-13 10:00</div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </div>
  )
}

export default LeadDetail
