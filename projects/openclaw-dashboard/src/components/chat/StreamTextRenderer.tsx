/**
 * 流式文本渲染器 - 逐字显示效果
 * 
 * 支持：
 * - 打字机效果
 * - Markdown 实时渲染
 * - 流畅的字符显示
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamTextRendererProps {
  content: string;
  isStreaming?: boolean;
  speed?: number; // 每个字符的显示间隔（毫秒）
  onComplete?: () => void;
  className?: string;
}

export function StreamTextRenderer({
  content,
  isStreaming = false,
  speed = 20,
  onComplete,
  className = '',
}: StreamTextRendererProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastLengthRef = useRef(0);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // 清理动画
  const clearAnimation = useCallback(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // 打字机效果
  useEffect(() => {
    if (isStreaming) {
      // 流式模式：直接追加新内容
      const newContent = content.slice(displayedContent.length);
      if (newContent) {
        // 使用 requestAnimationFrame 确保流畅
        requestAnimationFrame(() => {
          setDisplayedContent(prev => content);
        });
      }
    } else if (content && content !== displayedContent && !isAnimating) {
      // 非流式模式：打字机效果
      setIsAnimating(true);
      let currentIndex = displayedContent.length;

      clearAnimation();
      animationRef.current = setInterval(() => {
        if (currentIndex < content.length) {
          // 批量添加字符，提高性能
          const batchSize = Math.min(3, content.length - currentIndex);
          currentIndex += batchSize;
          setDisplayedContent(content.slice(0, currentIndex));
          
          // 滚动到光标位置
          cursorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          clearAnimation();
          setIsAnimating(false);
          onComplete?.();
        }
      }, speed);
    }

    return clearAnimation;
  }, [content, isStreaming, speed, clearAnimation, onComplete]);

  // 内容变化时同步
  useEffect(() => {
    if (!isStreaming && content && !isAnimating) {
      setDisplayedContent(content);
    }
  }, []);

  return (
    <div className={`stream-text-renderer ${className}`}>
      <div className="markdown-content">
        <ReactMarkdown>{displayedContent || content}</ReactMarkdown>
      </div>
      
      {/* 流式光标 */}
      {(isStreaming || isAnimating) && (
        <span
          ref={cursorRef}
          className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"
          style={{ 
            verticalAlign: 'middle',
            animation: 'blink 1s infinite'
          }}
        />
      )}
      
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default StreamTextRenderer;