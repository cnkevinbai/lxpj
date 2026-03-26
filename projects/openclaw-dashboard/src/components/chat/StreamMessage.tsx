/**
 * 流式消息组件
 * 
 * 显示流式响应内容，支持 Markdown 渲染
 */

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface StreamMessageProps {
  content: string;
  agentName?: string;
  agentAvatar?: string;
  isStreaming?: boolean;
}

export function StreamMessage({
  content,
  agentName = 'AI',
  agentAvatar = '🤖',
  isStreaming = true,
}: StreamMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-4"
    >
      {/* Agent 头像 */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-xl">
        {agentAvatar}
      </div>

      {/* 消息内容 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-400 mb-2 flex items-center gap-2">
          <span>{agentName}</span>
          {isStreaming && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs">生成中</span>
            </span>
          )}
        </div>

        {/* Markdown 内容 */}
        <div className="markdown-content text-slate-200">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {/* 流式光标 */}
        {isStreaming && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="inline-block w-2 h-4 bg-cyan-400 ml-1"
          />
        )}
      </div>
    </motion.div>
  );
}

export default StreamMessage;