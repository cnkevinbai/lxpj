import React from 'react';

interface CompressionIndicatorProps {
  compressed?: boolean;
  compressionSummary?: string;
  isCompressing?: boolean;
  onCompress?: () => void;
}

export function CompressionIndicator({
  compressed,
  compressionSummary,
  isCompressing,
  onCompress,
}: CompressionIndicatorProps) {
  if (!compressed && !isCompressing) {
    return null;
  }

  if (isCompressing) {
    return (
      <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20 text-blue-400 text-xs flex items-center justify-center gap-2 animate-pulse">
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        压缩中...
      </div>
    );
  }

  if (compressed && compressionSummary) {
    return (
      <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-amber-400">上下文已压缩</span>
              <span className="text-xs text-amber-500/60">
                {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-amber-200/80 line-clamp-2">
              {compressionSummary}
            </p>
            {onCompress && (
              <button
                onClick={onCompress}
                className="mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                重新压缩
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default CompressionIndicator;
