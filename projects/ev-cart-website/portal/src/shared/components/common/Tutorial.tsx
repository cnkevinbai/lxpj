import React, { useState, useEffect } from 'react'
import { Modal, Button, Steps } from 'antd'
import { InboxOutlined, TeamOutlined, ShoppingCartOutlined, RobotOutlined } from '@ant-design/icons'

const { Step } = Steps

interface TutorialProps {
  onComplete: () => void
}

/**
 * 新手引导教程
 */
const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (hasSeenTutorial) {
      setVisible(false)
      onComplete()
    }
  }, [onComplete])

  const steps = [
    {
      title: '欢迎使用道达 CRM',
      description: '这是一套专为电动观光车行业设计的 CRM 系统，帮助您高效管理客户和销售流程。',
      icon: <InboxOutlined className="text-4xl text-brand-blue" />,
    },
    {
      title: '线索管理',
      description: '快速录入销售线索，智能查重避免重复，优先级评分帮您聚焦高价值客户。',
      icon: <InboxOutlined className="text-4xl text-brand-blue" />,
    },
    {
      title: '客户管理',
      description: '完整记录客户信息，支持内外贸客户分类，跟进记录一目了然。',
      icon: <TeamOutlined className="text-4xl text-brand-blue" />,
    },
    {
      title: '订单管理',
      description: '从报价到交付全流程跟踪，支持外贸订单和多币种结算。',
      icon: <ShoppingCartOutlined className="text-4xl text-brand-blue" />,
    },
    {
      title: '智能助手',
      description: 'AI 客服 7x24 小时在线，智能推荐帮您发现高价值线索，数据可视化让决策更简单。',
      icon: <RobotOutlined className="text-4xl text-brand-blue" />,
    },
  ]

  const handleFinish = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setVisible(false)
    onComplete()
  }

  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      width={600}
      centered
    >
      <div className="text-center py-8">
        <div className="mb-8">
          {steps[current].icon}
        </div>
        
        <Steps current={current} className="mb-8">
          {steps.map((step, index) => (
            <Step key={index} title={step.title} />
          ))}
        </Steps>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">{steps[current].title}</h3>
          <p className="text-gray-600">{steps[current].description}</p>
        </div>

        <div className="flex justify-center gap-4">
          {current > 0 && (
            <Button onClick={() => setCurrent(current - 1)}>
              上一步
            </Button>
          )}
          {current < steps.length - 1 ? (
            <Button type="primary" onClick={() => setCurrent(current + 1)}>
              下一步
            </Button>
          ) : (
            <Button type="primary" onClick={handleFinish}>
              开始使用
            </Button>
          )}
          <Button onClick={handleFinish}>
            跳过教程
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default Tutorial
