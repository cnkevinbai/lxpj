import React, { useState, useEffect } from 'react'
import { Modal, Table, Tag } from 'antd'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'

/**
 * 快捷键帮助弹窗
 */
const ShortcutsHelp: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const shortcuts = useKeyboardShortcuts()

  useEffect(() => {
    const showHelp = () => setVisible(true)
    const closeModal = () => setVisible(false)

    window.addEventListener('show-shortcuts-help', showHelp)
    window.addEventListener('close-modal', closeModal)

    return () => {
      window.removeEventListener('show-shortcuts-help', showHelp)
      window.removeEventListener('close-modal', closeModal)
    }
  }, [])

  const columns = [
    {
      title: '快捷键',
      dataIndex: 'shortcut',
      key: 'shortcut',
      render: (shortcut: string) => (
        <div className="flex gap-1">
          {shortcut.split('+').map((key, index) => (
            <Tag key={index} color="blue" className="font-mono">
              {key.toUpperCase()}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '功能',
      dataIndex: 'description',
      key: 'description',
    },
  ]

  const dataSource = shortcuts.map(s => ({
    key: s.key,
    shortcut: `${s.ctrl ? 'Ctrl+' : ''}${s.shift ? 'Shift+' : ''}${s.alt ? 'Alt+' : ''}${s.key}`,
    description: s.description,
  }))

  return (
    <Modal
      title="键盘快捷键"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      width={600}
    >
      <p className="text-gray-600 mb-4">
        使用快捷键可以快速导航和操作，提高工作效率
      </p>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
      />
      <div className="mt-4 text-sm text-gray-500">
        <p>提示：按 <Tag color="blue" className="font-mono">Shift + ?</Tag> 随时查看此帮助</p>
      </div>
    </Modal>
  )
}

export default ShortcutsHelp
