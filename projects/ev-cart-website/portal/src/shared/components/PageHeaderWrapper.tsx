import React from 'react'
import { Card, Space, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

const { Title } = Typography

interface Props {
  title: string
  subtitle?: string
  onBack?: () => void
  children?: React.ReactNode
  extra?: React.ReactNode
}

const PageHeaderWrapper: React.FC<Props> = ({
  title,
  subtitle,
  onBack,
  children,
  extra,
}) => {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space size="large">
          {onBack && (
            <div onClick={onBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ArrowLeftOutlined />
              <span>返回</span>
            </div>
          )}
          <div>
            <Title level={3} style={{ margin: 0 }}>{title}</Title>
            {subtitle && <div style={{ color: '#666', marginTop: 4 }}>{subtitle}</div>}
          </div>
        </Space>
        {extra && <div style={{ position: 'absolute', right: 0, top: 16 }}>{extra}</div>}
      </div>
      <Card>{children}</Card>
    </div>
  )
}

export default PageHeaderWrapper
