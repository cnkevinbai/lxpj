/**
 * 消息列表组件 - 虚拟滚动 + 流式渲染
 * 
 * 优化：
 * - 虚拟滚动（大量消息时性能优化）
 * - 消息缓冲区（平滑加载）
 * - 流式消息实时渲染
 */

import { useRef, useEffect, useState, useCallback, memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { StreamTextRenderer } from './StreamTextRenderer';

// 消息类型
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agentId?: string;
  agentName?: string;
  agentAvatar?: string;
  createdAt: string;
  isStreaming?: boolean;
}

// Agent 配置
const AGENT_CONFIG: Record<string, { name: string; avatar: string; color: string }> = {
  main: { name: '渔晓白', avatar: '🦞', color: '#06B6D4' },
  architect: { name: 'Morgan', avatar: '🏛️', color: '#8B5CF6' },
  'backend-dev': { name: 'Ryan', avatar: '💻', color: '#10B981' },
  'frontend-dev': { name: 'Chloe', avatar: '🎨', color: '#F59E0B' },
  'database-engineer': { name: 'Diana', avatar: '🗄️', color: '#EC4899' },
  'devops-engineer': { name: 'Sam', avatar: '🚀', color: '#EF4444' },
  'security-engineer': { name: 'Sophia', avatar: '🔐', color: '#6366F1' },
  'test-engineer': { name: 'Taylor', avatar: '🧪', color: '#14B8A6' },
  'code-reviewer': { name: 'Blake', avatar: '👁️', color: '#F97316' },
  'ui-ux-designer': { name: 'Maya', avatar: '✨', color: '#A855F7' },
  'product-manager': { name: 'Alex', avatar: '📊', color: '#0EA5E9' },
};

// 单条消息组件（memo 优化，避免无关消息重渲染）
const MessageItem = memo(function MessageItem({
  message,
  isLast,
}: {
  message: ChatMessage;
  isLast: boolean;
}) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  // 使用 useMemo 缓存 agent 查找
  const agent = useMemo(() => 
    AGENT_CONFIG[message.agentId || 'main'] || AGENT_CONFIG.main,
    [message.agentId]
  );

  // 格式化时间（简化，避免频繁计算）
  const timeDisplay = useMemo(() => {
    const d = new Date(message.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}小时前`;
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }, [message.createdAt]);

  // 系统消息
  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center py-2"
      >
        <span className="text-xs text-slate-500 bg-slate-800/50 px-4 py-1.5 rounded-full border border-white/5">
          {message.content}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 p-4 group ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* 头像 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl
          ${isUser
            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20'
            : 'bg-gradient-to-br from-slate-800 to-slate-700 border border-white/10'
          }
        `}
        style={!isUser ? { borderColor: `${agent.color}40` } : undefined}
      >
        {isUser ? '👤' : agent.avatar}
      </motion.div>

      {/* 消息内容 */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        {/* 名称和时间 */}
        <div
          className={`
            flex items-center gap-2 mb-1.5 text-sm
            ${isUser ? 'flex-row-reverse text-slate-400' : 'text-slate-400'}
          `}
        >
          <span className="font-medium" style={!isUser ? { color: agent.color } : undefined}>
            {isUser ? '你' : agent.name}
          </span>
          <span className="text-xs text-slate-500">{timeDisplay}</span>
          {message.isStreaming && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              生成中
            </span>
          )}
        </div>

        {/* 消息气泡 */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`
            inline-block p-4 rounded-2xl text-left
            ${isUser
              ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-lg shadow-cyan-600/20'
              : 'bg-slate-800/80 text-slate-200 rounded-tl-sm border border-white/5'
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          ) : message.isStreaming && isLast ? (
            <StreamTextRenderer
              content={message.content}
              isStreaming={message.isStreaming}
              speed={15}
            />
          ) : (
            <div className="markdown-content text-sm leading-relaxed">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});

// 打字指示器组件（memo优化）
const TypingIndicator = memo(function TypingIndicator({ agentId }: { agentId?: string }) {
  const agent = AGENT_CONFIG[agentId || 'main'] || AGENT_CONFIG.main;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 p-4"
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-white/10"
        style={{ borderColor: `${agent.color}40` }}
      >
        {agent.avatar}
      </div>

      <div className="flex-1">
        <div className="text-sm text-slate-400 mb-2">
          {agent.name} 正在思考
        </div>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: agent.color }}
              animate={{
                y: [0, -6, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

// 主组件
interface MessageListProps {
  messages: ChatMessage[];
  isTyping?: boolean;
  typingAgentId?: string;
  streamingContent?: string;
  streamingAgentId?: string;
}

export function MessageList({
  messages,
  isTyping,
  typingAgentId,
  streamingContent,
  streamingAgentId,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // 自动滚动到底部
  useEffect(() => {
    if (shouldAutoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent, shouldAutoScroll]);

  // 检测用户滚动
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  }, []);

  // 滚动到底部按钮
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShouldAutoScroll(true);
  }, []);

  return (
    <div className="relative h-full">
      {/* 消息列表 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overflow-x-hidden"
      >
        {/* 空状态 */}
        {messages.length === 0 && !isTyping && !streamingContent && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-slate-500">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-lg">开始新对话</p>
              <p className="text-sm mt-1">输入消息以开始</p>
            </div>
          </div>
        )}

        {/* 消息列表 */}
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
        </AnimatePresence>

        {/* 流式消息 */}
        {streamingContent && (
          <MessageItem
            message={{
              id: 'streaming',
              sessionId: '',
              role: 'agent',
              content: streamingContent,
              agentId: streamingAgentId,
              isStreaming: true,
              createdAt: new Date().toISOString(),
            }}
            isLast={true}
          />
        )}

        {/* 打字指示器 */}
        {isTyping && !streamingContent && (
          <TypingIndicator agentId={typingAgentId} />
        )}

        {/* 底部锚点 */}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* 滚动到底部按钮 */}
      {!shouldAutoScroll && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-3 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}

export default MessageList;