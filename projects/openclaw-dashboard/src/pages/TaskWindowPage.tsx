/**
 * 任务窗口页面 - 独立的隔离会话窗口
 * 
 * 特性：
 * 1. 完全独立的会话上下文
 * 2. 独立的 WebSocket 连接
 * 3. Agent 智能路由推荐
 * 4. 窗口驻留、挂起、关闭
 * 5. 与主窗口状态同步
 */

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionRegistry } from '../store/session-factory';
import { windowService } from '../services/window-manager';
import { wsService } from '../services/websocket';
import { matchAgent, getAllMatchingAgents, AGENT_ROUTES, AgentRouteConfig } from '../services/agent-router';

// 窗口状态
type WindowState = 'active' | 'pinned' | 'minimized';

// 消息类型
interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agentId?: string;
  timestamp: Date;
}

export function TaskWindowPage() {
  const [searchParams] = useSearchParams();
  
  // 从 URL 参数获取会话配置
  const sessionId = searchParams.get('sessionId') || 'default';
  const initialAgentId = searchParams.get('agentId') || 'main';
  const title = searchParams.get('title') || '任务窗口';
  const windowId = searchParams.get('windowId') || '';
  
  // 会话状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentAgentId, setCurrentAgentId] = useState(initialAgentId);
  
  // 窗口状态
  const [windowState, setWindowState] = useState<WindowState>('active');
  const [isPinned, setIsPinned] = useState(false);
  
  // 智能路由推荐
  const [routeSuggestions, setRouteSuggestions] = useState<{ agent: AgentRouteConfig; matchedKeywords: string[] }[]>([]);
  const [showRouteSuggestions, setShowRouteSuggestions] = useState(false);
  
  // UI 状态
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // 当前 Agent 信息
  const currentAgent = useMemo(() => AGENT_ROUTES.find(a => a.id === currentAgentId), [currentAgentId]);
  
  // 设置窗口标题
  useEffect(() => {
    document.title = `${title} - OpenClaw`;
  }, [title]);
  
  // 设置 WebSocket
  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        // 检查是否已连接
        if (wsService.isConnected && wsService.isConnected()) {
          setIsConnected(true);
          console.log('[TaskWindow] WebSocket 已连接');
          return;
        }
        
        // 尝试连接
        await wsService.connect();
        setIsConnected(true);
        console.log('[TaskWindow] WebSocket 连接成功');
      } catch (error) {
        console.error('[TaskWindow] WebSocket 连接失败:', error);
        setIsConnected(false);
      }
    };
    
    setupWebSocket();
  }, []);
  
  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // 窗口操作
  const handlePin = useCallback(() => {
    setIsPinned(prev => !prev);
    // 更新窗口状态
    if (windowId) {
      windowService.updateWindow(windowId, { pinned: !isPinned });
    }
  }, [windowId, isPinned]);
  
  const handleMinimize = useCallback(() => {
    setWindowState('minimized');
    // 更新窗口状态为 inactive
    if (windowId) {
      windowService.updateWindow(windowId, { status: 'inactive' });
    }
  }, [windowId]);
  
  const handleClose = useCallback(() => {
    // 保存会话状态
    const sessionData = {
      messages: messages.slice(-50), // 只保留最近50条
      agentId: currentAgentId,
      sessionId,
    };
    localStorage.setItem(`task_session_${sessionId}`, JSON.stringify(sessionData));
    
    // 关闭窗口
    window.close();
  }, [messages, currentAgentId, sessionId]);
  
  // 输入变化时检测智能路由
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    
    // 智能路由匹配
    if (value.length >= 2) {
      const matches = getAllMatchingAgents(value);
      if (matches.length > 0) {
        // 过滤掉当前 Agent
        const otherMatches = matches.filter(m => m.agent.id !== currentAgentId);
        setRouteSuggestions(otherMatches.slice(0, 3).map(m => ({ agent: m.agent, matchedKeywords: m.matchedKeywords })));
        setShowRouteSuggestions(otherMatches.length > 0);
      } else {
        setShowRouteSuggestions(false);
      }
    } else {
      setShowRouteSuggestions(false);
    }
  }, [currentAgentId]);
  
  // 切换 Agent
  const handleSwitchAgent = useCallback((agentId: string) => {
    setCurrentAgentId(agentId);
    setShowRouteSuggestions(false);
    console.log(`[TaskWindow] 切换 Agent: ${agentId}`);
  }, []);
  
  // 发送消息
  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // 清空输入
    setInput('');
    setShowRouteSuggestions(false);
    
    // 显示打字状态
    setIsTyping(true);
    
    try {
      // 调用真实后端 API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/stream/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        body: JSON.stringify({ prompt: input, agentId: currentAgentId, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // 读取流式响应
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk' && data.data?.content) {
                fullContent += data.data.content;
              }
            } catch (e) {}
          }
        }
      }

      // 添加 AI 响应消息
      const agentMessage: Message = {
        id: `msg-${Date.now()}-agent`,
        role: 'agent',
        content: fullContent || '抱歉，没有收到响应。',
        agentId: currentAgentId,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);

      // 更新窗口消息数
      if (windowId) {
        windowService.updateWindow(windowId, { messageCount: messages.length + 2 });
      }

    } catch (error) {
      console.error('[TaskWindow] 发送失败:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'system',
        content: '⚠️ 发送失败，请检查网络连接',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [input, sessionId, currentAgentId, messages.length, windowId]);
  
  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      {/* 顶部栏 */}
      <header className="h-14 bg-slate-800/90 backdrop-blur border-b border-slate-700 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{currentAgent?.avatar || '🤖'}</span>
          <div>
            <h1 className="font-medium">{currentAgent?.name || 'AI'}</h1>
            <p className="text-xs text-slate-400">
              {title} · {isPinned ? '📌 已驻留' : '活跃'} · {isConnected ? '🟢 已连接' : '🔴 离线'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 窗口控制按钮 */}
          <div className="flex items-center space-x-1">
            {/* 驻留按钮 */}
            <button
              onClick={handlePin}
              className={`p-2 rounded-lg transition-colors ${
                isPinned 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                  : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={isPinned ? '取消驻留' : '驻留窗口'}
            >
              📌
            </button>
            
            {/* 最小化按钮 */}
            <button
              onClick={handleMinimize}
              className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="最小化"
            >
              ➖
            </button>
            
            {/* 关闭按钮 */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
              title="关闭窗口"
            >
              ✕
            </button>
          </div>
        </div>
      </header>
      
      {/* 消息列表 */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-500">
              <p className="text-4xl mb-3">{currentAgent?.avatar || '🤖'}</p>
              <p className="text-lg mb-1">开始与 {currentAgent?.name || 'AI'} 对话</p>
              <p className="text-sm">这是一个独立的隔离会话窗口</p>
              {currentAgent && (
                <div className="mt-6 text-sm">
                  <p className="text-slate-600 mb-2">擅长领域：</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentAgent.keywords.slice(0, 5).map(kw => (
                      <span key={kw} className="bg-slate-700/50 px-3 py-1 rounded-full text-slate-300">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">{currentAgent?.name || 'AI'} 正在输入...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </main>
      
      {/* 智能路由推荐 */}
      <AnimatePresence>
        {showRouteSuggestions && routeSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 py-3 bg-slate-800/90 border-t border-slate-700"
          >
            <div className="text-xs text-slate-400 mb-2">💡 推荐切换到更合适的代理：</div>
            <div className="flex flex-wrap gap-2">
              {routeSuggestions.map(({ agent, matchedKeywords }) => (
                <button
                  key={agent.id}
                  onClick={() => handleSwitchAgent(agent.id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-cyan-500/20 hover:border-cyan-500/50 border border-slate-600 rounded-lg text-sm transition-colors"
                >
                  <span className="text-lg">{agent.avatar}</span>
                  <span>{agent.name}</span>
                  <span className="text-xs text-cyan-400">
                    ({matchedKeywords.slice(0, 2).join(', ')})
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 输入区域 */}
      <footer className="p-4 bg-slate-800/90 backdrop-blur border-t border-slate-700 flex-shrink-0">
        <div className="flex space-x-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 placeholder-slate-500"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-all shadow-lg shadow-cyan-500/20 disabled:shadow-none"
          >
            发送
          </button>
        </div>
      </footer>
    </div>
  );
}

// 消息气泡组件
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-md'
            : 'bg-slate-700/80 text-white rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-2 ${isUser ? 'text-cyan-200' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

export default TaskWindowPage;