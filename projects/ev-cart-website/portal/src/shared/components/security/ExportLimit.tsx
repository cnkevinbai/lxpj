import React, { useState, useEffect } from 'react'
import { message, Modal, Progress } from 'antd'
import { WarningOutlined, InfoCircleOutlined } from '@ant-design/icons'

interface ExportLimitProps {
  dataType: 'customer' | 'lead' | 'opportunity' | 'order' | 'dealer'
  onExport: (desensitize?: boolean) => Promise<void>
  disabled?: boolean
}

interface ExportLimitState {
  remainingDaily: number
  remainingSingle: number
  requiresApproval: boolean
  todayCount: number
  dailyLimit: number
}

/**
 * 导出限制组件 - 带有限制检查和脱敏选项
 */
export const ExportLimit: React.FC<ExportLimitProps> = ({
  dataType,
  onExport,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false)
  const [limitState, setLimitState] = useState<ExportLimitState | null>(null)
  const [showDesensitizeModal, setShowDesensitizeModal] = useState(false)

  // 检查导出限制
  const checkExportLimit = async () => {
    try {
      const res = await fetch(`/api/v1/audit-logs/export-limit/check?dataType=${dataType}`)
      if (res.ok) {
        const data = await res.json()
        setLimitState(data)
      }
    } catch (error) {
      console.error('检查导出限制失败:', error)
    }
  }

  useEffect(() => {
    checkExportLimit()
  }, [dataType])

  const handleExport = async (desensitize: boolean) => {
    setLoading(true)
    try {
      await onExport(desensitize)
      message.success('导出成功，文件已下载')
      setShowDesensitizeModal(false)
      // 刷新限制状态
      checkExportLimit()
    } catch (error: any) {
      message.error(error.message || '导出失败')
    } finally {
      setLoading(false)
    }
  }

  const showExportModal = () => {
    if (!limitState) return

    if (limitState.remainingDaily <= 0) {
      Modal.error({
        title: '导出次数已用完',
        content: '今日导出次数已用完，请明日再试或联系管理员提升额度。',
        icon: <WarningOutlined />,
      })
      return
    }

    if (limitState.requiresApproval) {
      Modal.info({
        title: '需要审批',
        content: '该类型数据导出需要管理员审批，提交后请等待审批完成。',
        icon: <InfoCircleOutlined />,
      })
      return
    }

    setShowDesensitizeModal(true)
  }

  if (!limitState) {
    return (
      <button disabled={disabled || loading} onClick={showExportModal}>
        导出数据
      </button>
    )
  }

  return (
    <>
      <button
        disabled={disabled || loading || limitState.remainingDaily <= 0}
        onClick={showExportModal}
        style={{
          opacity: limitState.remainingDaily <= 0 ? 0.5 : 1,
          cursor: limitState.remainingDaily <= 0 ? 'not-allowed' : 'pointer',
        }}
      >
        导出数据
        {limitState.requiresApproval && (
          <span style={{ marginLeft: 4, color: '#faad14' }}>(需审批)</span>
        )}
      </button>

      <Modal
        title="导出选项"
        open={showDesensitizeModal}
        onCancel={() => setShowDesensitizeModal(false)}
        footer={[
          <button key="cancel" onClick={() => setShowDesensitizeModal(false)}>
            取消
          </button>,
          <button
            key="normal"
            onClick={() => handleExport(false)}
            disabled={loading}
          >
            正常导出
          </button>,
          <button
            key="desensitize"
            onClick={() => handleExport(true)}
            disabled={loading}
            style={{ borderColor: '#1890ff', color: '#1890ff' }}
          >
            脱敏导出
          </button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <p>
            <InfoCircleOutlined style={{ marginRight: 8 }} />
            导出限制说明：
          </p>
          <ul style={{ marginLeft: 24, color: '#666' }}>
            <li>今日剩余导出次数：{limitState.remainingDaily} 次</li>
            <li>单次最大导出数量：{limitState.remainingSingle} 条</li>
            {limitState.requiresApproval && (
              <li style={{ color: '#faad14' }}>此数据类型需要管理员审批</li>
            )}
          </ul>
        </div>

        <div style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: 4 }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>导出模式说明：</p>
          <p style={{ margin: '4px 0', fontSize: 13 }}>
            <strong>正常导出：</strong>包含完整信息（联系人、电话、邮箱等）
          </p>
          <p style={{ margin: '4px 0', fontSize: 13 }}>
            <strong style={{ color: '#1890ff' }}>脱敏导出：</strong>敏感信息自动打码
            （电话：138****1234，邮箱：zhang****@example.com）
          </p>
        </div>

        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
            <WarningOutlined style={{ marginRight: 4 }} />
            所有导出操作都将被记录审计日志
          </p>
        </div>
      </Modal>

      {/* 导出进度提示 */}
      {limitState.remainingDaily < limitState.dailyLimit * 0.3 && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#faad14' }}>
          <WarningOutlined style={{ marginRight: 4 }} />
          今日导出次数剩余不足，当前剩余：{limitState.remainingDaily}/{limitState.dailyLimit}
        </div>
      )}
    </>
  )
}
