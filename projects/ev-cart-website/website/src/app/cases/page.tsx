import React from 'react'
import { Card, Row, Col, Button, Space, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'

const Cases: React.FC = () => {
  const cases = [
    {
      id: '1',
      title: '某大型企业 CRM 系统实施案例',
      industry: '制造业',
      description: '为某大型制造企业实施 CRM 系统，实现客户管理、订单管理、经销商管理的数字化转型，提升运营效率 30%。',
      customer: '某知名制造企业',
      result: '运营效率提升 30%，客户满意度提升 25%',
      image: '/cases/manufacturing.jpg',
    },
    {
      id: '2',
      title: '物流公司 ERP 系统建设项目',
      industry: '物流业',
      description: '为某物流公司建设 ERP 系统，实现采购、库存、配送的全流程管理，降低运营成本 20%。',
      customer: '某知名物流企业',
      result: '运营成本降低 20%，配送效率提升 35%',
      image: '/cases/logistics.jpg',
    },
    {
      id: '3',
      title: '景区电动车管理系统',
      industry: '旅游业',
      description: '为某 5A 级景区提供电动车管理系统，实现车辆调度、游客服务、环保监测的智能化管理。',
      customer: '某 5A 级景区',
      result: '游客满意度提升 40%，运营成本降低 15%',
      image: '/cases/scenic.jpg',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 导航栏 */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        padding: '20px 50px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ margin: 0, fontSize: 20, color: '#fff', fontWeight: 700 }}>四川道达智能</h1>
        <Space size="large">
          <a href="/" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>首页</a>
          <a href="/products" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>产品</a>
          <a href="/solutions" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>解决方案</a>
          <a href="/news" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>新闻</a>
          <a href="/cases" style={{ color: '#1890ff', fontSize: 14, textDecoration: 'none' }}>案例</a>
          <a href="/about" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>关于</a>
          <a href="/contact" style={{ color: '#fff', fontSize: 14, textDecoration: 'none' }}>联系</a>
          <Button type="primary" size="small" onClick={() => window.location.href = '/login'}>登录系统</Button>
        </Space>
      </div>

      {/* Hero 区域 */}
      <div style={{ 
        height: '60vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        marginTop: 64
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ fontSize: 64, fontWeight: 700, marginBottom: 24 }}>成功案例</h1>
          <p style={{ fontSize: 24, opacity: 0.8 }}>
            服务超过 1000+ 企业客户
          </p>
        </motion.div>
      </div>

      {/* 案例列表 */}
      <div style={{ padding: '80px 50px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {cases.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card 
                hoverable
                style={{ 
                  marginBottom: 40, 
                  overflow: 'hidden'
                }}
              >
                <Row gutter={48}>
                  <Col span={12}>
                    <div style={{ padding: '40px 0' }}>
                      <div style={{ marginBottom: 16 }}>
                        <span style={{ 
                          padding: '6px 16px', 
                          background: '#1890ff', 
                          color: '#fff', 
                          borderRadius: 20,
                          fontSize: 14
                        }}>
                          {item.industry}
                        </span>
                      </div>
                      <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
                        {item.title}
                      </h2>
                      <p style={{ fontSize: 16, color: '#666', marginBottom: 24, lineHeight: 1.8 }}>
                        {item.description}
                      </p>
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                          <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginRight: 12 }} />
                          <div>
                            <div style={{ fontSize: 14, color: '#999' }}>客户</div>
                            <div style={{ fontSize: 16, fontWeight: 600 }}>{item.customer}</div>
                          </div>
                        </div>
                        <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: 8 }}>
                          <div style={{ fontSize: 14, color: '#999', marginBottom: 8 }}>实施效果</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: '#52c41a' }}>{item.result}</div>
                        </div>
                      </div>
                      <Button type="primary" size="large">
                        查看详情
                      </Button>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ 
                      height: '100%', 
                      minHeight: 400,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8
                    }}>
                      <UserOutlined style={{ fontSize: 120, color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 统计数据 */}
      <div style={{ padding: '80px 50px', background: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Row gutter={32}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#1890ff', marginBottom: 8 }}>1000+</div>
                <div style={{ fontSize: 16, color: '#999' }}>服务客户</div>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#52c41a', marginBottom: 8 }}>98%</div>
                <div style={{ fontSize: 16, color: '#999' }}>客户满意度</div>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#faad14', marginBottom: 8 }}>500+</div>
                <div style={{ fontSize: 16, color: '#999' }}>成功案例</div>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#722ed1', marginBottom: 8 }}>10+</div>
                <div style={{ fontSize: 16, color: '#999' }}>行业经验</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 页脚 */}
      <div style={{ padding: '80px 50px', background: '#000', color: '#fff' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 60, marginBottom: 60 }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>产品</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>CRM 系统</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>ERP 系统</p>
              <p style={{ fontSize: 14, color: '#999' }}>财务管理</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>公司</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>关于我们</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>联系方式</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>支持</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>技术支持</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>文档中心</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: '#fff' }}>联系</h4>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>info@ddzn.com</p>
              <p style={{ fontSize: 14, color: '#999', marginBottom: 12 }}>400-888-8888</p>
              <p style={{ fontSize: 14, color: '#999' }}>四川省眉山市</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: 40, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#666' }}>
              © 2026 四川道达智能车辆制造有限公司。All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cases
