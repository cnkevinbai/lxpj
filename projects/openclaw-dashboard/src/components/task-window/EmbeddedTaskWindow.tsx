/**
 * 内嵌任务窗口 - 任务执行状态面板
 * 
 * 功能：
 * - 显示任务执行状态
 * - 实时进度更新
 * - 执行日志显示
 * - 结果摘要
 * - 调用真实 AI API
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Agent 配置
const AGENT_AVATARS: Record<string, { name: string; avatar: string; color: string }> = {
  main: { name: '渔晓白', avatar: '🦞', color: '#06B6D4' },
  architect: { name: 'Morgan', avatar: '🏛️', color: '#8B5CF6' },
  'backend-dev': { name: 'Ryan', avatar: '💻', color: '#10B981' },
  'frontend-dev': { name: 'Chloe', avatar: '🎨', color: '#F59E0B' },
  'database-engineer': { name: 'Diana', avatar: '🗄️', color: '#EC4899' },
  'devops-engineer': { name: 'Sam', avatar: '🚀', color: '#EF4444' },
  'test-engineer': { name: 'Taylor', avatar: '🧪', color: '#14B8A6' },
  'code-reviewer': { name: 'Blake', avatar: '👁️', color: '#F97316' },
  'security-engineer': { name: 'Sophia', avatar: '🔐', color: '#6366F1' },
  'ui-ux-designer': { name: 'Maya', avatar: '✨', color: '#A855F7' },
};

// 任务状态
type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

// 日志条目
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

// 执行步骤
interface ExecutionStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
}

// 窗口 Props
interface EmbeddedTaskWindowProps {
  windowId: string;
  agentId: string;
  title: string;
  initialMessage?: string;
  groupId?: string;          // 任务组ID
  taskId?: string;           // 任务ID
  onClose: () => void;
  onMinimize: () => void;
  onFocus?: () => void;      // 窗口聚焦回调
  isMinimized?: boolean;
  onResult?: (result: string) => void; // 任务完成回调
}

export function EmbeddedTaskWindow({
  windowId,
  agentId,
  title,
  initialMessage,
  groupId,
  taskId,
  onClose,
  onMinimize,
  isMinimized = false,
  onResult,
}: EmbeddedTaskWindowProps) {
  // 任务状态
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [streamingContent, setStreamingContent] = useState('');

  // Refs
  const logsEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionKeyRef = useRef<string | null>(null);
  const executedRef = useRef(false); // 跟踪是否已执行

  // Agent 信息
  const agent = useMemo(() => AGENT_AVATARS[agentId] || AGENT_AVATARS.main, [agentId]);

  // 真实任务执行 - 使用后端 SSE API（更稳定）
  useEffect(() => {
    // 只执行一次
    if (executedRef.current) return;
    executedRef.current = true;
    
    const executeTask = async () => {
      setStatus('running');
      addLog('info', `🚀 任务开始: ${title}`);
      
      // 初始化步骤
      const executionSteps: ExecutionStep[] = [
        { id: '1', name: '连接后端', status: 'running' },
        { id: '2', name: '发送任务', status: 'pending' },
        { id: '3', name: '执行中', status: 'pending' },
        { id: '4', name: '获取结果', status: 'pending' },
      ];
      setSteps(executionSteps);
      
      // 计时器
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      try {
        // Step 1: 连接后端
        addLog('info', '连接后端 API...');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        
        // 健康检查
        const healthCheck = await fetch(`${apiUrl.replace('/api', '')}/`).then(r => r.text());
        if (healthCheck) {
          addLog('success', '后端连接成功');
        }
        setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'completed' } : s));
        setProgress(20);
        
        // Step 2 & 3: 发送任务并执行
        setSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'running' } : s));
        addLog('info', `发送任务到 ${agent.name}...`);
        
        const taskPrompt = initialMessage || title;
        
        addLog('info', `任务: ${taskPrompt.slice(0, 50)}...`);
        setProgress(30);
        
        // SSE 流式请求
        const response = await fetch(`${apiUrl}/stream/ai`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
          body: JSON.stringify({ 
            prompt: taskPrompt, 
            agentId: agentId, 
            sessionId: `task-${windowId}` 
          }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (!response.body) throw new Error('No body');

        setSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'completed' } : s));
        setSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'running' } : s));
        setProgress(50);
        addLog('info', 'AI 正在执行...');

        const reader = response.body.getReader();
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
                  setStreamingContent(fullContent);
                  setProgress(50 + Math.min(fullContent.length / 10, 40)); // 估算进度
                }
              } catch (e) {}
            }
          }
        }

        setProgress(90);
        setSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'completed' } : s));
        
        // Step 4: 获取结果
        setSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: 'running' } : s));
        addLog('info', '整理执行结果...');

        if (fullContent) {
          setResult(fullContent);
          addLog('success', '✅ 任务执行完成！');
          if (onResult) {
            onResult(fullContent);
          }
        } else {
          throw new Error('未收到 AI 响应');
        }

        setSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: 'completed' } : s));
        setProgress(100);
        setStatus('completed');

      } catch (error: any) {
        addLog('error', `❌ 任务执行失败: ${error.message}`);
        setStatus('failed');
        setSteps(prev => prev.map(s => 
          s.status === 'running' ? { ...s, status: 'failed' } : s
        ));
      }
    };
    
    executeTask();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // 空依赖，只在挂载时执行一次

  // 添加日志
  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    const entry: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      level,
      message,
    };
    setLogs(prev => [...prev, entry]);
  }, []);

  // 滚动到底部
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 如果最小化，只显示状态栏
  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="flex items-center space-x-3 px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors"
        onClick={() => onMinimize()}
      >
        <span className="text-2xl">{agent.avatar}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-white truncate">{title}</div>
          <div className="text-xs text-slate-400">
            {status === 'running' && `执行中 ${formatTime(elapsedTime)}`}
            {status === 'completed' && '✅ 已完成'}
            {status === 'failed' && '❌ 失败'}
          </div>
        </div>
        {status === 'running' && (
          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}
      </motion.div>
    );
  }

  // 展开的窗口
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-[420px] bg-slate-900 rounded-xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden"
      style={{ borderColor: agent.color + '40' }}
    >
      {/* 标题栏 */}
      <div
        className="h-11 flex items-center justify-between px-4 border-b border-slate-700"
        style={{ background: `linear-gradient(135deg, ${agent.color}20, transparent)` }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">{agent.avatar}</span>
          <span className="text-sm font-medium text-white">{agent.name}</span>
          {status === 'running' && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs text-cyan-400"
            >
              执行中...
            </motion.span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {/* 状态指示器 */}
          {status === 'running' && (
            <span className="text-xs text-slate-400 mr-2">{formatTime(elapsedTime)}</span>
          )}
          
          {/* 最小化按钮 */}
          <button
            onClick={onMinimize}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="最小化"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
            title="关闭"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 任务标题 */}
      <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <div className="text-sm text-white font-medium truncate">{title}</div>
      </div>

      {/* 进度条 */}
      {status === 'running' && (
        <div className="px-4 py-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>执行进度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: agent.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 执行步骤 */}
      <div className="px-4 py-2 border-b border-slate-700/50">
        <div className="text-xs text-slate-400 mb-2">执行步骤</div>
        <div className="space-y-1">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center space-x-2 text-xs">
              {step.status === 'pending' && (
                <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-slate-600">○</span>
              )}
              {step.status === 'running' && (
                <motion.span 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 text-cyan-400"
                >
                  ◌
                </motion.span>
              )}
              {step.status === 'completed' && (
                <span className="w-4 h-4 text-green-400">✓</span>
              )}
              {step.status === 'failed' && (
                <span className="w-4 h-4 text-red-400">✕</span>
              )}
              <span className={step.status === 'completed' ? 'text-slate-300' : 'text-slate-500'}>
                {step.name}
              </span>
              {step.duration && (
                <span className="text-slate-600">{step.duration}ms</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 执行日志 */}
      <div className="flex-1 overflow-y-auto p-3 min-h-[120px] max-h-[200px] bg-slate-800/30">
        <div className="text-xs text-slate-400 mb-2">执行日志</div>
        <div className="space-y-1 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2">
              <span className="text-slate-500 shrink-0">
                {log.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className={
                log.level === 'success' ? 'text-green-400' :
                log.level === 'warning' ? 'text-yellow-400' :
                log.level === 'error' ? 'text-red-400' :
                'text-slate-300'
              }>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* 结果摘要 */}
      <AnimatePresence>
        {status === 'completed' && result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 bg-green-500/10 border-t border-green-500/20"
          >
            <div className="flex items-center space-x-2 text-green-400 text-sm font-medium mb-1">
              <span>✅</span>
              <span>任务完成</span>
            </div>
            <div className="text-xs text-slate-300 line-clamp-3">{result}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 失败信息 */}
      <AnimatePresence>
        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 bg-red-500/10 border-t border-red-500/20"
          >
            <div className="flex items-center space-x-2 text-red-400 text-sm font-medium">
              <span>❌</span>
              <span>任务执行失败</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default EmbeddedTaskWindow;