import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col } from 'antd'
import { ShoppingCartOutlined, ForkOutlined, GlobalOutlined, TeamOutlined, FileTextOutlined, SwapOutlined } from '@ant-design/icons'

const ERP: React.FC = () => {
  const navigate = useNavigate()

  const modules = [
    { icon: ShoppingCartOutlined, color: '#1890ff', title: '采购管理', path: '/purchase', desc: '采购订单 / 供应商管理 / 入库管理' },
    { icon: TeamOutlined, color: '#722ed1', title: '供应商管理', path: '/suppliers', desc: '供应商档案 / 评估 / 分级管理' },
    { icon: ForkOutlined, color: '#faad14', title: '生产管理', path: '/production', desc: '生产工单 / 生产进度 / 质量管理' },
    { icon: FileTextOutlined, color: '#52c41a', title: '库存盘点', path: '/stock-check', desc: '盘点单 / 盘盈盘亏 / 盘点报告' },
    { icon: SwapOutlined, color: '#13c2c2', title: '库存调拨', path: '/stock-transfer', desc: '调拨申请 / 审批 / 执行' },
    { icon: GlobalOutlined, color: '#eb2f96', title: '外贸管理', path: '/export', desc: '外贸订单 / 报关单据 / 物流跟踪' },
  ]

  return (
    <div>
      <Card title="🏭 ERP 系统总览">
        <Row gutter={[16, 16]}>
          {modules.map((module, index) => (
            <Col span={8} key={index}>
              <Card 
                hoverable 
                onClick={() => navigate(module.path)}
                style={{ textAlign: 'center', cursor: 'pointer', height: '100%' }}
              >
                <module.icon style={{ fontSize: 48, color: module.color, marginBottom: 16 }} />
                <h3>{module.title}</h3>
                <p style={{ color: '#999', fontSize: 14 }}>{module.desc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}

export default ERP
