/**
 * 打字指示器组件
 * 
 * 显示 AI 正在输入的状态
 */

import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  agentName?: string;
  agentAvatar?: string;
}

export function TypingIndicator({ agentName = 'AI', agentAvatar = '🤖' }: TypingIndicatorProps) {
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

      {/* 打字动画 */}
      <div className="flex-1">
        <div className="text-sm text-slate-400 mb-2">
          {agentName} 正在思考...
        </div>
        <div className="flex items-center gap-1">
          <span className="typing-dot w-2 h-2 rounded-full bg-cyan-400" />
          <span className="typing-dot w-2 h-2 rounded-full bg-cyan-400" />
          <span className="typing-dot w-2 h-2 rounded-full bg-cyan-400" />
        </div>
      </div>
    </motion.div>
  );
}

export default TypingIndicator;