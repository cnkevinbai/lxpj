import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Typography, Spin, message, Timeline } from 'antd'
import { DownloadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import apiClient from '../services/api'
import dayjs from 'dayjs'

const { Title, Paragraph } = Typography

/**
 * 数据隐私页面
 * GDPR/个人信息保护法合规功能
 */
const DataPrivacy: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)

  useEffect(() => {
    loadProcessingLogs()
  }, [])

  const loadProcessingLogs = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/compliance/my-data')
      setLogs(response.data)
    } catch (error) {
      console.error('加载数据处理日志失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const response = await apiClient.get('/compliance/export-my-data', {
        responseType: 'blob',
      })
      
      const blob = new Blob([response.data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `my_data_${dayjs().format('YYYYMMDD')}.json`
      link.click()
      window.URL.revokeObjectURL(url)
      
      message.success('数据导出成功')
    } catch (error: any) {
      message.error(error.response?.data?.message || '导出失败')
    } finally {
      setExportLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await apiClient.post('/compliance/delete-my-data')
      message.success('数据删除申请已提交，我们将在 30 天内处理')
      setDeleteVisible(false)
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败')
    }
  }

  const columns = [
    {
      title: '操作类型',
      dataIndex: 'actionType',
      key: 'actionType',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          view: '查看',
          create: '创建',
          update: '更新',
          delete: '删除',
        }
        return typeMap[type] || type
      },
    },
    {
      title: '资源类型',
      dataIndex: 'resourceType',
      key: 'resourceType',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          lead: '线索',
          customer: '客户',
          order: '订单',
          user: '用户',
        }
        return typeMap[type] || type
      },
    },
    {
      title: '资源 ID',
      dataIndex: 'resourceId',
      key: 'resourceId',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'success' ? 'green' : 'red'
        return <span style={{ color }}>{status === 'success' ? '成功' : '失败'}</span>
      },
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card title="数据隐私" className="mb-4">
        <Paragraph>
          根据 GDPR 和个人信息保护法，您享有以下权利：访问权、更正权、删除权、可携带权、反对权。
        </Paragraph>
      </Card>

      <Card title="我的数据" className="mb-4">
        <div className="flex gap-4 mb-6">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={exportLoading}
          >
            导出我的数据
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteVisible(true)}
          >
            删除我的数据
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Spin /></div>
        ) : (
          <Table
            columns={columns}
            dataSource={logs}
            rowKey="id"
            pagination={{ pageSize: 20 }}
          />
        )}
      </Card>

      <Card title="隐私设置">
        <Timeline>
          <Timeline.Item dot="🔒">
            <Title level={5}>数据加密</Title>
            <Paragraph>
              您的所有数据都经过加密存储和传输，确保数据安全。
            </Paragraph>
          </Timeline.Item>
          <Timeline.Item dot="👁️">
            <Title level={5}>访问控制</Title>
            <Paragraph>
              只有授权人员才能访问您的数据，我们实施严格的权限管理。
            </Paragraph>
          </Timeline.Item>
          <Timeline.Item dot="📝">
            <Title level={5}>操作日志</Title>
            <Paragraph>
              所有数据处理操作都会被记录，您可以随时查看。
            </Paragraph>
          </Timeline.Item>
          <Timeline.Item dot="⏰">
            <Title level={5}>数据保留</Title>
            <Paragraph>
              我们只在必要的时间内保留您的数据，超期后会自动删除。
            </Paragraph>
          </Timeline.Item>
        </Timeline>
      </Card>

      <Modal
        title="确认删除数据"
        open={deleteVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteVisible(false)}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Paragraph>
          <strong>警告：</strong>删除操作不可恢复！
        </Paragraph>
        <Paragraph>
          删除后，您的所有个人数据将被永久删除，但必要的日志记录将保留以满足法律要求。
        </Paragraph>
        <Paragraph>
          我们将在 30 天内处理您的删除请求。
        </Paragraph>
      </Modal>
    </div>
  )
}

export default DataPrivacy
