import React from 'react'
import { Card, Button, Space, Descriptions, Tag, Timeline, Steps } from 'antd'
import { ArrowLeftOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import PortalLayout from '../../components/PortalLayout'

const TicketDetail: React.FC = () => {
  // TODO: 从 API 加载工单详情
  const ticket = {
    id: '1',
    ticketCode: 'TKT-20260313-001',
    issueType: 'product',
    description: '产品收到后发现无法充电，充电器指示灯不亮',
    status: 'processing',
    createdAt: '2026-03-13 10:30:00',
    contactPhone: '138****8888',
    assignedTo: '张工程师',
    assignedPhone: '139****9999',
  }

  return (
    <PortalLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => window.history.back()}
          style={{ marginBottom: 24 }}
        >
          返回工单列表
        </Button>

        {/* 工单状态 */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 24, marginBottom: 8 }}>工单编号：{ticket.ticketCode}</h2>
              <p style={{ color: '#999' }}>创建时间：{ticket.createdAt}</p>
            </div>
            <div>
              <Tag color={
                ticket.status === 'completed' ? 'success' :
                ticket.status === 'processing' ? 'processing' :
                ticket.status === 'pending' ? 'warning' : 'default'
              } style={{ fontSize: 14 }}>
                {ticket.status === 'completed' ? '已完成' :
                 ticket.status === 'processing' ? '处理中' :
                 ticket.status === 'pending' ? '待处理' : ticket.status}
              </Tag>
            </div>
          </div>
        </Card>

        {/* 处理进度 */}
        <Card title="处理进度" style={{ marginBottom: 24 }}>
          <Steps
            current={
              ticket.status === 'pending' ? 0 :
              ticket.status === 'processing' ? 1 :
              ticket.status === 'completed' ? 2 : -1
            }
            items={[
              { title: '工单提交', description: ticket.createdAt },
              { title: '处理中', description: '工程师已接单' },
              { title: '已完成', description: '等待完成' },
            ]}
          />
        </Card>

        {/* 工单信息 */}
        <Card title="工单信息" style={{ marginBottom: 24 }}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="问题类型">
              {ticket.issueType === 'product' ? '产品质量问题' :
               ticket.issueType === 'delivery' ? '物流配送问题' :
               ticket.issueType === 'service' ? '售后服务问题' : '其他问题'}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">{ticket.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="问题描述" span={2}>{ticket.description}</Descriptions.Item>
            <Descriptions.Item label="处理工程师">{ticket.assignedTo}</Descriptions.Item>
            <Descriptions.Item label="工程师电话">{ticket.assignedPhone}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 处理记录 */}
        <Card title="处理记录">
          <Timeline
            items={[
              {
                color: 'green',
                children: (
                  <div>
                    <div>工程师已接单</div>
                    <div style={{ color: '#999', fontSize: 12 }}>2026-03-13 11:00:00</div>
                  </div>
                ),
              },
              {
                color: 'blue',
                children: (
                  <div>
                    <div>已联系客户，预约上门服务</div>
                    <div style={{ color: '#999', fontSize: 12 }}>2026-03-13 11:30:00</div>
                  </div>
                ),
              },
              {
                color: 'gray',
                children: '工单已创建',
              },
            ]}
          />
        </Card>

        {/* 操作按钮 */}
        <Card style={{ marginTop: 24 }}>
          <Space size="large">
            <Button type="primary" size="large" icon={<CustomerServiceOutlined />}>
              联系工程师
            </Button>
            {ticket.status === 'completed' && (
              <Button size="large">评价服务</Button>
            )}
            {ticket.status === 'pending' && (
              <Button danger size="large">撤销工单</Button>
            )}
          </Space>
        </Card>
      </motion.div>
    </PortalLayout>
  )
}

export default TicketDetail
