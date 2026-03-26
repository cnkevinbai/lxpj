/**
 * File Management - Main export index
 */

// Stores
export { useFileStore, useFilteredFiles, fileActions } from './store/file-management';
export { useRAGStore, ragActions } from './store/file-management/rag-store';

// Services
export { fileService } from './services/file-api';

// Components (使用默认导入)
export { default as FileUploader } from './components/file-management/upload/FileUploader';
export { default as FileList } from './components/file-management/list/FileList';
export { default as MultimodalPreview } from './components/file-management/preview/MultimodalPreview';
export { default as RAGDocumentManager } from './components/file-management/rag/RAGDocumentManager';
export { default as RAGQueryPanel } from './components/file-management/rag/RAGQueryPanel';
export { default as FileManagementPage } from './pages/FileManagementPage';

// Types
export type { 
  FileInfo, 
  FileUploadProgress, 
  AnalysisResult, 
  SearchResult, 
  AnswerResult,
  UploadFile,
  FileOperation,
  RAGChunk,
  VectorIndexInfo,
  FilePreviewState,
  FileListFilters,
  RAGQueryParams,
  MultimodalAnalysisParams,
  ProcessingStatus,
  ProcessingType,
  ViewMode,
  FileType
} from './types/file-management.types';