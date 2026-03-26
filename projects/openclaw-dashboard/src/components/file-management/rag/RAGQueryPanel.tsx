/**
 * RAG问答界面
 * 问题输入、检索结果展示、答案生成、引用来源
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRAGStore } from '../../../store/file-management/rag-store';
import { useFileStore } from '../../../store/file-management';
import { fileService } from '../../../services/file-api';
import { 
  RAGQueryParams,
  SearchResult,
  AnswerResult,
  FileInfo
} from '../../../types/file-management.types';

interface RAGQueryPanelProps {
  workspaceId: string;
  fileId?: string;
  className?: string;
}

const RAGQueryPanel: React.FC<RAGQueryPanelProps> = ({
  workspaceId,
  fileId,
  className = '',
}) => {
  const {
    ragFiles,
    loadRAGFiles,
  } = useRAGStore();

  const { files } = useFileStore();
  const [question, setQuestion] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [showSources, setShowSources] = useState(false);
  const [minSimilarity, setMinSimilarity] = useState(0.7);
  const [topK, setTopK] = useState(5);

  // 加载RAG文件
  useEffect(() => {
    if (workspaceId) {
      loadRAGFiles();
    }
  }, [workspaceId]);

  // 执行查询
  const handleQuery = async () => {
    if (!question.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setAnswerResult(null);

    try {
      const result = await fileService.ragQuery(
        workspaceId,
        question,
        {
          fileId,
          topK,
          minSimilarity,
        }
      );

      setSearchResults(result.results);
      setAnswerResult(result.answer);
    } catch (error) {
      console.error('[RAGQuery] Query failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  // 格式化相似度
  const formatSimilarity = (score: number): string => {
    return (score * 100).toFixed(1) + '%';
  };

  // 查看上下文
  const viewContext = (result: SearchResult) => {
    //todo: open context modal
    console.log('View context:', result);
  };

  // 格式化文件名
  const getFileName = (fileId: string): string => {
    const file = files.find(f => f.id === fileId);
    return file?.fileName || 'Unknown File';
  };

  return (
    <div className={`rag-query-panel ${className}`}>
      {/* 问题输入区 */}
      <div className="query-input">
        <div className="input-header">
          <h3>开始提问</h3>
          <div className="query-options">
            <div className="option-group">
              <label>相似度阈值</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={minSimilarity}
                onChange={(e) => setMinSimilarity(parseFloat(e.target.value))}
              />
              <span>{(minSimilarity * 100).toFixed(0)}%</span>
            </div>
            <div className="option-group">
              <label>结果数量</label>
              <input
                type="number"
                min="1"
                max="20"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="input-container">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题..."
            disabled={isSearching}
            rows={3}
          />
          <button
            className="send-btn"
            onClick={handleQuery}
            disabled={isSearching || !question.trim()}
          >
            {isSearching ? (
              <span className="loading-indicator">
                <span className="spinner"></span>
                检索中...
              </span>
            ) : (
              '发送 🚀'
            )}
          </button>
        </div>
      </div>

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h3>检索结果 ({searchResults.length})</h3>
            <button
              className="toggle-btn"
              onClick={() => setShowSources(!showSources)}
            >
              {showSources ? '隐藏' : '显示'}引用来源
            </button>
          </div>

          <div className="results-list">
            {searchResults.map((result, index) => (
              <div key={result.chunkId} className="result-item">
                <div className="result-score">
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${Math.max(result.similarityScore * 100, 10)}%`,
                        backgroundColor: result.similarityScore > 0.8 ? '#10b981' :
                                        result.similarityScore > 0.6 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  <span className="score-text">{formatSimilarity(result.similarityScore)}</span>
                </div>

                <div className="result-content">
                  {result.content.substring(0, 300)}
                  {result.content.length > 300 ? '...' : ''}
                </div>

                <div className="result-meta">
                  <span className="result-file">{getFileName(result.fileId)}</span>
                  {result.metadata.page && (
                    <span className="result-page">Page {result.metadata.page}</span>
                  )}
                </div>

                <div className="result-actions">
                  <button
                    className="view-context-btn"
                    onClick={() => viewContext(result)}
                  >
                    查看上下文
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI答案 */}
      {answerResult && (
        <div className="ai-answer">
          <div className="answer-header">
            <h3>AI回答</h3>
            <span className="model-tag">{answerResult.modelUsed}</span>
          </div>

          <div className="answer-content">
            {answerResult.answer}
          </div>

          {/* 引用来源 */}
          {showSources && answerResult.sources.length > 0 && (
            <div className="sources-section">
              <h4>引用来源 ({answerResult.sources.length})</h4>
              <div className="sources-list">
                {answerResult.sources.map((source, index) => (
                  <div key={source.chunkId} className="source-item">
                    <div className="source-header">
                      <span className="source-file">{getFileName(source.fileId)}</span>
                      {source.similarityScore && (
                        <span className="source-score">
                          相似度: {formatSimilarity(source.similarityScore)}
                        </span>
                      )}
                    </div>
                    <div className="source-content">
                      {source.content.substring(0, 200)}
                      {source.content.length > 200 ? '...' : ''}
                    </div>
                    {source.page && (
                      <div className="source-page">Page {source.page}</div>
                    )}
                    <button
                      className="view-source-btn"
                      onClick={() => viewContext(source as any)}
                    >
                      完整内容
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="answer-stats">
            <span className="tokens-info">
              Tokens: {answerResult.tokensUsed}
            </span>
          </div>
        </div>
      )}

      {/* 样式 */}
      <style>{`
        .rag-query-panel {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }
        .query-input {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .input-header {
          margin-bottom: 16px;
        }
        .input-header h3 {
          margin: 0 0 12px 0;
          color: #1f2937;
          font-size: 16px;
        }
        .query-options {
          display: flex;
          gap: 24px;
        }
        .option-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .option-group label {
          font-size: 12px;
          color: #6b7280;
        }
        .option-group input[type="range"] {
          width: 120px;
          cursor: pointer;
        }
        .option-group input[type="number"] {
          width: 60px;
          padding: 6px 8px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
        }
        .input-container {
          position: relative;
        }
        .input-container textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
          outline: none;
        }
        .input-container textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        .send-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          padding: 8px 20px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .send-btn:hover:not(:disabled) {
          background-color: #2563eb;
        }
        .send-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
        .loading-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .search-results {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .results-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 16px;
        }
        .toggle-btn {
          padding: 6px 12px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .toggle-btn:hover {
          background-color: #e5e7eb;
        }
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .result-item {
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background-color: #f9fafb;
        }
        .result-score {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .score-bar {
          flex: 1;
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }
        .score-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .score-text {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          min-width: 60px;
        }
        .result-content {
          color: #374151;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .result-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 12px;
        }
        .result-file,
        .result-page {
          padding: 2px 8px;
          background-color: #f3f4f6;
          border-radius: 12px;
        }
        .result-actions {
          display: flex;
          justify-content: flex-end;
        }
        .view-context-btn {
          padding: 6px 12px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .view-context-btn:hover {
          background-color: #2563eb;
        }
        .ai-answer {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
        }
        .answer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .answer-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 16px;
        }
        .model-tag {
          padding: 4px 12px;
          background-color: #10b981;
          color: white;
          border-radius: 12px;
          font-size: 11px;
        }
        .answer-content {
          color: #1f2937;
          line-height: 1.8;
          white-space: pre-wrap;
          margin-bottom: 24px;
        }
        .sources-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }
        .sources-section h4 {
          margin: 0 0 16px 0;
          color: #374151;
          font-size: 14px;
        }
        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .source-item {
          padding: 12px;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }
        .source-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .source-file {
          font-weight: 500;
          color: #1f2937;
          font-size: 13px;
        }
        .source-score {
          font-size: 11px;
          color: #6b7280;
        }
        .source-content {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 8px;
          white-space: pre-wrap;
        }
        .source-page {
          font-size: 11px;
          color: #9ca3af;
        }
        .view-source-btn {
          padding: 4px 10px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
        }
        .view-source-btn:hover {
          background-color: #e5e7eb;
        }
        .answer-stats {
          display: flex;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        .tokens-info {
          color: #6b7280;
          font-size: 12px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .query-options {
            flex-direction: column;
            gap: 12px;
          }
          .option-group {
            flex-direction: row;
            align-items: center;
          }
          .option-group input[type="range"] {
            width: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default RAGQueryPanel;
