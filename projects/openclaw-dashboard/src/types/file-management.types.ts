// 文件管理模块类型定义

export type ProcessingStatus = 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed';
export type ProcessingType = 'multimodal' | 'rag' | 'none';
export type ViewMode = 'grid' | 'list';
export type FileType = 'image' | 'pdf' | 'document' | 'text' | 'html' | 'markdown' | 'unknown';

export interface FileInfo {
  id: string;
  workspaceId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  processingStatus: ProcessingStatus;
  processingType: ProcessingType;
  tags: string[];
  description?: string;
  uploadedAt: string;
  processedAt?: string;
  pageCount?: number;
  wordCount?: number;
  thumbnailUrl?: string;
  analysisResult?: AnalysisResult;
}

export interface FileUploadProgress {
  fileId: string;
  progress: number;
  retryCount: number;
  lastError?: string;
}

export interface AnalysisResult {
  fileId: string;
  analysisResult: string;
  modelUsed: string;
  tokensUsed: number;
  timestamp: string;
  rawAnalysis?: any;
}

export interface SearchResult {
  fileId: string;
  fileName: string;
  chunkId: string;
  content: string;
  similarityScore: number;
  metadata: {
    pageNumber?: number;
    sectionTitle?: string;
    wordCount?: number;
    [key: string]: any;
  };
}

export interface AnswerResult {
  question: string;
  answer: string;
  sources: {
    fileId: string;
    chunkId: string;
    content: string;
    page?: number;
    similarityScore?: number;
  }[];
  modelUsed: string;
  tokensUsed: number;
}

export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
  fileInfo?: FileInfo;
  mimeType?: string;
}

export interface FileOperation {
  id: string;
  type: 'upload' | 'delete' | 'download' | 'preview' | 'analyze';
  fileId?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface RAGChunk {
  id: string;
  fileId: string;
  content: string;
  chunkIndex: number;
  vectorIndex?: number;
  metadata: {
    page?: number;
    section?: string;
    wordCount: number;
  };
}

export interface VectorIndexInfo {
  indexId: string;
  fileId: string;
  dimensions: number;
  totalChunks: number;
  indexedChunks: number;
  status: 'pending' | 'indexing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt?: string;
}

export interface FilePreviewState {
  isOpen: boolean;
  fileId: string | null;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  scale: number;
  rotation: number;
  showAnalysis: boolean;
}

export interface FileListFilters {
  searchQuery?: string;
  fileType?: string;
  tags?: string[];
  processingStatus?: ProcessingStatus;
  dateRange?: { start: Date; end: Date };
  processingType?: ProcessingType;
}

export interface RAGQueryParams {
  workspaceId: string;
  fileId?: string;
  question: string;
  topK?: number;
  minSimilarity?: number;
}

export interface MultimodalAnalysisParams {
  fileId: string;
  prompt?: string;
  model?: string;
}
