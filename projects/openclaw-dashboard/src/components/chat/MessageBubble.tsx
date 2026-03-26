/**
 * 消息气泡组件
 * 
 * 支持用户消息和 AI 消息的不同样式
 */

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface MessageBubbleProps {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agentName?: string;
  agentAvatar?: string;
  timestamp: string;
  onRetry?: () => void;
  onDelete?: () => void;
}

export function MessageBubble({
  role,
  content,
  agentName,
  agentAvatar,
  timestamp,
  onRetry,
  onDelete,
}: MessageBubbleProps) {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  // 格式化时间
  const formattedTime = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: zhCN,
  });

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center py-2"
      >
        <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">
          {content}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 p-4 group ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* 头像 */}
      <div
        className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl
          ${isUser
            ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
            : 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20'
          }
        `}
      >
        {isUser ? '👤' : agentAvatar || '🤖'}
      </div>

      {/* 消息内容 */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        {/* 名称和时间 */}
        <div
          className={`
            flex items-center gap-2 mb-1 text-sm text-slate-400
            ${isUser ? 'flex-row-reverse' : ''}
          `}
        >
          <span className="font-medium">
            {isUser ? '你' : agentName || 'AI'}
          </span>
          <span className="text-xs text-slate-500">{formattedTime}</span>
        </div>

        {/* 消息气泡 */}
        <div
          className={`
            inline-block p-4 rounded-2xl text-left
            ${isUser
              ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-md'
              : 'bg-slate-800/80 text-slate-200 rounded-tl-md border border-white/5'
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div
          className={`
            flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity
            ${isUser ? 'justify-end' : ''}
          `}
        >
          {!isUser && onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
            >
              重新生成
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              删除
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MessageBubble;