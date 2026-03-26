/**
 * 解决方案详情页面
 */
import { useParams, Link } from 'react-router-dom'
import { Row, Col, Card, Steps, Tag } from 'antd'
import './SolutionDetail.css'

export default function SolutionDetail() {
  const { id } = useParams()

  const solution = {
    id,
    title: '景区园区解决方案',
    description: '为景区、公园、度假区提供智能出行整体解决方案',
    background: '随着旅游业发展，景区对环保、智能、高效的出行工具有迫切需求...',
    features: [
      { title: '智能调度', desc: '基于大数据的车辆调度系统' },
      { title: '充电管理', desc: '智能充电桩布局和管理' },
      { title: '游客分析', desc: '游客行为数据分析' },
      { title: '多语言支持', desc: '支持多国语言界面' },
    ],
    steps: [
      '需求调研',
      '方案设计',
      '车辆配置',
      '系统部署',
      '培训交付',
    ],
    cases: [
      { name: '峨眉山景区', result: '年接待提升 20%' },
      { name: '九寨沟景区', result: '运营成本降低 15%' },
    ],
  }

  return (
    <div className="solution-detail-page">
      <div className="breadcrumb">
        <Link to="/solutions">智慧方案</Link> / {solution.title}
      </div>

      <div className="solution-header">
        <h1>{solution.title}</h1>
        <p>{solution.description}</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card title="行业背景">
            <p>{solution.background}</p>
          </Card>

          <Card title="解决方案" style={{ marginTop: 24 }}>
            <Row gutter={16}>
              {solution.features.map(f => (
                <Col xs={12} md={6} key={f.title}>
                  <Card className="feature-card">
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Card title="实施流程" style={{ marginTop: 24 }}>
            <Steps current={-1} items={solution.steps.map(s => ({ title: s }))} />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="成功案例">
            {solution.cases.map(c => (
              <div key={c.name} className="case-item">
                <strong>{c.name}</strong>
                <Tag color="green">{c.result}</Tag>
              </div>
            ))}
          </Card>

          <Card title="获取方案" style={{ marginTop: 16 }}>
            <p>联系我们获取完整方案</p>
            <a href="/contact">
              <Tag color="blue">立即咨询</Tag>
            </a>
          </Card>
        </Col>
      </Row>
    </div>
  )
}