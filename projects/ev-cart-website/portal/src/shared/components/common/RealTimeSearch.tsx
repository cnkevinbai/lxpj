/**
 * 实时搜索组件 - 带搜索建议
 * 渔晓白 ⚙️ · 专业交付
 */

import { useState, useEffect, useRef } from 'react'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
import { Input, Spin } from 'antd'
import useDebounce from '../../hooks/useDebounce'

interface SearchOption {
  value: string
  label: string
  type?: string
}

interface RealTimeSearchProps {
  value?: string
  onChange: (value: string) => void
  onSearch: (keyword: string) => Promise<SearchOption[]>
  placeholder?: string
  onSelect?: (option: SearchOption) => void
}

export default function RealTimeSearch({
  value,
  onChange,
  onSearch,
  placeholder = '搜索...',
  onSelect
}: RealTimeSearchProps) {
  const [searchValue, setSearchValue] = useState(value || '')
  const [options, setOptions] = useState<SearchOption[]>([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 防抖搜索
  const debouncedValue = useDebounce(searchValue, 300)

  // 执行搜索
  useEffect(() => {
    if (debouncedValue.length < 2) {
      setOptions([])
      setVisible(false)
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const results = await onSearch(debouncedValue)
        setOptions(results)
        setVisible(true)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [debouncedValue, onSearch])

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

  const handleSelect = (option: SearchOption) => {
    setSearchValue(option.label)
    setVisible(false)
    onSelect?.(option)
  }

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
      <Input
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value)
          onChange(e.target.value)
        }}
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
                setVisible(false)
              }}
            />
          )
        }
        size="large"
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
          maxHeight: 300,
          overflow: 'auto'
        }}>
          {loading ? (
            <div style={{ padding: 16, textAlign: 'center' }}>
              <Spin size="small" />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                搜索中...
              </div>
            </div>
          ) : options.length > 0 ? (
            options.map((option, index) => (
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
            ))
          ) : (
            <div style={{ padding: 16, textAlign: 'center', color: '#999', fontSize: 14 }}>
              暂无搜索结果
            </div>
          )}
        </div>
      )}
    </div>
  )
}
