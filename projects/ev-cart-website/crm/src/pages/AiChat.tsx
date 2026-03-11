import React, { useState, useRef, useEffect } from 'react'
import { Card, Input, Button, List, Tag } from 'antd'
import { SendOutlined, RobotOutlined } from '@ant-design/icons'
import apiClient from '../services/api'

interface Message {
  type: 'user' | 'bot'
  content: string
  timestamp: string
}

/**
 * AI 客服聊天页面
 */
const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: '您好！欢迎咨询四川道达智能，请问有什么可以帮您？',
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadSuggestions()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadSuggestions = async () => {
    try {
      const response = await apiClient.get('/ai-chat/suggestions')
      setSuggestions(response.data.suggestions)
    } catch (error) {
      console.error('加载推荐问题失败', error)
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // 添加用户消息
    const userMessage: Message = {
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const response = await apiClient.post('/ai-chat/message', { message: content })
      
      // 添加机器人回复
      const botMessage: Message = {
        type: 'bot',
        content: response.data.reply,
        timestamp: response.data.timestamp,
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('发送消息失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card
        title={
          <div className="flex items-center gap-2">
            <RobotOutlined className="text-brand-blue" />
            <span>智能客服助手</span>
          </div>
        }
        className="h-[600px] flex flex-col"
      >
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto mb-4">
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    item.type === 'user'
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div>{item.content}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* 推荐问题 */}
        {messages.length === 1 && suggestions.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">您可能想问：</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((question, index) => (
                <Tag
                  key={index}
                  className="cursor-pointer hover:bg-brand-blue hover:text-white transition-colors"
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* 输入框 */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="请输入您的问题..."
            disabled={loading}
            allowClear
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => sendMessage(inputValue)}
            loading={loading}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AiChat
