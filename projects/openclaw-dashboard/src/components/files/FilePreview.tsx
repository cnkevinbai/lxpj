import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

// 设置 PDF.js worker
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FilePreviewProps {
  fileUrl: string;
  fileType: string;
  fileName: string;
  onClose: () => void;
  onDownload: () => void;
}

export function FilePreview({
  fileUrl,
  fileType,
  fileName,
  onClose,
  onDownload,
}: FilePreviewProps) {
  const [pdfError, setPdfError] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [htmlError, setHtmlError] = useState(false);
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  // 加载解析的数据（用于文本、PDF、Word等）
  useEffect(() => {
    // 模拟加载解析数据
    // 在实际应用中，这里应该调用 API 获取解析后的内容
    const simulateParse = async () => {
      try {
        // 获取文件类型
        const type = fileType.split('/')[0];

        if (type === 'text' || fileType === 'application/pdf' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // 对于文本、PDF、Word 文件，显示解析后的文本
          setParsedText(`文件名: ${fileName}\n类型: ${fileType}\n\n这是文件的解析内容预览。\n由于后端解析功能尚未完全集成，此处显示模拟数据。\n\n您可以点击"下载"按钮下载原始文件。`);
        }
      } catch (error) {
        console.error('解析失败:', error);
      }
    };

    simulateParse();
  }, [fileType, fileName]);

  // 加载 HTML 内容
  useEffect(() => {
    if (fileType === 'text/html') {
      const loadHtmlContent = async () => {
        try {
          const response = await fetch(fileUrl);
          if (response.ok) {
            const html = await response.text();
            setHtmlContent(html);
          }
        } catch (error) {
          setHtmlError(true);
          console.error('加载 HTML 失败:', error);
        }
      };

      loadHtmlContent();
    }
  }, [fileUrl, fileType]);

  // 处理 PDF 加载完成
  function onPDFDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(false);
  }

  // 处理 PDF 加载失败
  function onPDFDocumentLoadError(error: Error) {
    setPdfError(true);
    console.error('PDF 加载失败:', error);
  }

  // 渲染 PDF 预览
  const renderPDFPreview = () => {
    if (pdfError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-[#0d0d1a] rounded-xl">
          <div className="text-center text-red-400 p-6">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-lg font-medium">PDF 加载失败</p>
            <p className="text-sm opacity-80 mt-2">无法渲染此 PDF 文件</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center text-cyan-400 text-sm">
          共 {numPages || '?'} 页
        </div>
        <Document
          file={fileUrl}
          onLoadSuccess={onPDFDocumentLoadSuccess}
          onLoadError={onPDFDocumentLoadError}
          className="flex flex-col items-center"
          loading="加载中..."
          error="加载失败"
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer
              renderAnnotationLayer
              className="max-w-full mb-4 rounded-lg shadow-lg"
            />
          ))}
        </Document>
      </div>
    );
  };

  // 渲染图片预览
  const renderImagePreview = () => {
    if (imageError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-[#0d0d1a] rounded-xl">
          <div className="text-center text-red-400 p-6">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-lg font-medium">图片加载失败</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[#0d0d1a] rounded-xl p-6">
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-full max-h-[600px] object-contain rounded-lg shadow-lg"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  // 渲染 HTML 预览
  const renderHTMLPreview = () => {
    if (htmlError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-[#0d0d1a] rounded-xl">
          <div className="text-center text-red-400 p-6">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-lg font-medium">HTML 加载失败</p>
          </div>
        </div>
      );
    }

    if (!htmlContent) {
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-[#0d0d1a] rounded-xl">
          <div className="text-center text-cyan-400 animate-pulse">
            <div className="text-4xl mb-4">⏳</div>
            <p>加载中...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-[600px] bg-white rounded-lg overflow-hidden">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-0"
          title={fileName}
        />
      </div>
    );
  };

  // 渲染文本/文档预览
  const renderTextPreview = () => {
    if (!parsedText) {
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-[#0d0d1a] rounded-xl">
          <div className="text-center text-cyan-400 animate-pulse">
            <div className="text-4xl mb-4">⏳</div>
            <p>加载中...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#0d0d1a] rounded-xl p-6 h-[600px] overflow-auto">
        <pre className="whitespace-pre-wrap font-mono text-sm text-white/90">
          {parsedText}
        </pre>
      </div>
    );
  };

  // 渲染缩略图
  const renderThumbnail = () => {
    const ext = fileName.split('.').pop()?.toLowerCase();

    const iconMap: Record<string, string> = {
      'pdf': '📕',
      'doc': '📘',
      'docx': '📗',
      'txt': '📄',
      'md': '📝',
      'html': '🌐',
      'css': '🎨',
      'js': '📜',
      'ts': ' TypeScript',
      'py': '🐍',
      'jpg': '📷',
      'jpeg': '📷',
      'png': '📷',
      'gif': '📷',
      'svg': ' 数码',
    };

    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl">
        <div className="text-8xl mb-4">
          {iconMap[ext || ''] || '📦'}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-[#0a0a1a] rounded-2xl border border-white/10 shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{renderThumbnail()}</div>
            <div>
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <span className="text-xl opacity-70">👁️</span>
                文件预览
              </h3>
              <p className="text-cyan-400/80 text-sm mt-1">支持 PDF、图片、HTML、文档等多种格式</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-6 bg-[#0a0a1a]">
          {/* Type-specific preview */}
          {fileType === 'application/pdf' && renderPDFPreview()}
          
          {fileType.startsWith('image/') && renderImagePreview()}
          
          {fileType === 'text/html' && renderHTMLPreview()}
          
          {(fileType.startsWith('text/') || 
            fileType === 'application/msword' || 
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && 
            renderTextPreview()
          }

          {/* File Metadata */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <h4 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
              文件信息
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50 mb-1">文件名</p>
                <p className="text-sm text-white/90 truncate" title={fileName}>
                  {fileName}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50 mb-1">类型</p>
                <p className="text-sm text-white/90">{fileType}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50 mb-1">大小</p>
                <p className="text-sm text-white/90">
                  {(parsedData?.size || 0).toLocaleString()} 字节
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50 mb-1">状态</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <p className="text-sm text-green-400">已就绪</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-[#0a0a1a]">
          <div className="flex items-center gap-4 text-sm">
            {fileType === 'application/pdf' && (
              <div className="text-cyan-400/80">
                <span className="text-xs opacity-70 mr-2">PDF:</span>
                {pdfError ? '加载失败' : `${numPages || '?'} 页`}
              </div>
            )}
            {fileType.startsWith('image/') && (
              <div className="text-purple-400/80">
                <span className="text-xs opacity-70 mr-2">尺寸:</span>
                {imageError ? '加载失败' : '待加载'}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>📥</span>
              下载
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
