'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VoiceSearchProps {
  onResult?: (text: string) => void;
  placeholder?: string;
}

/**
 * 语音搜索组件
 * 支持语音输入和文字搜索
 */
export default function VoiceSearch({
  onResult,
  placeholder = '搜索产品、案例...',
}: VoiceSearchProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 检查浏览器是否支持语音识别
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      onResult?.(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResult?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center bg-white rounded-full border border-gray-200 shadow-sm focus-within:shadow-md focus-within:border-blue-500 transition-all">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-6 py-3 rounded-full outline-none text-gray-700"
        />
        
        {/* 语音按钮 */}
        {isSupported && (
          <motion.button
            type="button"
            onClick={startListening}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full mr-2 transition-colors ${
              isListening
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
            }`}
            title="语音搜索"
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={isListening ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </motion.svg>
          </motion.button>
        )}
        
        {/* 搜索按钮 */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          搜索
        </motion.button>
      </div>

      {/* 语音提示 */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg"
        >
          正在听您说话...
        </motion.div>
      )}
    </form>
  );
}
