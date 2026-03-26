/**
 * 技术创新区组件 - 简化版
 */

import { Typography, Card } from 'antd'
import { ThunderboltOutlined, GlobalOutlined, BatteryOutlined, SafetyOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const technologies = [
  {
    key: 'battery',
    icon: <BatteryOutlined />,
    title: '远，不止',
    value: '800',
    unit: 'km',
    desc: '超长续航',
    gradient: 'linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)',
  },
  {
    key: 'autonomous',
    icon: <SafetyOutlined />,
    title: '智，无界',
    value: '4',
    prefix: 'L',
    desc: '自动驾驶',
    gradient: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
  },
  {
    key: 'connected',
    icon: <GlobalOutlined />,
    title: '瞬，互联',
    value: '5',
    desc: '智能网联',
    gradient: 'linear-gradient(135deg, #722ed1 0%, #00D4FF 100%)',
  },
  {
    key: 'charging',
    icon: <ThunderboltOutlined />,
    title: '快，极速',
    value: '2',
    unit: 'h',
    desc: '快速充电',
    gradient: 'linear-gradient(135deg, #faad14 0%, #ff4d4f 100%)',
  },
]

const TechnologySection = () => {
  return (
    <section className="technology-section">
      <div className="container">
        <Title level={2} className="section-title">
          技术，无界
        </Title>
        <Paragraph className="section-subtitle">
          创新科技，驱动未来出行
        </Paragraph>

        <div className="tech-grid">
          {technologies.map((tech) => (
            <Card key={tech.key} className="tech-card">
              <div className="tech-icon" style={{ background: tech.gradient }}>
                {tech.icon}
              </div>
              
              <Title level={3} className="tech-title">
                {tech.title}
              </Title>
              
              <div className="tech-statistic">
                {tech.prefix && <span className="tech-prefix">{tech.prefix}</span>}
                <span className="tech-value">{tech.value}</span>
                {tech.unit && <span className="tech-unit">{tech.unit}</span>}
              </div>
              
              <Paragraph className="tech-desc">
                {tech.desc}
              </Paragraph>

              <div className="energy-line" />
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        .technology-section {
          padding: 160px 24px;
          background: linear-gradient(180deg, #050505 0%, #0A0A0A 100%);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 48px !important;
          color: #FFFFFF !important;
          text-align: center;
          margin-bottom: 16px !important;
        }

        .section-subtitle {
          font-size: 20px !important;
          color: #A0A0A0 !important;
          text-align: center;
          margin-bottom: 64px !important;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
        }

        .tech-card {
          background: rgba(18, 18, 18, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
          padding: 40px 32px !important;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .tech-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 102, 255, 0.3) !important;
        }

        .tech-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: #FFFFFF;
        }

        .tech-title {
          color: #FFFFFF !important;
          font-size: 20px !important;
          margin-bottom: 16px !important;
        }

        .tech-statistic {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 16px;
        }

        .tech-prefix {
          font-size: 24px;
          color: #A0A0A0;
        }

        .tech-value {
          font-size: 64px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .tech-unit {
          font-size: 20px;
          color: #A0A0A0;
        }

        .tech-desc {
          color: #A0A0A0 !important;
          font-size: 14px !important;
          margin: 0 !important;
        }

        .energy-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 102, 255, 0.5) 50%,
            transparent 100%
          );
          animation: energy-flow 3s ease-in-out infinite;
        }

        @keyframes energy-flow {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @media (max-width: 768px) {
          .technology-section {
            padding: 80px 24px;
          }

          .section-title {
            font-size: 28px !important;
          }

          .tech-value {
            font-size: 48px !important;
          }
        }
      `}</style>
    </section>
  )
}

export default TechnologySection
