/**
 * 页面头部组件
 * 
 * @description 统一的页面标题和操作区
 * @author daod-team
 */

import React from 'react';
import { Space, Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backButton?: boolean;
  backPath?: string;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backButton = false,
  backPath,
  extra,
  children,
  className,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`page-header ${className || ''}`} style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          {backButton && (
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
            />
          )}
          <div>
            <Title level={4} style={{ margin: 0 }}>{title}</Title>
            {subtitle && (
              <span style={{ color: '#999', fontSize: 14 }}>{subtitle}</span>
            )}
          </div>
        </Space>
        {extra && <div className="page-header-extra">{extra}</div>}
      </div>
      {children && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
};

export default PageHeader;