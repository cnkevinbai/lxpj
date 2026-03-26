import React, { useState, useEffect } from 'react'
import { Input, Select, Button } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import VoiceInput from './VoiceInput'

const { Option } = Select

interface SearchBarProps {
  onSearch: (keyword: string, filters: any) => void
  placeholder?: string
  showFilters?: boolean
  filterOptions?: { label: string; value: string }[]
}

/**
 * 高级搜索栏
 * 支持语音输入、筛选、排序
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = '搜索...',
  showFilters = true,
  filterOptions = [],
}) => {
  const [keyword, setKeyword] = useState('')
  const [filters, setFilters] = useState<any>({})

  const handleSearch = () => {
    onSearch(keyword, filters)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleVoiceRecognize = (text: string) => {
    setKeyword(text)
    setTimeout(() => handleSearch(), 500)
  }

  return (
    <div className="flex gap-2 items-center">
      {/* 搜索框 */}
      <div className="flex-1 flex gap-2">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          allowClear
          suffix={
            <div className="flex gap-1">
              <VoiceInput onRecognize={handleVoiceRecognize} />
              <SearchOutlined className="cursor-pointer text-gray-400" onClick={handleSearch} />
            </div>
          }
        />
      </div>

      {/* 筛选器 */}
      {showFilters && filterOptions.length > 0 && (
        <Select
          mode="multiple"
          placeholder="筛选"
          className="w-48"
          suffixIcon={<FilterOutlined />}
          onChange={(values) => {
            setFilters({ ...filters, values })
            onSearch(keyword, { ...filters, values })
          }}
          allowClear
        >
          {filterOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )}

      {/* 搜索按钮 */}
      <Button type="primary" onClick={handleSearch}>
        搜索
      </Button>
    </div>
  )
}

export default SearchBar
