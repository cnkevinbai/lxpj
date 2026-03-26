import React, { useState } from 'react';

interface SessionSummaryProps {
  summary?: string;
  isGenerating?: boolean;
  onGenerate?: () => void;
}

export function SessionSummary({
  summary,
  isGenerating,
  onGenerate,
}: SessionSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  // 解析 summary - 可能是字符串或对象
  const parseSummary = (s: any): string => {
    if (!s) return '';
    if (typeof s === 'string') return s;
    if (typeof s === 'object') {
      // 如果是对象，提取 summaryText 或格式化显示
      if (s.summaryText) return s.summaryText;
      if (s.mainTopics || s.keyDecisions || s.pendingTasks) {
        const parts: string[] = [];
        // 过滤空值
        const topics = (s.mainTopics || []).filter((t: string) => t && t.trim());
        const decisions = (s.keyDecisions || []).filter((d: string) => d && d.trim());
        const tasks = (s.pendingTasks || []).filter((t: string) => t && t.trim());
        
        if (topics.length) parts.push(`📌 主要话题: ${topics.join(', ')}`);
        if (decisions.length) parts.push(`✅ 关键决策: ${decisions.join(', ')}`);
        if (tasks.length) parts.push(`📋 待办事项: ${tasks.join(', ')}`);
        
        return parts.join('\n') || '摘要生成中，暂无内容...';
      }
      return JSON.stringify(s);
    }
    return String(s);
  };

  const summaryStr = parseSummary(summary);
  
  if (!summaryStr && !isGenerating) {
    return null;
  }

  if (isGenerating) {
    return (
      <div className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center gap-2 animate-pulse">
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        生成摘要中...
      </div>
    );
  }

  if (summaryStr) {
    const displayText = expanded ? summaryStr : summaryStr.slice(0, 100);
    const isTruncated = summaryStr.length > 100;

    return (
      <div className="px-4 py-3 bg-cyan-500/10 border-b border-cyan-500/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-cyan-400">会话摘要</span>
              <span className="text-xs text-cyan-500/60">
                {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="text-sm text-cyan-200/90 leading-relaxed mb-2">
              {displayText}
              {isTruncated && !expanded && '...'}
            </div>
            {isTruncated && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {expanded ? '收起' : '展开'}
              </button>
            )}
            {onGenerate && (
              <button
                onClick={onGenerate}
                className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重新生成
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default SessionSummary;
