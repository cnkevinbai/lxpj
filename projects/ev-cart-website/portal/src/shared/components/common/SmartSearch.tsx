/**
 * 智能搜索组件 - 支持多条件/搜索历史/热门搜索
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect, useRef } from 'react'
import { SearchOutlined, HistoryOutlined, FireOutlined, CloseOutlined } from '@ant-design/icons'
import { Input, Tag, Spin, Empty } from 'antd'
import useDebounce from '../../hooks/useDebounce'
import { getStorage, setStorage } from '../../utils/storage'

interface SearchOption {
  value: string
  label: string
  type?: string
  highlight?: string[]
}

interface SmartSearchProps {
  value?: string
  onChange: (value: string) => void
  onSearch: (keyword: string, filters?: SearchFilters) => Promise<SearchOption[]>
  placeholder?: string
  onSelect?: (option: SearchOption) => void
  filters?: SearchFilters
  showHistory?: boolean
  showHotSearch?: boolean
  maxHistory?: number
}

interface SearchFilters {
  type?: string
  status?: string
  dateRange?: [string, string]
}

const HISTORY_KEY = 'search_history'
const MAX_HISTORY = 10

export default function SmartSearch({
  value,
  onChange,
  onSearch,
  placeholder = '智能搜索...',
  onSelect,
  filters,
  showHistory = true,
  showHotSearch = true,
  maxHistory = MAX_HISTORY
}: SmartSearchProps) {
  const [searchValue, setSearchValue] = useState(value || '')
  const [options, setOptions] = useState<SearchOption[]>([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [hotSearch, setHotSearch] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // 防抖搜索
  const debouncedValue = useDebounce(searchValue, 300)

  // 加载搜索历史
  useEffect(() => {
    if (showHistory) {
      const savedHistory = getStorage<string[]>(HISTORY_KEY) || []
      setHistory(savedHistory)
    }

    // 加载热门搜索
    if (showHotSearch) {
      loadHotSearch()
    }
  }, [showHistory, showHotSearch])

  // 执行搜索
  useEffect(() => {
    if (debouncedValue.length < 2) {
      setOptions([])
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const results = await onSearch(debouncedValue, filters)
        setOptions(results)
        setVisible(true)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [debouncedValue, filters, onSearch])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 保存到搜索历史
  const saveToHistory = (keyword: string) => {
    if (!showHistory) return

    const newHistory = [keyword, ...history.filter(h => h !== keyword)].slice(0, maxHistory)
    setHistory(newHistory)
    setStorage(HISTORY_KEY, newHistory)
  }

  // 清除搜索历史
  const clearHistory = () => {
    setHistory([])
    setStorage(HISTORY_KEY, [])
  }

  // 加载热门搜索
  const loadHotSearch = async () => {
    // TODO: 从后端加载热门搜索
    const mockHotSearch = ['张总', '某某科技', '产品 A', '维修工单', '合同审批']
    setHotSearch(mockHotSearch)
  }

  const handleSelect = (option: SearchOption) => {
    setSearchValue(option.label)
    saveToHistory(option.label)
    setVisible(false)
    onSelect?.(option)
  }

  const handleHistoryClick = (keyword: string) => {
    setSearchValue(keyword)
    saveToHistory(keyword)
    setVisible(false)
  }

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
      <Input
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value)
          onChange(e.target.value)
          if (e.target.value) setVisible(true)
        }}
        onFocus={() => setVisible(true)}
        placeholder={placeholder}
        prefix={<SearchOutlined style={{ color: '#999' }} />}
        suffix={
          searchValue && (
            <CloseOutlined
              style={{ color: '#999', cursor: 'pointer' }}
              onClick={() => {
                setSearchValue('')
                onChange('')
                setOptions([])
              }}
            />
          )
        }
        size="large"
        allowClear
      />

      {visible && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: '#FFFFFF',
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          maxHeight: 400,
          overflow: 'auto'
        }}>
          {/* 搜索建议 */}
          {searchValue.length >= 2 && options.length > 0 && (
            <div>
              <div style={{
                padding: '8px 16px',
                fontSize: 12,
                color: '#999',
                borderBottom: '1px solid #f0f0f0'
              }}>
                搜索建议
              </div>
              {options.map((option, index) => (
                <div
                  key={option.value || index}
                  onClick={() => handleSelect(option)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: index < options.length - 1 ? '1px solid #f0f0f0' : 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF'
                  }}
                >
                  <div style={{ fontSize: 14, color: '#333' }}>
                    {option.label}
                  </div>
                  {option.type && (
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    {option.type}
                  </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 加载中 */}
          {searchValue.length >= 2 && loading && (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <Spin size="small" />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                搜索中...
              </div>
            </div>
          )}

          {/* 搜索历史 */}
          {!searchValue && history.length > 0 && (
            <div>
              <div style={{
                padding: '8px 16px',
                fontSize: 12,
                color: '#999',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span><HistoryOutlined /> 搜索历史</span>
                <span
                  onClick={clearHistory}
                  style={{ cursor: 'pointer', color: '#999' }}
                >
                  清除
                </span>
              </div>
              <div style={{ padding: '8px 16px' }}>
                {history.map((item, index) => (
                  <Tag
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    style={{
                      marginRight: 8,
                      marginBottom: 8,
                      cursor: 'pointer'
                    }}
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* 热门搜索 */}
          {!searchValue && !history.length && hotSearch.length > 0 && (
            <div>
              <div style={{
                padding: '8px 16px',
                fontSize: 12,
                color: '#999',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <FireOutlined /> 热门搜索
              </div>
              <div style={{ padding: '8px 16px' }}>
                {hotSearch.map((item, index) => (
                  <Tag
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    color={index < 3 ? 'red' : 'default'}
                    style={{
                      marginRight: 8,
                      marginBottom: 8,
                      cursor: 'pointer'
                    }}
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* 无结果 */}
          {searchValue.length >= 2 && !loading && options.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无搜索结果"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
