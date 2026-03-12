import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Statistic, Progress } from 'antd'
import { ShoppingCartOutlined, FactoryOutlined, GlobalOutlined, BarChartOutlined } from '@ant-design/icons'

const ERP: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Card title="🏭 ERP 系统总览">
        <Row gutter={16}>
          <Col span={8}>
            <Card 
              hoverable 
              onClick={() => navigate('/purchase')}
              style={{ textAlign: 'center', cursor: 'pointer' }}
            >
              <ShoppingCartOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
              <h3>采购管理</h3>
              <p style={{ color: '#999' }}>采购订单 / 供应商管理 / 入库管理</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card 
              hoverable 
              onClick={() => navigate('/production')}
              style={{ textAlign: 'center', cursor: 'pointer' }}
            >
              <FactoryOutlined style={{ fontSize: 48, color: '#722ed1', marginBottom: 16 }} />
              <h3>生产管理</h3>
              <p style={{ color: '#999' }}>生产工单 / 生产进度 / 质量管理</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card 
              hoverable 
              onClick={() => navigate('/export')}
              style={{ textAlign: 'center', cursor: 'pointer' }}
            >
              <GlobalOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
              <h3>外贸管理</h3>
              <p style={{ color: '#999' }}>外贸订单 / 报关单据 / 物流跟踪</p>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default ERP
