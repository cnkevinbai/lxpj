import { useState, useEffect } from 'react';
import axios from 'axios';
import { FilePreview } from '../components/files/FilePreview';

interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: 'file' | 'folder';
  path: string;
  modified: string;
  mimeType?: string;
}

interface FileStatus {
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
  viewMode: 'list' | 'grid';
  searchQuery: string;
  selectedFiles: string[];
  previewFile: FileInfo | null;
  currentPage: number;
  itemsPerPage: number;
}

const API_BASE_URL = '/api/files';

export function FilesPage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<FileStatus>({
    uploadProgress: 0,
    isUploading: false,
    error: null,
    viewMode: 'list',
    searchQuery: '',
    selectedFiles: [],
    previewFile: null,
    currentPage: 1,
    itemsPerPage: 50,
  });

  // Fetch files on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get<FileInfo[]>(API_BASE_URL);
      setFiles(response.data);
    } catch (error) {
      setStatus(prev => ({ ...prev, error: 'Failed to fetch files' }));
    } finally {
      setLoading(false);
    }
  };

  // Filter files based on search query
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(status.searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredFiles.length / status.itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (status.currentPage - 1) * status.itemsPerPage,
    status.currentPage * status.itemsPerPage
  );

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setStatus(prev => ({ ...prev, isUploading: true, error: null }));

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(API_BASE_URL + '/upload', formData, {
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setStatus(prev => ({ ...prev, uploadProgress: progress }));
          }
        },
      });

      if (response.data.success) {
        fetchFiles();
        setStatus(prev => ({ ...prev, uploadProgress: 0, isUploading: false }));
      } else {
        setStatus(prev => ({ ...prev, error: response.data.error, isUploading: false }));
      }
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        error: 'Upload failed', 
        isUploading: false,
        uploadProgress: 0 
      }));
    }
  };

  // Handle file delete
  const handleDeleteFile = async (fileId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/${fileId}`);
      fetchFiles();
    } catch (error) {
      setStatus(prev => ({ ...prev, error: 'Failed to delete file' }));
    }
  };

  // Handle file download
  const handleDownloadFile = async (fileId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${fileId}/download`, {
        responseType: 'blob' as 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', files.find(f => f.id === fileId)?.name || 'file');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setStatus(prev => ({ ...prev, error: 'Failed to download file' }));
    }
  };

  // Handle file preview
  const handlePreviewFile = async (file: FileInfo) => {
    if (file.type === 'folder') return;

    setStatus(prev => ({ ...prev, previewFile: file }));
  };

  // Close preview
  const closePreview = () => {
    setStatus(prev => ({ ...prev, previewFile: null }));
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setStatus(prev => ({ ...prev, viewMode: prev.viewMode === 'list' ? 'grid' : 'list' }));
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(prev => ({ ...prev, searchQuery: e.target.value, currentPage: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setStatus(prev => ({ ...prev, currentPage: page }));
  };

  // Check if file is previewable
  const isPreviewable = (file: FileInfo): boolean => {
    const textExtensions = ['.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.py'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    return textExtensions.includes(ext) || imageExtensions.includes(ext);
  };

  // Get file icon
  const getFileIcon = (file: FileInfo): string => {
    if (file.type === 'folder') return '📁';
    
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    const iconMap: Record<string, string> = {
      '.txt': '📄',
      '.md': '📄',
      '.json': '📋',
      '.js': '📜',
      '.ts': '📜',
      '.html': '🌐',
      '.css': '🎨',
      '.py': '🐍',
      '.jpg': '🖼️',
      '.jpeg': '🖼️',
      '.png': '🖼️',
      '.gif': '🖼️',
      '.svg': '🖼️',
      '.pdf': '📕',
    };
    
    return iconMap[ext] || '📦';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-3xl animate-pulse mx-auto mb-4">
            📁
          </div>
          <p className="text-cyan-400/60">加载文件中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">文件管理</h2>
        <p className="text-cyan-400/60 mt-1">
          浏览和管理项目文件
        </p>
      </div>

      {/* Upload Area */}
      <div className="card-tech p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-xl">⬆️</span>
            上传文件
          </h3>
          <button
            onClick={toggleViewMode}
            className="text-white/70 hover:text-white transition-colors"
          >
            {status.viewMode === 'list' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </button>
        </div>

        <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            multiple
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-4xl mb-4 animate-bounce">
              📤
            </div>
            <p className="text-white/80 mb-2">拖拽文件到此处或点击上传</p>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/20">
              选择文件
            </button>
          </label>

          {status.isUploading && (
            <div className="mt-6 w-full max-w-md mx-auto">
              <div className="flex justify-between text-sm text-cyan-400/80 mb-2">
                <span>上传中...</span>
                <span>{status.uploadProgress}%</span>
              </div>
              <div className="w-full bg-cyan-500/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${status.uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card-tech p-6 rounded-2xl flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="搜索文件..."
            value={status.searchQuery}
            onChange={handleSearch}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Files Table */}
      <div className="flex-1 overflow-hidden">
        <div className="card-tech h-full rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-white/5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-xl">📁</span>
              文件列表
              <span className="text-sm text-cyan-400/60 bg-cyan-500/10 px-3 py-1 rounded-full">
                {filteredFiles.length} 个文件
              </span>
            </h3>
          </div>

          {paginatedFiles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center text-5xl mb-4 text-white/30">
                📂
              </div>
              <p className="text-white/60 text-lg mb-2">没有找到文件</p>
              <p className="text-white/40 text-sm">尝试上传新文件或调整搜索条件</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-cyan-400/60 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">名称</th>
                    <th className="px-6 py-4 font-semibold">类型</th>
                    <th className="px-6 py-4 font-semibold">大小</th>
                    <th className="px-6 py-4 font-semibold">修改日期</th>
                    <th className="px-6 py-4 font-semibold text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="text-white text-sm divide-y divide-white/5">
                  {paginatedFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handlePreviewFile(file)}
                        >
                          <span className="text-2xl">{getFileIcon(file)}</span>
                          <span className="font-medium text-white/90 group-hover:text-cyan-400 transition-colors">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-cyan-400/80">
                        {file.type}
                      </td>
                      <td className="px-6 py-4 text-white/70 font-mono">
                        {file.type === 'folder' ? '-' : formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 text-white/60 text-xs">
                        {formatDate(file.modified)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPreviewable(file) && (
                            <button
                              onClick={() => handlePreviewFile(file)}
                              className="text-cyan-400 hover:text-cyan-300 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors text-xs font-medium"
                            >
                              预览
                            </button>
                          )}
                          <button
                            onClick={() => handleDownloadFile(file.id)}
                            className="text-purple-400 hover:text-purple-300 px-3 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors text-xs font-medium"
                          >
                            下载
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-xs font-medium"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, status.currentPage - 1))}
                disabled={status.currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-white text-sm font-medium"
              >
                上一页
              </button>
              <span className="text-white/70 text-sm">
                第 {status.currentPage} / {totalPages} 页
              </span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, status.currentPage + 1))}
                disabled={status.currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-white text-sm font-medium"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {status.previewFile && (
        <FilePreview
          fileUrl={status.previewFile.path}
          fileType={status.previewFile.mimeType || 'application/octet-stream'}
          fileName={status.previewFile.name}
          onClose={closePreview}
          onDownload={() => handleDownloadFile(status.previewFile!.id)}
        />
      )}

      {/* Error Toast */}
      {status.error && (
        <div className="fixed bottom-6 right-6 bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl backdrop-blur-md shadow-2xl animate-fade-in-up z-50 flex items-center gap-3">
          <span className="text-2xl">×</span>
          <div>
            <p className="font-semibold">操作失败</p>
            <p className="text-sm opacity-80">{status.error}</p>
          </div>
          <button
            onClick={() => setStatus(prev => ({ ...prev, error: null }))}
            className="ml-4 text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
