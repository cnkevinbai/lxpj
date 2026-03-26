/**
 * 文件上传组件
 * 支持拖拽上传、多文件批量上传、上传进度显示
 */

import React, { useState, useCallback, useRef } from 'react';
import { useFileStore } from '../../../store/file-management';
import { fileService } from '../../../services/file-api';
import { FileType } from '../../../types/file-management.types';

// 扩展 File 类型，添加临时 id
interface UploadFile extends File {
  id: string;
}

// 生成唯一 ID
const generateFileId = (): string => {
  return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface FileUploaderProps {
  workspaceId: string;
  onUploadComplete?: (fileId: string) => void;
  allowedTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number; // bytes
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  workspaceId,
  onUploadComplete,
  allowedTypes = [],
  maxFiles = 10,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  className = '',
}) => {
  const { uploadQueue, addToFileUploadQueue, removeFromFileUploadQueue, updateUploadProgress } = useFileStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 拖拽事件处理
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 允许放置
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  // 文件选择处理
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  }, []);

  // 处理文件
  const processFiles = useCallback((files: File[]) => {
    // 过滤超出大小的文件
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        console.warn(`文件 ${file.name} 太大，最大支持 ${fileService.formatFileSize(maxFileSize)}`);
        return false;
      }
      
      // 如果有限制类型，检查MIME类型
      if (allowedTypes.length > 0) {
        const isValid = allowedTypes.some(type => {
          if (type.includes('/')) {
            return file.type === type || file.type.startsWith(type.split('/')[0] + '/');
          }
          return file.type.startsWith(type);
        });
        if (!isValid) {
          console.warn(`文件 ${file.name} 类型不受支持`);
          return false;
        }
      }
      
      return true;
    });

    // 限制文件数量
    const filesToAdd = [...uploadQueue, ...validFiles];
    if (filesToAdd.length > maxFiles) {
      console.warn(`文件数量超出限制，最多支持 ${maxFiles} 个文件`);
      validFiles.splice(maxFiles - uploadQueue.length);
    }

    validFiles.forEach(file => {
      // 为文件添加临时 ID
      const uploadFile = file as UploadFile;
      uploadFile.id = generateFileId();
      addToFileUploadQueue(uploadFile);
      startUpload(uploadFile);
    });
  }, [uploadQueue, addToFileUploadQueue]);

  // 开始上传
  const startUpload = useCallback(async (file: UploadFile) => {
    setUploadingCount(prev => prev + 1);

    try {
      await fileService.uploadFile(file, workspaceId, {
        onProgress: (progress) => {
          updateUploadProgress(file.id, progress);
        },
        onComplete: (fileInfo) => {
          if (onUploadComplete) {
            onUploadComplete(fileInfo.id);
          }
        },
        onError: (error) => {
          console.error(`上传失败: ${file.name}`, error);
        },
      });
      
      // 上传完成后移除队列
      setTimeout(() => {
        removeFromFileUploadQueue(file.id);
        setUploadingCount(prev => Math.max(0, prev - 1));
      }, 1000);
    } catch (error) {
      console.error(`上传失败: ${file.name}`, error);
      removeFromFileUploadQueue(file.id);
      setUploadingCount(prev => Math.max(0, prev - 1));
    }
  }, [workspaceId, updateUploadProgress, removeFromFileUploadQueue, onUploadComplete]);

  // 取消上传
  const cancelUpload = useCallback((fileId: string) => {
    removeFromFileUploadQueue(fileId);
    setUploadingCount(prev => Math.max(0, prev - 1));
  }, [removeFromFileUploadQueue]);

  // 识别文件类型
  const getFileType = (file: File): FileType => {
    return fileService.identifyFileType(file);
  };

  // 格式化文件大小
  const formatSize = (bytes: number): string => {
    return fileService.formatFileSize(bytes);
  };

  return (
    <div className={`file-uploader ${className} ${isDragging ? 'dragging' : ''}`}>
      {/* 拖拽区域 */}
      <div
        className="upload-dropzone"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="dropzone-content">
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="dropzone-text">
            <p>拖拽文件到此处上传</p>
            <p className="hint">支持多文件批量上传</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="file-input"
            style={{ display: 'none' }}
          />
          <button 
            className="browse-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            选择文件
          </button>
        </div>
      </div>

      {/* 上传进度队列 */}
      {uploadQueue.length > 0 && (
        <div className="upload-queue">
          <div className="queue-header">
            <span>上传队列 ({uploadQueue.length})</span>
            <button onClick={() => useFileStore.getState().clearUploadQueue()}>清除全部</button>
          </div>
          <div className="queue-list">
            {uploadQueue.map((file) => (
              <div key={file.id} className="upload-item">
                <div className="item-info">
                  <div className="file-icon">
                    {fileService.getFileIcon(getFileType(file.file), file.mimeType)}
                  </div>
                  <div className="file-details">
                    <div className="file-name">{file.file.name}</div>
                    <div className="file-size">{formatSize(file.file.size)}</div>
                  </div>
                </div>
                <div className="item-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <div className="progress-text">{file.progress}%</div>
                </div>
                {file.status === 'uploading' && (
                  <button 
                    className="cancel-btn"
                    onClick={() => cancelUpload(file.id)}
                  >
                    取消
                  </button>
                )}
                {file.status === 'completed' && (
                  <div className="status-icon">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 样式 */}
      <style>{`
        .file-uploader {
          width: 100%;
        }
        .file-uploader.dragging .upload-dropzone {
          border-color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
        }
        .upload-dropzone {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #f9fafb;
        }
        .upload-dropzone:hover {
          border-color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.05);
        }
        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .upload-icon {
          color: #6b7280;
        }
        .dropzone-text p {
          margin: 0;
          color: #374151;
          font-size: 14px;
        }
        .dropzone-text .hint {
          color: #9ca3af;
          font-size: 12px;
        }
        .browse-btn {
          padding: 8px 24px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        .browse-btn:hover {
          background-color: #2563eb;
        }
        .upload-queue {
          margin-top: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .queue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
        }
        .queue-header span {
          font-weight: 600;
          color: #374151;
        }
        .queue-header button {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 12px;
        }
        .queue-header button:hover {
          color: #374151;
        }
        .queue-list {
          padding: 12px;
        }
        .upload-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 6px;
          margin-bottom: 8px;
        }
        .upload-item:last-child {
          margin-bottom: 0;
        }
        .item-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .file-icon {
          font-size: 24px;
        }
        .file-details {
          display: flex;
          flex-direction: column;
        }
        .file-name {
          font-weight: 500;
          color: #1f2937;
          font-size: 14px;
        }
        .file-size {
          color: #6b7280;
          font-size: 12px;
        }
        .item-progress {
          width: 120px;
        }
        .progress-bar {
          width: 100%;
          height: 6px;
          background-color: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background-color: #3b82f6;
          transition: width 0.3s ease;
        }
        .progress-text {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }
        .cancel-btn {
          padding: 4px 8px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        .cancel-btn:hover {
          background-color: #dc2626;
        }
        .status-icon {
          color: #10b981;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default FileUploader;
