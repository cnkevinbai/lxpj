/**
 * 空状态组件
 * 
 * @description 无数据时的占位显示
 * @author daod-team
 */

import React from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface EmptyStateProps {
  description?: string;
  icon?: React.ReactNode;
  image?: React.ReactNode;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  description = '暂无数据',
  icon,
  image,
  showButton = false,
  buttonText = '添加数据',
  onButtonClick,
}) => {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center' }}>
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span>
            {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
            {description}
          </span>
        }
      >
        {showButton && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;