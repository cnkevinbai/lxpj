/**
 * RAG文档管理组件
 * 显示文档解析状态、分块可视化、向量索引管理
 */

import React, { useState, useEffect } from 'react';
import { useRAGStore, ragActions } from '../../../store/file-management/rag-store';
import { useFileStore } from '../../../store/file-management';
import { fileService } from '../../../services/file-api';
import { 
  FileInfo, 
  ProcessingStatus, 
  RAGChunk,
  VectorIndexInfo
} from '../../../types/file-management.types';

interface RAGDocumentManagerProps {
  workspaceId: string;
  fileId?: string;
  onSelectFile?: (file: FileInfo) => void;
  className?: string;
}

const RAGDocumentManager: React.FC<RAGDocumentManagerProps> = ({
  workspaceId,
  fileId,
  onSelectFile,
  className = '',
}) => {
  const {
    ragFiles,
    ragFilesLoading,
    currentRAGFileId,
    setCurrentRAGFileId,
    chunks,
    chunksLoading,
    vectorIndex,
    vectorIndexLoading,
    processingStatus,
  } = useRAGStore();

  const { files, setSelectedFileId } = useFileStore();
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);
  const [searchChunks, setSearchChunks] = useState('');
  const [showIndexStats, setShowIndexStats] = useState(false);

  // 加载RAG文件
  useEffect(() => {
    if (workspaceId) {
      ragActions.loadRAGFiles(workspaceId);
    }
  }, [workspaceId]);

  // 加载选中文件的分块
  useEffect(() => {
    if (currentRAGFileId) {
      ragActions.loadChunks(currentRAGFileId);
    }
  }, [currentRAGFileId]);

  // 过滤分块
  const filteredChunks = chunks.filter(chunk =>
    chunk.content.toLowerCase().includes(searchChunks.toLowerCase())
  );

  // 计算索引进度
  const getIndexProgress = (index: VectorIndexInfo | null) => {
    if (!index) return 0;
    return Math.round((index.indexedChunks / index.totalChunks) * 100);
  };

  // 处理文件选择
  const handleFileSelect = (file: FileInfo) => {
    setCurrentRAGFileId(file.id);
    if (onSelectFile) {
      onSelectFile(file);
    }
    setSelectedFileId(file.id);
  };

  // 启动索引
  const handleStartIndexing = async (file: FileInfo) => {
    if (file.processingStatus === 'completed') {
      // 重新索引
      await ragActions.startupIndexing(file.id, workspaceId);
    } else if (file.processingStatus === 'processing') {
      // 等待处理完成
      ragActions.startupIndexing(file.id, workspaceId);
    }
  };

  // 格式化状态
  const getStatusColor = (status: ProcessingStatus): string => {
    const colors: Record<ProcessingStatus, string> = {
      uploaded: 'bg-gray-500',
      queued: 'bg-blue-500',
      processing: 'bg-yellow-500',
      completed: 'bg-green-500',
      failed: 'bg-red-500',
    };
    return colors[status];
  };

  return (
    <div className={`rag-document-manager ${className}`}>
      {/* RAG文档列表 */}
      <div className="document-list">
        <div className="list-header">
          <h3>RAG文档 ({ragFiles.length})</h3>
          <button
            onClick={() => ragActions.loadRAGFiles(workspaceId)}
            disabled={ragFilesLoading}
          >
            {ragFilesLoading ? '刷新中...' : '刷新'}
          </button>
        </div>

        {ragFilesLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
          </div>
        ) : ragFiles.length === 0 ? (
          <div className="empty-state">
            <p>暂无RAG文档</p>
            <p className="hint">上传文件后开始RAG处理</p>
          </div>
        ) : (
          <div className="files-grid">
            {ragFiles.map(file => (
              <div
                key={file.id}
                className={`file-card ${currentRAGFileId === file.id ? 'active' : ''}`}
                onClick={() => handleFileSelect(file)}
              >
                <div className="card-icon">
                  {fileService.getFileIcon(file.fileType, file.mimeType)}
                </div>
                <div className="card-info">
                  <div className="card-title">{file.fileName}</div>
                  <div className="card-meta">
                    <span className={`status-badge ${getStatusColor(file.processingStatus)}`}>
                      {file.processingStatus}
                    </span>
                    <span>{fileService.formatFileSize(file.fileSize)}</span>
                  </div>
                </div>
                {currentRAGFileId === file.id && (
                  <div className="card-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartIndexing(file);
                      }}
                      disabled={
                        file.processingStatus === 'processing' ||
                        (vectorIndex?.status === 'indexing')
                      }
                    >
                      {processingStatus.get(file.id) === 'processing' ? '处理中...' :
                       vectorIndex?.status === 'indexing' ? '索引中...' :
                       file.processingStatus === 'completed' ? '重新索引' : '开始索引'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 分块详情 */}
      {currentRAGFileId && (
        <div className="chunk-details">
          <div className="details-header">
            <h3>分块详情</h3>
            <div className="details-actions">
              {vectorIndex && (
                <>
                  <button
                    onClick={() => setShowIndexStats(!showIndexStats)}
                    className="stats-btn"
                  >
                    索引统计
                  </button>
                  <button
                    onClick={() => ragActions.loadChunks(currentRAGFileId)}
                    disabled={chunksLoading}
                  >
                    {chunksLoading ? '加载中...' : '刷新'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 索引统计面板 */}
          {showIndexStats && vectorIndex && (
            <div className="index-stats">
              <div className="stats-row">
                <span>索引状态：</span>
                <span className={`status-badge ${getStatusColor(vectorIndex.status as any)}`}>
                  {vectorIndex.status}
                </span>
              </div>
              <div className="stats-row">
                <span>向量维度：</span>
                <span>{vectorIndex.dimensions}</span>
              </div>
              <div className="stats-row">
                <span>总分块：</span>
                <span>{vectorIndex.totalChunks}</span>
              </div>
              <div className="stats-row">
                <span>已索引：</span>
                <span>{vectorIndex.indexedChunks}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${getIndexProgress(vectorIndex)}%` }}
                />
              </div>
            </div>
          )}

          {/* 分块搜索 */}
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索分块内容..."
              value={searchChunks}
              onChange={(e) => setSearchChunks(e.target.value)}
            />
          </div>

          {/* 分块列表 */}
          {chunksLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
            </div>
          ) : filteredChunks.length === 0 ? (
            <div className="empty-state">
              <p>暂无分块</p>
              {vectorIndex?.status === 'pending' && (
                <p className="hint">等待向量索引创建...</p>
              )}
            </div>
          ) : (
            <div className="chunks-list">
              {filteredChunks.map(chunk => (
                <div
                  key={chunk.id}
                  className={`chunk-item ${selectedChunkId === chunk.id ? 'active' : ''}`}
                  onClick={() => setSelectedChunkId(chunk.id)}
                >
                  <div className="chunk-header">
                    <span className="chunk-index">Chunk {chunk.chunkIndex}</span>
                    {chunk.metadata.page && (
                      <span className="chunk-page">Page {chunk.metadata.page}</span>
                    )}
                  </div>
                  <div className="chunk-content">
                    {chunk.content.substring(0, 200)}
                    {chunk.content.length > 200 ? '...' : ''}
                  </div>
                  <div className="chunk-footer">
                    <span className="chunk-length">
                      {chunk.content.length} 字符
                    </span>
                    {chunk.vectorIndex !== undefined && (
                      <span className="vector-index">
                        Vector #{chunk.vectorIndex}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 选中分块详情 */}
          {selectedChunkId && (
            <div className="selected-chunk-details">
              <h4>选中分块</h4>
              <div className="chunk-full-content">
                {chunks.find(c => c.id === selectedChunkId)?.content}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 样式 */}
      <style>{`
        .rag-document-manager {
          width: 100%;
        }
        .document-list {
          margin-bottom: 24px;
        }
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .list-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 16px;
        }
        .list-header button {
          padding: 6px 12px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .list-header button:disabled {
          background-color: #9ca3af;
        }
        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .file-card {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .file-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .file-card.active {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }
        .card-icon {
          font-size: 32px;
          margin-bottom: 12px;
          color: #6b7280;
        }
        .card-info {
          margin-bottom: 12px;
        }
        .card-title {
          font-weight: 500;
          color: #1f2937;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          color: white;
        }
        .card-actions {
          text-align: right;
        }
        .card-actions button {
          padding: 6px 12px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .card-actions button:disabled {
          background-color: #f9fafb;
          color: #d1d5db;
        }
        .card-actions button:hover:not(:disabled) {
          background-color: #e5e7eb;
        }
        .chunk-details {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
        }
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .details-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 16px;
        }
        .details-actions {
          display: flex;
          gap: 8px;
        }
        .details-actions button {
          padding: 6px 12px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }
        .details-actions button:disabled {
          background-color: #f9fafb;
          color: #d1d5db;
        }
        .stats-btn {
          background-color: #3b82f6;
          color: white;
        }
        .stats-btn:hover {
          background-color: #2563eb;
        }
        .index-stats {
          background-color: #f9fafb;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .stats-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 13px;
        }
        .stats-row span:last-child {
          color: #6b7280;
          font-weight: 500;
        }
        .progress-bar {
          height: 6px;
          background-color: #e5e7eb;
          border-radius: 3px;
          margin-top: 8px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background-color: #3b82f6;
          transition: width 0.3s ease;
        }
        .search-box {
          margin-bottom: 16px;
        }
        .search-box input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
        }
        .search-box input:focus {
          border-color: #3b82f6;
          outline: none;
        }
        .chunks-list {
          max-height: 400px;
          overflow-y: auto;
        }
        .chunk-item {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .chunk-item:hover {
          background-color: #f9fafb;
        }
        .chunk-item.active {
          background-color: #eff6ff;
          border-left: 3px solid #3b82f6;
        }
        .chunk-header {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 12px;
        }
        .chunk-index,
        .chunk-page {
          padding: 2px 6px;
          background-color: #f3f4f6;
          border-radius: 4px;
        }
        .chunk-content {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .chunk-footer {
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: #9ca3af;
        }
        .selected-chunk-details {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        .selected-chunk-details h4 {
          margin: 0 0 8px 0;
          color: #1f2937;
          font-size: 14px;
        }
        .chunk-full-content {
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 6px;
          font-size: 13px;
          line-height: 1.6;
          white-space: pre-wrap;
          max-height: 200px;
          overflow-y: auto;
        }
        .empty-state {
          text-align: center;
          padding: 40px 0;
          color: #9ca3af;
        }
        .empty-state .hint {
          margin-top: 8px;
          font-size: 14px;
        }
        .loading-state {
          text-align: center;
          padding: 40px 0;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .files-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default RAGDocumentManager;
