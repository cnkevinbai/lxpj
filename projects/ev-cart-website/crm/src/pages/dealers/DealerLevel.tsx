import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Select, DatePicker, Input, message, Card, Timeline, Statistic, Row, Col } from 'antd'
import { SwapOutlined, RiseOutlined, FallOutlined, HistoryOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface LevelHistory {
  id: string
  dealerId: string
  dealer: {
    id: string
    companyName: string
    dealerCode: string
  }
  oldLevel: string
  newLevel: string
  reason: string
  reasonType: string
  effectiveDate: string
  approvedByName: string
  createdAt: string
}

interface Dealer {
  id: string
  dealerCode: string
  companyName: string
  level: string
  performanceScore: number
  salesActual: number
  consecutiveQualifiedQuarters: number
}

const DealerLevel: React.FC = () => {
  const [histories, setHistories] = useState<LevelHistory[]>([])
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [adjustVisible, setAdjustVisible] = useState(false)
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null)
  const [form] = Form.useForm()
  const [statistics, setStatistics] = useState<any>({})

  const levelColors: Record<string, string> = {
    trial: 'default',
    standard: 'blue',
    gold: 'gold',
    platinum: 'purple',
    strategic: 'red',
  }

  const levelLabels: Record<string, string> = {
    trial: '试用经销商',
    standard: '标准经销商',
    gold: '金牌经销商',
    platinum: '白金经销商',
    strategic: '战略经销商',
  }

  const levelOrder = ['trial', 'standard', 'gold', 'platinum', 'strategic']

  // 获取等级变更历史
  const fetchHistories = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      const response = await fetch(`/api/v1/dealer-levels/history?${params}`)
      const data = await response.json()
      setHistories(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      message.error('加载等级历史失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取经销商列表
  const fetchDealers = async () => {
    try {
      const response = await fetch('/api/v1/dealers?limit=100')
      const data = await response.json()
      setDealers(data.data || [])
    } catch (error) {
      console.error('加载经销商列表失败', error)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/v1/dealer-levels/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('获取统计数据失败', error)
    }
  }

  useEffect(() => {
    fetchHistories()
    fetchDealers()
    fetchStatistics()
  }, [page, limit])

  // 调整等级
  const handleAdjust = async (values: any) => {
    try {
      await fetch(`/api/v1/dealer-levels/${selectedDealer?.id}/change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          effectiveDate: values.effectiveDate?.format('YYYY-MM-DD'),
        }),
      })
      message.success('等级调整成功')
      setAdjustVisible(false)
      form.resetFields()
      fetchHistories()
      fetchDealers()
    } catch (error) {
      message.error('调整失败')
    }
  }

  // 自动评估等级
  const handleEvaluate = async (dealerId: string) => {
    try {
      const response = await fetch(`/api/v1/dealer-levels/${dealerId}/evaluate`, {
        method: 'POST',
      })
      const data = await response.json()
      if (data.adjusted) {
        message.success(`等级已调整：${levelLabels[data.oldLevel]} → ${levelLabels[data.newLevel]}`)
      } else {
        message.info('无需调整等级')
      }
      fetchHistories()
      fetchDealers()
    } catch (error) {
      message.error('评估失败')
    }
  }

  const columns: ColumnsType<LevelHistory> = [
    {
      title: '经销商',
      key: 'dealer',
      width: 200,
      render: (_, record) => (
        <div>
          <strong>{record.dealer?.companyName}</strong>
          <br />
          <small style={{ color: '#999' }}>{record.dealer?.dealerCode}</small>
        </div>
      ),
    },
    {
      title: '原等级',
      dataIndex: 'oldLevel',
      key: 'oldLevel',
      width: 120,
      render: (level) => level ? (
        <Tag color={levelColors[level]}>{levelLabels[level]}</Tag>
      ) : (
        <span style={{ color: '#999' }}>新签约</span>
      ),
    },
    {
      title: '新等级',
      dataIndex: 'newLevel',
      key: 'newLevel',
      width: 120,
      render: (level) => (
        <Tag color={levelColors[level]}>{levelLabels[level]}</Tag>
      ),
    },
    {
      title: '变更类型',
      dataIndex: 'reasonType',
      key: 'reasonType',
      width: 100,
      render: (type) => {
        const isPromotion = type === 'promotion'
        return (
          <span style={{ color: isPromotion ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
            {isPromotion ? <RiseOutlined /> : <FallOutlined />}
            {' '}{isPromotion ? '升级' : '降级'}
          </span>
        )
      },
    },
    {
      title: '变更日期',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '变更原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 300,
      ellipsis: true,
    },
    {
      title: '审批人',
      dataIndex: 'approvedByName',
      key: 'approvedByName',
      width: 100,
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="等级变更总次数"
              value={statistics.total || 0}
              suffix="次"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="升级次数"
              value={statistics.promotions || 0}
              suffix="次"
              valueStyle={{ color: '#52c41a' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="降级次数"
              value={statistics.demotions || 0}
              suffix="次"
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<FallOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <h3>经销商等级分布</h3>
        <Space wrap size="large">
          {levelOrder.map((level) => {
            const count = statistics.byNewLevel?.find((l: any) => l.level === level)?.count || 0
            return (
              <div key={level}>
                <Tag color={levelColors[level]} style={{ fontSize: 14, padding: '8px 16px' }}>
                  {levelLabels[level]}: <strong>{count}</strong>个
                </Tag>
              </div>
            )
          })}
        </Space>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <h3>快速等级调整</h3>
        <Table
          dataSource={dealers}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ y: 300 }}
          columns={[
            {
              title: '经销商编码',
              dataIndex: 'dealerCode',
              width: 120,
            },
            {
              title: '公司名称',
              dataIndex: 'companyName',
              width: 200,
            },
            {
              title: '当前等级',
              dataIndex: 'level',
              width: 120,
              render: (level) => (
                <Tag color={levelColors[level]}>{levelLabels[level]}</Tag>
              ),
            },
            {
              title: '绩效分数',
              dataIndex: 'performanceScore',
              width: 100,
              render: (score) => (
                <span style={{ color: score >= 80 ? '#52c41a' : '#faad14' }}>
                  {score?.toFixed(1) || 0}分
                </span>
              ),
            },
            {
              title: '连续合格季度',
              dataIndex: 'consecutiveQualifiedQuarters',
              width: 120,
              render: (quarters) => `${quarters || 0}个季度`,
            },
            {
              title: '年销售额',
              dataIndex: 'salesActual',
              width: 120,
              render: (amount) => `¥${(amount || 0).toLocaleString()}`,
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              render: (_, record) => (
                <Space size="small">
                  <Button
                    size="small"
                    icon={<SwapOutlined />}
                    onClick={() => {
                      setSelectedDealer(record)
                      setAdjustVisible(true)
                    }}
                  >
                    调整
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleEvaluate(record.id)}
                  >
                    自动评估
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Card title="等级变更历史">
        <Button
          icon={<HistoryOutlined />}
          onClick={fetchHistories}
          style={{ marginBottom: 16 }}
        >
          刷新
        </Button>
        <Table
          columns={columns}
          dataSource={histories}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPage(page)
              setLimit(pageSize || 20)
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 调整等级弹窗 */}
      <Modal
        title="调整经销商等级"
        open={adjustVisible}
        onCancel={() => setAdjustVisible(false)}
        onOk={() => form.submit()}
      >
        {selectedDealer && (
          <div>
            <p><strong>经销商:</strong> {selectedDealer.companyName}</p>
            <p><strong>当前等级:</strong> <Tag color={levelColors[selectedDealer.level]}>{levelLabels[selectedDealer.level]}</Tag></p>
            <p><strong>绩效分数:</strong> {selectedDealer.performanceScore?.toFixed(1) || 0}分</p>
            <p><strong>连续合格季度:</strong> {selectedDealer.consecutiveQualifiedQuarters || 0}个</p>
            
            <Form form={form} layout="vertical" onFinish={handleAdjust}>
              <Form.Item
                name="newLevel"
                label="新等级"
                rules={[{ required: true, message: '请选择新等级' }]}
                initialValue={selectedDealer.level}
              >
                <Select>
                  {levelOrder.map((level) => (
                    <Select.Option key={level} value={level}>
                      {levelLabels[level]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="reason"
                label="变更原因"
                rules={[{ required: true, message: '请输入变更原因' }]}
              >
                <Input.TextArea rows={3} placeholder="如：连续 2 季度考核优秀，销售额达标" />
              </Form.Item>
              <Form.Item
                name="reasonType"
                label="变更类型"
                rules={[{ required: true, message: '请选择变更类型' }]}
              >
                <Select>
                  <Select.Option value="promotion">升级</Select.Option>
                  <Select.Option value="demotion">降级</Select.Option>
                  <Select.Option value="adjustment">调整</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="effectiveDate"
                label="生效日期"
                rules={[{ required: true, message: '请选择生效日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DealerLevel
