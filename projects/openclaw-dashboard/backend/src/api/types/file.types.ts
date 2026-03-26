// 文件类型定义
export type ProcessingType = 'multimodal' | 'rag' | 'none';
export type ProcessingStatus = 'queued' | 'processing' | 'completed' | 'failed';

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
  processedAt?: Date;
  tags: string[];
  description: string;
  uploadedAt: Date;
  updatedAt: Date;
  storagePath: string;
  storageType: 'local' | 's3' | 'oss';
  ownerId: string;
  sharedWith: string[];
}

export interface TextChunk {
  id: string;
  fileId: string;
  chunkIndex: number;
  content: string;
  tokenCount: number;
  embedding?: number[];
  embeddingId?: string;
  createdAt: Date;
}

export interface VectorIndexEntry {
  id: string;
  chunkId: string;
  fileId: string;
  embedding: number[];
  metadata: Record<string, any>;
  createdAt: Date;
}

// API 类型
export interface UploadRequest {
  workspaceId: string;
  tags?: string[];
  description?: string;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  processingStatus: ProcessingStatus;
  processingType: ProcessingType;
  uploadTime: string;
}

export interface FileStatusResponse {
  fileId: string;
  processingStatus: ProcessingStatus;
  processingType: ProcessingType;
  progress: number;
  errorMessage?: string;
  completedAt?: string;
}

export interface AnalyzeRequest {
  prompt?: string;
  model?: string;
}

export interface AnalyzeResponse {
  fileId: string;
  analysisResult: string;
  modelUsed: string;
  tokensUsed: number;
  timestamp: string;
}

export interface SearchRequest {
  query: string;
  workspaceId: string;
  topK?: number;
  similarityThreshold?: number;
  fileIds?: string[];
}

export interface SearchResultItem {
  chunkId: string;
  fileId: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface SearchResult {
  query: string;
  results: SearchResultItem[];
  totalResults: number;
}

export interface AskRequest {
  question: string;
  contextChunks?: number;
  model?: string;
}

export interface AskResponse {
  question: string;
  answer: string;
  sources: SearchResultItem[];
  modelUsed: string;
  tokensUsed?: number;
}

export interface ChunkingOptions {
  strategy: 'paragraph' | 'sentence' | 'fixed';
  chunkSize?: number;
  overlap?: number;
}