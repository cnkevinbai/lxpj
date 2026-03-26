/**
 * 全局搜索面板 - 快捷键激活
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchService, SearchResult } from '../../services/search';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
}

export function SearchPanel({ isOpen, onClose, onSelect }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 搜索
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      // 显示命令列表
      setResults(searchService.getCommands());
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchService.search(searchQuery);
      setResults(searchResults);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 输入变化
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // 聚焦输入框
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults(searchService.getCommands());
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // 键盘导航
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelect(results[selectedIndex]);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [results, selectedIndex, onSelect, onClose]);

  // 结果类型图标颜色
  const typeColors: Record<string, string> = {
    session: '#06B6D4',
    message: '#8B5CF6',
    task: '#F59E0B',
    file: '#10B981',
    agent: '#EC4899',
    setting: '#6366F1',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* 搜索面板 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div
              className="rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              style={{ background: '#0F172A' }}
            >
              {/* 搜索输入 */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="搜索会话、消息、文件、任务... (↑↓ 导航, Enter 选择)"
                  className="flex-1 bg-transparent text-white text-lg outline-none placeholder-slate-500"
                />
                {loading && (
                  <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              {/* 搜索结果 */}
              <div className="max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    <p className="text-2xl mb-2">🔍</p>
                    <p>没有找到相关结果</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <motion.button
                        key={`${result.type}-${result.id}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          onSelect(result);
                          onClose();
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                          ${index === selectedIndex 
                            ? 'bg-cyan-500/10' 
                            : 'hover:bg-white/5'
                          }
                        `}
                      >
                        {/* 图标 */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                          style={{ backgroundColor: `${typeColors[result.type]}20` }}
                        >
                          {result.icon}
                        </div>

                        {/* 内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">
                            {result.title}
                          </div>
                          {result.description && (
                            <div className="text-sm text-slate-400 truncate">
                              {result.description}
                            </div>
                          )}
                        </div>

                        {/* 类型标签 */}
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{ 
                            backgroundColor: `${typeColors[result.type]}20`,
                            color: typeColors[result.type],
                          }}
                        >
                          {result.type}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* 底部提示 */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↑↓</kbd>
                    导航
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Enter</kbd>
                    选择
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Esc</kbd>
                    关闭
                  </span>
                </div>
                <span>Ctrl+K 打开搜索</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchPanel;