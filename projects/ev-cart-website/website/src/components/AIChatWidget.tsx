'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatState {
  isOpen: boolean;
  isLoading: boolean;
  messages: Message[];
  input: string;
  userId: string;
}

/**
 * AI 客服聊天窗口组件
 * 对接后端 /api/v1/ai-chat 接口
 */
export default function AIChatWidget() {
  const [state, setState] = useState<ChatState>({
    isOpen: false,
    isLoading: false,
    messages: [],
    input: '',
    userId: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化用户 ID
  useEffect(() => {
    const userId = localStorage.getItem('ai_chat_user_id') || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('ai_chat_user_id', userId);
    setState(s => ({ ...s, userId }));

    // 加载历史消息
    const savedMessages = localStorage.getItem(`ai_chat_messages_${userId}`);
    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages);
        setState(s => ({ ...s, messages: messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) }));
      } catch (e) {
        console.error('加载历史消息失败', e);
      }
    }
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isOpen]);

  // 保存消息到本地存储
  useEffect(() => {
    if (state.userId && state.messages.length > 0) {
      localStorage.setItem(`ai_chat_messages_${state.userId}`, JSON.stringify(state.messages));
    }
  }, [state.messages, state.userId]);

  const sendMessage = async () => {
    if (!state.input.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: state.input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setState(s => ({
      ...s,
      messages: [...s.messages, userMessage],
      input: '',
      isLoading: true,
    }));

    try {
      const response = await fetch('/api/v1/ai-chat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          userId: state.userId,
        }),
      });

      if (!response.ok) {
        throw new Error('请求失败');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        content: data.reply || '抱歉，我暂时无法回答您的问题。建议您联系我们的客服人员。',
        sender: 'bot',
        timestamp: new Date(),
      };

      setState(s => ({
        ...s,
        messages: [...s.messages, botMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('发送消息失败', error);
      
      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        content: '抱歉，网络出现问题，请稍后再试。',
        sender: 'bot',
        timestamp: new Date(),
      };

      setState(s => ({
        ...s,
        messages: [...s.messages, errorMessage],
        isLoading: false,
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => {
    if (confirm('确定要清空聊天记录吗？')) {
      setState(s => ({ ...s, messages: [] }));
      localStorage.removeItem(`ai_chat_messages_${state.userId}`);
    }
  };

  const transferToHuman = async () => {
    try {
      const response = await fetch('/api/v1/ai-chat/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: state.userId,
          reason: '用户要求转人工客服',
        }),
      });

      if (response.ok) {
        alert('已为您转接人工客服，客服人员将很快与您联系！');
      } else {
        alert('转接失败，请稍后再试。');
      }
    } catch (error) {
      console.error('转人工失败', error);
      alert('转接失败，请稍后再试。');
    }
  };

  const quickQuestions = [
    '产品价格是多少？',
    '续航能力如何？',
    '保修期多久？',
    '支持定制吗？',
    '多久能交货？',
  ];

  return (
    <>
      {/* 聊天按钮 */}
      <button
        onClick={() => setState(s => ({ ...s, isOpen: !s.isOpen }))}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="AI 客服"
      >
        {state.isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        
        {/* 未读消息提示 */}
        {!state.isOpen && state.messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {state.messages.filter(m => m.sender === 'bot').length}
          </span>
        )}
      </button>

      {/* 聊天窗口 */}
      {state.isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">AI 智能客服</div>
                  <div className="text-xs opacity-80">工作时间：9:00-18:00</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearHistory}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  title="清空历史"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={transferToHuman}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  title="转人工客服"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-[300px] max-h-[400px]">
            {state.messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="text-gray-600 mb-2">您好！我是道达智能 AI 客服</div>
                <div className="text-sm text-gray-500">请问有什么可以帮您？</div>
              </div>
            ) : (
              <div className="space-y-4">
                {state.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 shadow rounded-bl-none'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.sender === 'user' ? 'opacity-70' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {state.isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 快捷问题 */}
          {state.messages.length === 0 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">猜你想问：</div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setState(s => ({ ...s, input: question }))}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 输入框 */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-end space-x-2">
              <textarea
                value={state.input}
                onChange={(e) => setState(s => ({ ...s, input: e.target.value }))}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none text-sm"
                rows={2}
              />
              <button
                onClick={sendMessage}
                disabled={!state.input.trim() || state.isLoading}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              AI 客服，工作时间外请留言
            </div>
          </div>
        </div>
      )}
    </>
  );
}
