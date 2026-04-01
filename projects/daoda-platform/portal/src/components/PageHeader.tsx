/**
 * 页面头部组件
 * 统一的页面标题和操作区
 */
import { Typography, Space, Breadcrumb } from 'antd'
import type { BreadcrumbProps } from 'antd'

const { Title, Text } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbProps['items']
  actions?: React.ReactNode
  backIcon?: React.ReactNode
  onBack?: () => void
}

export default function PageHeader({ title, subtitle, breadcrumb, actions }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        {breadcrumb && <Breadcrumb items={breadcrumb} style={{ marginBottom: 8 }} />}
        <Title level={4} className="page-header-title" style={{ margin: 0 }}>
          {title}
        </Title>
        {subtitle && (
          <Text type="secondary" className="page-header-subtitle" style={{ marginLeft: 12 }}>
            {subtitle}
          </Text>
        )}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  )
}