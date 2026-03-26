import React, { useState, useEffect } from 'react'
import { Button, Tooltip, message } from 'antd'
import { ThunderboltOutlined, ThunderboltFilled } from '@ant-design/icons'

interface VoiceInputProps {
  onRecognize: (text: string) => void
  disabled?: boolean
}

/**
 * 语音输入组件
 * 使用 Web Speech API
 */
const VoiceInput: React.FC<VoiceInputProps> = ({ onRecognize, disabled = false }) => {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // 检查浏览器支持
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recog = new SpeechRecognition()
      
      recog.continuous = false
      recog.interimResults = false
      recog.lang = 'zh-CN'

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onRecognize(transcript)
        setIsListening(false)
      }

      recog.onerror = (event: any) => {
        console.error('语音识别错误', event.error)
        message.error('语音识别失败，请重试')
        setIsListening(false)
      }

      recog.onend = () => {
        setIsListening(false)
      }

      setRecognition(recog)
    }
  }, [onRecognize])

  const toggleListening = () => {
    if (!recognition) {
      message.warning('您的浏览器不支持语音输入')
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
      setIsListening(true)
      message.info('请开始说话...')
    }
  }

  return (
    <Tooltip title={isListening ? '点击停止' : '语音输入'}>
      <Button
        type={isListening ? 'primary' : 'default'}
        icon={isListening ? <ThunderboltFilled /> : <ThunderboltOutlined />}
        onClick={toggleListening}
        disabled={disabled}
        className={isListening ? 'animate-pulse' : ''}
      />
    </Tooltip>
  )
}

export default VoiceInput
