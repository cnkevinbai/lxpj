import { Button, Space } from 'antd'
import React from 'react'

interface ShortcutButton {
  key: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
}

interface ShortcutButtonsProps {
  buttons: ShortcutButton[]
}

export default function ShortcutButtons({
  buttons,
}: ShortcutButtonsProps) {
  return (
    <div className="shortcut-buttons">
      <Space wrap>
        {buttons.map((button) => (
          <Button
            key={button.key}
            type="primary"
            ghost
            onClick={button.onClick}
            style={{ minWidth: 120 }}
          >
            <Space>
              {button.icon}
              {button.label}
            </Space>
          </Button>
        ))}
      </Space>
    </div>
  )
}
