/**
 * 多模态预览组件
 * 支持图片预览、多模态分析结果展示
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fileService } from '../../../services/file-api';
import { useFileStore } from '../../../store/file-management';
import { FileInfo, AnalysisResult, MultimodalAnalysisParams } from '../../../types/file-management.types';

interface MultimodalPreviewProps {
  fileId: string;
  showAnalysis?: boolean;
  onAnalyze?: (params: MultimodalAnalysisParams) => void;
  onClose?: () => void;
  className?: string;
}

const MultimodalPreview: React.FC<MultimodalPreviewProps> = ({
  fileId,
  showAnalysis = true,
  onAnalyze,
  onClose,
  className = '',
}) => {
  const { files } = useFileStore();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const fileContentRef = useRef<HTMLDivElement>(null);

  // 加载文件信息
  useEffect(() => {
    const loadFileInfo = async () => {
      try {
        const file = files.find(f => f.id === fileId);
        if (file) {
          setFileInfo(file);
          setImageSrc(fileService.getFilePreviewUrl(file.id));
        } else {
          // fallback
          const loadedFile = await fileService.getFileById(fileId);
          setFileInfo(loadedFile);
          setImageSrc(fileService.getFilePreviewUrl(loadedFile.id));
        }
      } catch (error) {
        console.error('Failed to load file info:', error);
      }
    };

    loadFileInfo();
  }, [fileId, files]);

  // 加载分析结果
  useEffect(() => {
    if (fileInfo?.id && showAnalysis) {
      const loadAnalysis = async () => {
        try {
          const result = await fileService.getAnalysisResult(fileInfo.id);
          if (result) {
            setAnalysisResult(result);
          }
        } catch (error) {
          console.error('Failed to load analysis result:', error);
        }
      };

      loadAnalysis();
    }
  }, [fileInfo, showAnalysis]);

  // 重新分析
  const handleAnalyze = useCallback(async () => {
    if (!fileInfo?.id) return;

    setIsAnalyzing(true);
    try {
      await fileService.startMultimodalAnalysis(fileInfo.id, {
        prompt: userPrompt || undefined,
        onResult: (result) => {
          setAnalysisResult(result);
        },
      });

      // 等待分析完成
      setTimeout(() => {
        loadAnalysisResult();
      }, 1000);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [fileInfo, userPrompt]);

  const loadAnalysisResult = async () => {
    if (fileInfo?.id) {
      try {
        const result = await fileService.getAnalysisResult(fileInfo.id);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Failed to load analysis:', error);
      }
    }
  };

  // 图片操作
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.2));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  // 下载
  const handleDownload = () => {
    if (fileInfo?.id) {
      fileService.downloadFile(fileInfo.id);
    }
  };

  if (!fileInfo) {
    return (
      <div className={`multimodal-preview ${className}`}>
        <div className="loading-state">加载中...</div>
        <style>{`
          .multimodal-preview {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }
          .loading-state {
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  const isImage = fileInfo.mimeType?.startsWith('image/');
  const isPDF = fileInfo.mimeType === 'application/pdf';
  const hasAnalysis = !!analysisResult;

  return (
    <div className={`multimodal-preview ${className}`}>
      {/* 关闭按钮 */}
      {onClose && (
        <button className="close-btn" onClick={onClose}>×</button>
      )}

      <div className="preview-content">
        {/* 图片预览区 */}
        {(isImage || isPDF) && (
          <div className="image-preview" style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}>
            {isImage && (
              <img
                src={imageSrc}
                alt={fileInfo.fileName}
                style={{ maxWidth: '100%', maxHeight: '600px' }}
              />
            )}
            {isPDF && (
              <div className="pdf-preview">
                <div className="placeholder">
                  <span className="placeholder-icon">📄</span>
                  <p>PDF预览</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 非图片/PDF文件 */}
        {!isImage && !isPDF && (
          <div className="file-preview">
            <div className="preview-icon">
              {fileService.getFileIcon(fileInfo.fileType, fileInfo.mimeType)}
            </div>
            <div className="preview-info">
              <h3>{fileInfo.fileName}</h3>
              <p>{fileInfo.mimeType}</p>
              <p>{fileService.formatFileSize(fileInfo.fileSize)}</p>
            </div>
          </div>
        )}

        {/* 分析结果")
        {showAnalysis && (
          <div
            className={`analysis-panel ${showAnalysisPanel ? 'expanded' : ''}`}
            onTransitionEnd={() => {
              if (!showAnalysisPanel && fileContentRef.current) {
                fileContentRef.current.style.display = 'none';
              }
            }}
          >
            <div className="panel-header">
              <h3>多模态分析结果</h3>
              <div className="panel-actions">
                <button
                  className="analyze-btn"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? '分析中...' : '重新分析'}
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    if (!showAnalysisPanel && fileContentRef.current) {
                      fileContentRef.current.style.display = 'block';
                      setTimeout(() => {
                        fileContentRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }, 10);
                    }
                    setShowAnalysisPanel(!showAnalysisPanel);
                  }}
                >
                  {showAnalysisPanel ? '收起' : '展开'}
                </button>
              </div>
            </div>

            <div className="panel-body">
              {hasAnalysis ? (
                <div className="analysis-result">
                  <div className="result-header">
                    <span className="model-tag">{analysisResult.modelUsed}</span>
                    <span className="tokens-info">{analysisResult.tokensUsed} tokens</span>
                  </div>
                  <div className="result-content">
                    {analysisResult.analysisResult}
                  </div>
                  {analysisResult.rawAnalysis && (
                    <div className="raw-data">
                      <details>
                        <summary>原始JSON数据</summary>
                        <pre>{JSON.stringify(analysisResult.rawAnalysis, null, 2)}</pre>
                      </details>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-analysis">
                  <div className="placeholder-icon">🧠</div>
                  <p>暂无分析结果</p>
                  <input
                    type="text"
                    placeholder="输入分析提示（可选）"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="analysis-prompt-input"
                  />
                  <button
                    className="start-analyze-btn"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    开始分析
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
         */}

        {/* 分析结果 */}
        {showAnalysis && (
          <div className={`analysis-panel ${showAnalysisPanel ? 'expanded' : ''}`}>
            <div className="panel-header">
              <h3>多模态分析结果</h3>
              <div className="panel-actions">
                <button
                  className="analyze-btn"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? '分析中...' : '重新分析'}
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    if (!showAnalysisPanel && fileContentRef.current) {
                      fileContentRef.current.style.display = 'block';
                    }
                    setShowAnalysisPanel(!showAnalysisPanel);
                  }}
                >
                  {showAnalysisPanel ? '收起' : '展开'}
                </button>
              </div>
            </div>

            <div ref={fileContentRef} className={`panel-body ${showAnalysisPanel ? '' : 'hidden'}`}>
              {hasAnalysis ? (
                <div className="analysis-result">
                  <div className="result-header">
                    <span className="model-tag">{analysisResult!.modelUsed}</span>
                    <span className="tokens-info">{analysisResult!.tokensUsed} tokens</span>
                  </div>
                  <div className="result-content">
                    {analysisResult!.analysisResult}
                  </div>
                  {analysisResult!.rawAnalysis && (
                    <div className="raw-data">
                      <details>
                        <summary>原始JSON数据</summary>
                        <pre>{JSON.stringify(analysisResult!.rawAnalysis, null, 2)}</pre>
                      </details>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-analysis">
                  <div className="placeholder-icon">🧠</div>
                  <p>暂无分析结果</p>
                  <input
                    type="text"
                    placeholder="输入分析提示（可选）"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="analysis-prompt-input"
                  />
                  <button
                    className="start-analyze-btn"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    开始分析
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 操作栏 */}
      <div className="toolbar">
        {isImage && (
          <>
            <button className="toolbar-btn" onClick={handleZoomOut} title="缩小">
              🔍−
            </button>
            <button className="toolbar-btn" onClick={handleZoomIn} title="放大">
              🔍+
            </button>
            <button className="toolbar-btn" onClick={handleRotate} title="旋转">
              🔄
            </button>
            <button className="toolbar-btn" onClick={handleReset} title="重置">
              🔄Reset
            </button>
          </>
        )}
        <button className="toolbar-btn" onClick={handleDownload} title="下载">
          ⬇️下载
        </button>
      </div>

      {/* 样式 */}
      <style>{`
        .multimodal-preview {
          position: relative;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border: none;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        .close-btn:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
        .preview-content {
          position: relative;
          margin-bottom: 16px;
        }
        .image-preview {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        .image-preview img {
          display: block;
          max-width: 100%;
          max-height: 600px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .pdf-preview {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #6b7280;
        }
        .placeholder-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .file-preview {
          text-align: center;
          padding: 40px;
          background-color: #f9fafb;
          border-radius: 8px;
        }
        .preview-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .preview-info h3 {
          margin: 0 0 8px 0;
          color: #1f2937;
        }
        .preview-info p {
          margin: 4px 0;
          color: #6b7280;
          font-size: 14px;
        }
        .analysis-panel {
          margin-top: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .analysis-panel.expanded {
          max-height: none;
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
        }
        .panel-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 14px;
          font-weight: 600;
        }
        .panel-actions {
          display: flex;
          gap: 8px;
        }
        .analyze-btn {
          padding: 6px 12px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .analyze-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
        .analyze-btn:hover:not(:disabled) {
          background-color: #2563eb;
        }
        .toggle-btn {
          padding: 6px 12px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-btn:hover {
          background-color: #e5e7eb;
        }
        .panel-body {
          padding: 16px;
          max-height: 300px;
          overflow-y: auto;
        }
        .panel-body.hidden {
          display: none;
        }
        .analysis-result {
          font-size: 14px;
          line-height: 1.6;
        }
        .result-header {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .model-tag {
          padding: 2px 8px;
          background-color: #3b82f6;
          color: white;
          border-radius: 12px;
          font-size: 11px;
        }
        .tokens-info {
          color: #6b7280;
          font-size: 12px;
        }
        .result-content {
          white-space: pre-wrap;
          color: #1f2937;
        }
        .raw-data {
          margin-top: 16px;
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 4px;
        }
        .raw-data pre {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
          max-height: 200px;
          overflow-y: auto;
        }
        .no-analysis {
          text-align: center;
          padding: 40px 0;
        }
        .placeholder-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        .analysis-prompt-input {
          width: 100%;
          padding: 8px 12px;
          margin: 16px 0;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
        }
        .start-analyze-btn {
          padding: 8px 24px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }
        .start-analyze-btn:disabled {
          background-color: #9ca3af;
        }
        .toolbar {
          display: flex;
          gap: 8px;
          justify-content: center;
          padding: 12px;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .toolbar-btn {
          padding: 8px 12px;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toolbar-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }
        .file-info {
          margin-top: 8px;
          color: #6b7280;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default MultimodalPreview;
