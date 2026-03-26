/**
 * 文件列表组件
 * 支持列表/网格视图切换、搜索筛选、文件操作
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useFileStore, useFilteredFiles, fileActions } from '../../../store/file-management';
import { fileService } from '../../../services/file-api';
import { 
  FileInfo, 
  ProcessingStatus
} from '../../../types/file-management.types';

interface FileListProps {
  workspaceId: string;
  showViewToggle?: boolean;
  showSearch?: boolean;
  onSelectFile?: (file: FileInfo) => void;
  onFileAction?: (action: 'delete' | 'download' | 'preview', file: FileInfo) => void;
  className?: string;
}

const FileList: React.FC<FileListProps> = ({
  workspaceId,
  showViewToggle = true,
  showSearch = true,
  onSelectFile,
  onFileAction,
  className = '',
}) => {
  const { 
    files, 
    filesLoading, 
    viewMode, 
    setViewMode, 
    filters, 
    setFilters, 
    selectedFileId,
    setSelectedFileId,
    currentWorkspaceId
  } = useFileStore();
  
  const [processingListeners, setProcessingListeners] = useState<Map<string, () => void>>(new Map());
  const [showFileTypeFilter, setShowFileTypeFilter] = useState(false);

  // 加载文件列表
  useEffect(() => {
    if (workspaceId && currentWorkspaceId !== workspaceId) {
      fileActions.loadRAGFiles(workspaceId);
    }
  }, [workspaceId]);

  // 监听处理状态
  useEffect(() => {
    const newListeners = new Map(processingListeners);

    files.forEach(file => {
      if (!newListeners.has(file.id)) {
        const unsubscribe = fileService.onProcessingStatus(file.id, (status) => {
          // 触发文件列表刷新
          useFileStore.getState().refreshFiles();
        });
        newListeners.set(file.id, unsubscribe);
      }
    });

    // 清理已删除文件的监听
    files.forEach(file => {
      if (!newListeners.has(file.id)) {
        processingListeners.get(file.id)?.();
        newListeners.delete(file.id);
      }
    });

    setProcessingListeners(newListeners);

    return () => {
      newListeners.forEach(unsubscribe => unsubscribe());
    };
  }, [files]);

  // 过滤后的文件
  const filteredFiles = useFilteredFiles();

  // 处理文件操作
  const handleFileAction = (action: 'delete' | 'download' | 'preview', file: FileInfo) => {
    if (action === 'delete') {
      if (window.confirm(`确定要删除文件 ${file.fileName} 吗？`)) {
        fileActions.deleteFile(file.id);
      }
    } else if (action === 'download') {
      fileService.downloadFile(file.id);
    } else if (action === 'preview') {
      if (onSelectFile) {
        onSelectFile(file);
      }
    }

    if (onFileAction) {
      onFileAction(action, file);
    }
  };

  // 格式化文件大小
  const formatSize = (bytes: number): string => {
    return fileService.formatFileSize(bytes);
  };

  // 格式化时间
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取状态标签颜色
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

  // 文件类型过滤器
  const fileTypes = useMemo(() => {
    const types = new Set<string>();
    files.forEach(file => {
      if (file.mimeType) {
        const type = file.mimeType.split('/')[0];
        types.add(type);
      }
    });
    return Array.from(types);
  }, [files]);

  return (
    <div className={`file-list ${className}`}>
      {/* 工具栏 */}
      <div className="toolbar">
        <div className="toolbar-left">
          {showSearch && (
            <div className="search-box">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="搜索文件..."
                value={filters.searchQuery || ''}
                onChange={(e) => setFilters({ searchQuery: e.target.value })}
                className="search-input"
              />
            </div>
          )}

          {showFileTypeFilter && fileTypes.length > 0 && (
            <div className="filter-tags">
              <button 
                onClick={() => setFilters({ fileType: undefined })}
                className={`tag ${!filters.fileType ? 'active' : ''}`}
              >
                全部
              </button>
              {fileTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilters({ fileType: type })}
                  className={`tag ${filters.fileType === type ? 'active' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="toolbar-right">
          {showViewToggle && (
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('list')}
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                title="列表视图"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="网格视图"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>
          )}
          <div className="file-count">
            {filteredFiles.length} 个文件
          </div>
        </div>
      </div>

      {/* 文件列表 */}
      {filesLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p>暂无文件</p>
          <p className="hint">上传文件以开始使用</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="file-list-view">
          <div className="list-header">
            <div className="header-name">文件名</div>
            <div className="header-size">大小</div>
            <div className="header-date">上传时间</div>
            <div className="header-status">状态</div>
            <div className="header-actions">操作</div>
          </div>
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className={`file-item ${selectedFileId === file.id ? 'selected' : ''}`}
              onClick={() => setSelectedFileId(file.id === selectedFileId ? null : file.id)}
            >
              <div className="item-name">
                <div className="file-icon">
                  {fileService.getFileIcon(file.fileType, file.mimeType)}
                </div>
                <div className="file-info">
                  <div className="file-name">{file.fileName}</div>
                  <div className="file-meta">{file.mimeType || '未知类型'}</div>
                </div>
              </div>
              <div className="item-size">{formatSize(file.fileSize)}</div>
              <div className="item-date">{formatTime(file.uploadedAt)}</div>
              <div className="item-status">
                <span className={`status-badge ${getStatusColor(file.processingStatus)}`}>
                  {file.processingStatus}
                </span>
              </div>
              <div className="item-actions">
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileAction('preview', file);
                  }}
                  title="预览"
                >
                  👁️
                </button>
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileAction('download', file);
                  }}
                  title="下载"
                >
                  ⬇️
                </button>
                <button
                  className="action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileAction('delete', file);
                  }}
                  title="删除"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="file-grid-view">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className={`file-card ${selectedFileId === file.id ? 'selected' : ''}`}
              onClick={() => setSelectedFileId(file.id === selectedFileId ? null : file.id)}
            >
              <div className="card-icon">
                {fileService.getFileIcon(file.fileType, file.mimeType)}
              </div>
              <div className="card-info">
                <div className="card-title">{file.fileName}</div>
                <div className="card-meta">
                  <span>{formatSize(file.fileSize)}</span>
                  <span>{formatTime(file.uploadedAt)}</span>
                </div>
              </div>
              <div className="card-footer">
                <span className={`status-badge ${getStatusColor(file.processingStatus)}`}>
                  {file.processingStatus}
                </span>
                <button
                  className="card-menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    //todo: show menu
                  }}
                >
                  ⋮
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 样式 */}
      <style>{`
        .file-list {
          width: 100%;
        }
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
        }
        .toolbar-left {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .search-box {
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }
        .search-input {
          padding: 8px 12px 8px 36px;
          width: 200px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
        }
        .search-input:focus {
          border-color: #3b82f6;
        }
        .filter-tags {
          display: flex;
          gap: 8px;
        }
        .tag {
          padding: 4px 12px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tag:hover {
          background-color: #e5e7eb;
        }
        .tag.active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .view-toggle {
          display: flex;
          gap: 4px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }
        .toggle-btn {
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }
        .toggle-btn:hover {
          background-color: #f3f4f6;
        }
        .toggle-btn.active {
          background-color: #3b82f6;
          color: white;
        }
        .file-count {
          color: #6b7280;
          font-size: 14px;
        }
        .file-list-view {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .list-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 120px;
          padding: 12px 16px;
          background-color: #f3f4f6;
          font-weight: 600;
          color: #374151;
          font-size: 12px;
        }
        .file-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 120px;
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .file-item:hover {
          background-color: #f9fafb;
        }
        .file-item.selected {
          background-color: #eff6ff;
        }
        .item-name {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .file-icon {
          font-size: 20px;
        }
        .file-info {
          display: flex;
          flex-direction: column;
        }
        .file-name {
          font-weight: 500;
          color: #1f2937;
          font-size: 14px;
        }
        .file-meta {
          color: #6b7280;
          font-size: 12px;
        }
        .item-size,
        .item-date,
        .item-status {
          color: #6b7280;
          font-size: 12px;
        }
        .item-actions {
          display: flex;
          gap: 4px;
          justify-content: flex-end;
        }
        .action-btn {
          width: 32px;
          height: 32px;
          padding: 0;
          border: none;
          background-color: transparent;
          color: #6b7280;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .action-btn:hover {
          background-color: #e5e7eb;
          color: #374151;
        }
        .action-btn.delete:hover {
          background-color: #fef2f2;
          color: #ef4444;
        }
        .file-grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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
          border-color: #3b82f6;
        }
        .file-card.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }
        .card-icon {
          font-size: 48px;
          margin-bottom: 12px;
          text-align: center;
        }
        .card-info {
          margin-bottom: 12px;
        }
        .card-title {
          font-weight: 500;
          color: #1f2937;
          font-size: 14px;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-meta {
          display: flex;
          justify-content: space-between;
          color: #6b7280;
          font-size: 12px;
        }
        .card-footer {
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
        .card-menu {
          padding: 4px 8px;
          border: none;
          background-color: transparent;
          color: #6b7280;
          cursor: pointer;
          font-size: 16px;
        }
        .card-menu:hover {
          color: #1f2937;
        }
        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
          color: #9ca3af;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        .empty-icon {
          color: #d1d5db;
          margin-bottom: 16px;
        }
        .empty-state p {
          margin: 0;
        }
        .empty-state .hint {
          margin-top: 8px;
          font-size: 14px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .list-header,
          .file-item {
            grid-template-columns: 1fr 80px;
          }
          .item-date,
          .item-status {
            display: none;
          }
          .file-grid-view {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default FileList;
