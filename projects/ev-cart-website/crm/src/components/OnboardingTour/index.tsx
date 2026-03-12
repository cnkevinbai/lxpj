import { useState } from 'react'
import { Button, Tour, Typography } from 'antd'
import { HomeOutlined, UserOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

interface TourStep {
  title: string
  description: string
  target?: () => HTMLElement | null
  cover?: string
}

interface OnboardingTourProps {
  open?: boolean
  onClose?: () => void
  onComplete?: () => void
}

const defaultSteps: TourStep[] = [
  {
    title: '欢迎使用道达智能 CRM',
    description: '这是一个功能强大的客户关系管理系统，帮助您高效管理销售流程。',
  },
  {
    title: '仪表盘',
    description: '在这里您可以查看核心业务指标、待办事项和最新动态。',
  },
  {
    title: '线索管理',
    description: '录入和跟进销售线索，将潜在客户转化为商机。',
  },
  {
    title: '客户管理',
    description: '管理客户信息、联系记录和交易历史。',
  },
  {
    title: '快速开始',
    description: '点击"快速创建"按钮可以快速新建线索、客户或跟进记录。',
  },
]

export default function OnboardingTour({
  open = false,
  onClose,
  onComplete,
}: OnboardingTourProps) {
  const [current, setCurrent] = useState(0)

  const handleComplete = () => {
    onComplete?.()
    localStorage.setItem('onboarding_completed', 'true')
  }

  const handleSkip = () => {
    onClose?.()
    localStorage.setItem('onboarding_skipped', 'true')
  }

  return (
    <Tour
      open={open}
      current={current}
      steps={defaultSteps.map(step => ({
        title: step.title,
        description: (
          <div>
            <Paragraph style={{ marginBottom: 8 }}>{step.description}</Paragraph>
          </div>
        ),
      }))}
      onClose={onClose}
      onChange={(next) => setCurrent(next)}
      onFinish={handleComplete}
      indicatorsRender={(currentStep, total) => (
        <span style={{ color: '#999', fontSize: 12 }}>
          {currentStep + 1} / {total}
        </span>
      )}
    />
  )
}
