/**
 * 文件服务层 - API封装和WebSocket监听
 */

import axios from 'axios';
import { wsService } from './websocket';
import { 
  FileInfo, 
  FileUploadProgress, 
  AnalysisResult, 
  SearchResult, 
  AnswerResult,
  RAGChunk,
  VectorIndexInfo,
  ProcessingStatus,
  FileType
} from '../types/file-management.types';

// API配置
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/files';
const WS_FILE_EVENTS = {
  UPLOAD_PROGRESS: 'file_upload_progress',
  PROCESSING_STATUS: 'file_processing_status',
  ANALYSIS_COMPLETE: 'file_analysis_complete',
  RAG_INDEX_COMPLETE: 'rag_index_complete',
  RAG_QUERY_RESULT: 'rag_query_result'
};

class FileService {
  // 上传相关
  private uploadProgressCallbacks: Map<string, (progress: number) => void> = new Map();
  private uploadCompleteCallbacks: Map<string, (fileInfo: FileInfo) => void> = new Map();
  private uploadErrorCallbacks: Map<string, (error: Error) => void> = new Map();

  // 处理状态回调
  private processingStatusCallbacks: Map<string, (status: ProcessingStatus) => void> = new Map();

  // 分析结果回调
  private analysisResultCallbacks: Map<string, (result: AnalysisResult) => void> = new Map();

  // 初始化WebSocket监听
  constructor() {
    this.setupWebSocketListeners();
  }

  /**
   * 设置WebSocket事件监听
   */
  private setupWebSocketListeners(): void {
    wsService.onMessage((data: any) => {
      if (data.event === WS_FILE_EVENTS.UPLOAD_PROGRESS) {
        const { fileId, progress } = data.payload;
        const callback = this.uploadProgressCallbacks.get(fileId);
        if (callback) callback(progress);
      }

      if (data.event === WS_FILE_EVENTS.PROCESSING_STATUS) {
        const { fileId, status } = data.payload;
        const callback = this.processingStatusCallbacks.get(fileId);
        if (callback) callback(status);
      }

      if (data.event === WS_FILE_EVENTS.ANALYSIS_COMPLETE) {
        const { fileId, result } = data.payload;
        const callback = this.analysisResultCallbacks.get(fileId);
        if (callback) callback(result);
      }

      if (data.event === WS_FILE_EVENTS.RAG_QUERY_RESULT) {
        const { queryId, result } = data.payload;
        console.log('[RAG] Query result received:', result);
      }
    });
  }

  /**
   * 上传文件
   */
  async uploadFile(
    file: File, 
    workspaceId: string,
    options?: {
      onProgress?: (progress: number) => void;
      onComplete?: (fileInfo: FileInfo) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    if (options?.onProgress) this.uploadProgressCallbacks.set(fileId, options.onProgress);
    if (options?.onComplete) this.uploadCompleteCallbacks.set(fileId, options.onComplete);
    if (options?.onError) this.uploadErrorCallbacks.set(fileId, options.onError);

    try {
      const response = await axios.post<FileInfo>(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          
          wsService.sendChatMessage(JSON.stringify({
            event: WS_FILE_EVENTS.UPLOAD_PROGRESS,
            payload: { fileId, progress }
          }));

          const callback = this.uploadProgressCallbacks.get(fileId);
          if (callback) callback(progress);
        },
      });

      const fileInfo = response.data;

      const completeCallback = this.uploadCompleteCallbacks.get(fileId);
      if (completeCallback) completeCallback(fileInfo);

      this.uploadProgressCallbacks.delete(fileId);
      this.uploadCompleteCallbacks.delete(fileId);

      return fileInfo.id;

    } catch (error) {
      const err = error as Error;
      const errorCallback = this.uploadErrorCallbacks.get(fileId);
      if (errorCallback) errorCallback(err);
      this.uploadErrorCallbacks.delete(fileId);
      throw err;
    }
  }

  /**
   * 批量上传文件
   */
  async uploadFiles(
    files: File[],
    workspaceId: string
  ): Promise<{成功: string[]; 失败: { file: File; error: string }[]}> {
    const successful: string[] = [];
    const failed: { file: File; error: string }[] = [];

    const uploadPromises = files.map(file => 
      this.uploadFile(file, workspaceId)
        .then(id => {
          successful.push(id);
          return id;
        })
        .catch(error => {
          failed.push({ file, error: error.message });
          return null;
        })
    );

    await Promise.allSettled(uploadPromises);

    return { 成功: successful, 失败: failed };
  }

  /**
   * 获取文件列表
   */
  async getFiles(workspaceId: string): Promise<FileInfo[]> {
    const response = await axios.get<FileInfo[]>(`${API_BASE_URL}`, {
      params: { workspaceId },
    });
    return response.data;
  }

  /**
   * 获取单个文件信息
   */
  async getFileById(fileId: string): Promise<FileInfo> {
    const response = await axios.get<FileInfo>(`${API_BASE_URL}/${fileId}`);
    return response.data;
  }

  /**
   * 删除文件
   */
  async deleteFile(fileId: string): Promise<boolean> {
    const response = await axios.delete(`${API_BASE_URL}/${fileId}`);
    return response.data.success;
  }

  /**
   * 下载文件
   */
  async downloadFile(fileId: string): Promise<void> {
    const response = await axios.get(`${API_BASE_URL}/${fileId}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', response.data.fileName || 'download');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * 获取文件预览URL
   */
  getFilePreviewUrl(fileId: string): string {
    return `${API_BASE_URL}/${fileId}/content`;
  }

  /**
   * 获取文件内容
   */
  async getFileContent(fileId: string): Promise<string> {
    const response = await axios.get<string>(`${API_BASE_URL}/${fileId}/content`);
    return response.data;
  }

  /**
   * 启动多模态分析
   */
  async startMultimodalAnalysis(
    fileId: string, 
    options?: {
      prompt?: string;
      model?: string;
      onResult?: (result: AnalysisResult) => void;
    }
  ): Promise<void> {
    if (options?.onResult) {
      this.analysisResultCallbacks.set(fileId, options.onResult);
    }

    await axios.post(`${API_BASE_URL}/${fileId}/analyze`, {
      prompt: options?.prompt,
      model: options?.model,
    });
  }

  /**
   * 获取分析结果
   */
  async getAnalysisResult(fileId: string): Promise<AnalysisResult | null> {
    try {
      const response = await axios.get<AnalysisResult>(`${API_BASE_URL}/${fileId}/analysis`);
      return response.data;
    } catch (error) {
      console.error('[FileService] Failed to get analysis result:', error);
      return null;
    }
  }

  /**
   * 启动RAG索引
   */
  async startRAGIndexing(fileId: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/${fileId}/rag/index`);
  }

  /**
   * 获取RAG索引状态
   */
  async getRAGIndexStatus(fileId: string): Promise<VectorIndexInfo | null> {
    try {
      const response = await axios.get<VectorIndexInfo>(`${API_BASE_URL}/${fileId}/rag/index`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * 查询RAG
   */
  async ragQuery(
    workspaceId: string,
    question: string,
    options?: {
      fileId?: string;
      topK?: number;
      minSimilarity?: number;
    }
  ): Promise<{ results: SearchResult[]; answer: AnswerResult }> {
    const response = await axios.post<{ results: SearchResult[]; answer: AnswerResult }>(
      `${API_BASE_URL}/rag/query`,
      {
        workspaceId,
        question,
        fileId: options?.fileId,
        topK: options?.topK || 5,
        minSimilarity: options?.minSimilarity || 0.7,
      }
    );
    return response.data;
  }

  /**
   * 获取RAG分块
   */
  async getRAGChunks(fileId: string): Promise<RAGChunk[]> {
    try {
      const response = await axios.get<RAGChunk[]>(`${API_BASE_URL}/${fileId}/rag/chunks`);
      return response.data;
    } catch (error) {
      return [];
    }
  }

  /**
   * 监听文件处理状态
   */
  onProcessingStatus(fileId: string, callback: (status: ProcessingStatus) => void): () => void {
    this.processingStatusCallbacks.set(fileId, callback);
    return () => this.processingStatusCallbacks.delete(fileId);
  }

  /**
   * 监听上传进度
   */
  onUploadProgress(fileId: string, callback: (progress: number) => void): () => void {
    this.uploadProgressCallbacks.set(fileId, callback);
    return () => this.uploadProgressCallbacks.delete(fileId);
  }

  /**
   * 监听分析结果
   */
  onAnalysisResult(fileId: string, callback: (result: AnalysisResult) => void): () => void {
    this.analysisResultCallbacks.set(fileId, callback);
    return () => this.analysisResultCallbacks.delete(fileId);
  }

  /**
   * 识别文件类型
   */
  identifyFileType(file: File): FileType {
    const mimeType = file.type.toLowerCase();
    
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('text/')) return 'text';
    if (mimeType === 'text/markdown' || mimeType === 'text/x-markdown') return 'markdown';
    if (mimeType.includes('html')) return 'html';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    
    return 'unknown';
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  /**
   * 获取文件图标
   */
  getFileIcon(fileType: FileType | string, mimeType?: string): string {
    const type = typeof fileType === 'string' 
      ? this.identifyFileType({ type: mimeType || fileType } as File) 
      : fileType;
    
    const icons: Record<FileType, string> = {
      image: '📷',
      pdf: '📄',
      document: '📝',
      text: '📄',
      html: '🌐',
      markdown: '🔖',
      unknown: '📁',
    };
    
    return icons[type] || '📁';
  }
}

// 导出单例
export const fileService = new FileService();
export default fileService;
