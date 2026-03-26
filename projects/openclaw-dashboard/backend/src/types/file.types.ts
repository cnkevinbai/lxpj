// 根据架构文档定义的文件类型系统
export type ProcessingType = 'multimodal' | 'rag' | 'none';
export type ProcessingStatus = 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed';

// 文件元数据模型
export interface FileMetadata {
  id: string;
  workspaceId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  fileHash: string;
  processingType: ProcessingType;
  processingStatus: ProcessingStatus;
  processingError?: string;
  title?: string;
  description?: string;
  tags: string[];
  pageCount?: number;
  wordCount?: number;
  language?: string;
  uploadedAt: Date;
  processedAt?: Date;
  updatedAt: Date;
  storagePath: string;
  storageType: 'local' | 'cloud';
  ownerId: string;
  sharedWith: string[];
}

// 向量索引结构
export interface VectorIndexEntry {
  vectorId: string;
  fileId: string;
  chunkId: string;
  embedding: number[];
  embeddingModel: string;
  content: string;
  metadata: {
    fileName: string;
    fileType: string;
    pageNumber?: number;
    sectionTitle?: string;
    wordCount: number;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 文本分块策略
export interface TextChunk {
  chunkId: string;
  fileId: string;
  content: string;
  sequence: number;
  wordCount: number;
  charCount: number;
  metadata: {
    sourceType: 'paragraph' | 'sentence' | 'fixed';
    pageNumber?: number;
    section?: string;
    previousChunkId?: string | null;
    nextChunkId?: string | null;
  };
}

// 上传请求
export interface UploadRequest {
  workspaceId: string;
  tags?: string[];
  description?: string;
}

// 上传响应
export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  processingStatus: ProcessingStatus;
  processingType: ProcessingType;
  uploadTime: string;
}

// 文件状态响应
export interface FileStatusResponse {
  fileId: string;
  processingStatus: ProcessingStatus;
  processingType: ProcessingType;
  progress: number;
  errorMessage?: string;
  completedAt?: string;
}

// 多模态分析请求
export interface AnalyzeRequest {
  prompt?: string;
  model?: string;
}

// 多模态分析响应
export interface AnalyzeResponse {
  fileId: string;
  analysisResult: string;
  modelUsed: string;
  tokensUsed: number;
  timestamp: string;
}

// 搜索请求
export interface SearchRequest {
  query: string;
  workspaceId: string;
  fileId?: string;
  topK?: number;
  similarityThreshold?: number;
}

// 搜索结果
export interface SearchResult {
  query: string;
  results: SearchResultItem[];
  totalResults: number;
}

export interface SearchResultItem {
  fileId: string;
  fileName: string;
  chunkId: string;
  content: string;
  similarityScore: number;
  metadata: Record<string, any>;
}

// 问答请求
export interface AskRequest {
  question: string;
  contextChunks?: number;
}

// 问答响应
export interface AskResponse {
  question: string;
  answer: string;
  sources: SourceReference[];
  modelUsed: string;
}

export interface SourceReference {
  fileId: string;
  chunkId: string;
  content: string;
  page?: number;
}

// 文件列表查询
export interface ListFilesQuery {
  workspaceId: string;
  fileType?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

// 文件列表响应
export interface ListFilesResponse {
  files: FileInfo[];
  total: number;
  hasMore: boolean;
}

export interface FileInfo {
  id: string;
  workspaceId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  processingType: ProcessingType;
  processingStatus: ProcessingStatus;
  tags: string[];
  uploadedAt: string;
  preview?: string;
  mimeType?: string;
}
