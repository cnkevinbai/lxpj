import { useState, useEffect } from 'react'
import { Modal, Input, List, Tag, Spin, Empty } from 'antd'
import { SearchOutlined, CustomerServiceOutlined, ShoppingOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Search } = Input

interface SearchResult {
  type: 'lead' | 'customer' | 'order' | 'opportunity'
  id: string
  title: string
  subtitle: string
  status?: string
  url: string
}

// 模拟搜索结果
const mockResults: SearchResult[] = [
  { type: 'customer', id: '1', title: '成都某某科技有限公司', subtitle: '联系人：张总', status: 'active', url: '/customers/1' },
  { type: 'lead', id: '2', title: '重庆某某制造厂', subtitle: '线索来源：官网', status: 'following', url: '/leads/2' },
  { type: 'order', id: '3', title: '订单 ORD20260312001', subtitle: '金额：¥125,000', status: 'pending', url: '/orders/3' },
  { type: 'opportunity', id: '4', title: '商机 - 年度采购', subtitle: '预计成交：¥500,000', status: 'negotiation', url: '/opportunities/4' },
]

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

const typeConfig = {
  lead: { color: 'orange', icon: <CustomerServiceOutlined />, label: '线索' },
  customer: { color: 'blue', icon: <CustomerServiceOutlined />, label: '客户' },
  order: { color: 'green', icon: <ShoppingOutlined />, label: '订单' },
  opportunity: { color: 'purple', icon: <FileTextOutlined />, label: '商机' },
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // 监听快捷键 Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (!open) {
          // 触发打开搜索
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // 搜索逻辑
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchText.trim()) {
        setLoading(true)
        // TODO: 调用实际 API
        // const res = await searchApi.global(searchText)
        // setResults(res.data)
        setResults(mockResults.filter(r => 
          r.title.toLowerCase().includes(searchText.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(searchText.toLowerCase())
        ))
        setLoading(false)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchText])

  const handleResultClick = (url: string) => {
    navigate(url)
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      title={null}
      centered
    >
      <div style={{ padding: '16px 0' }}>
        <Search
          placeholder="搜索客户、线索、订单、商机..."
          size="large"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ marginBottom: 16 }}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <Spin />
          </div>
        ) : results.length === 0 && searchText ? (
          <Empty description="未找到相关结果" />
        ) : (
          <List
            dataSource={results}
            renderItem={(item) => {
              const config = typeConfig[item.type]
              return (
                <List.Item
                  onClick={() => handleResultClick(item.url)}
                  style={{
                    cursor: 'pointer',
                    padding: '12px 16px',
                    borderRadius: 8,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        fontSize: 20,
                        color: config.color,
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `${config.color}20`,
                        borderRadius: '50%',
                      }}>
                        {config.icon}
                      </div>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{item.title}</span>
                        <Tag color={config.color}>{config.label}</Tag>
                        {item.status && (
                          <Tag>{item.status}</Tag>
                        )}
                      </div>
                    }
                    description={item.subtitle}
                  />
                </List.Item>
              )
            }}
          />
        )}

        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid #f0f0f0',
          color: '#999',
          fontSize: 12,
          textAlign: 'center',
        }}>
          <span>💡 提示：按 Ctrl+K 快速唤起搜索</span>
        </div>
      </div>
    </Modal>
  )
}
