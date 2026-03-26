/**
 * 文件管理 Store - 主Store
 */

import { create } from 'zustand';
import { fileService } from '../../services/file-api';
import { 
  FileInfo, 
  FileListFilters,
  ViewMode,
  ProcessingStatus
} from '../../types/file-management.types';

interface FileManagementState {
  currentWorkspaceId: string;
  setCurrentWorkspaceId: (workspaceId: string) => void;

  files: FileInfo[];
  filesLoading: boolean;
  loadFiles: (workspaceId: string) => Promise<void>;
  refreshFiles: () => Promise<void>;

  uploadQueue: any[];
  addToFileUploadQueue: (file: File) => void;
  removeFromFileUploadQueue: (fileId: string) => void;
  updateUploadProgress: (fileId: string, progress: number) => void;
  clearUploadQueue: () => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  filters: FileListFilters;
  setFilters: (filters: Partial<FileListFilters>) => void;
  clearFilters: () => void;

  selectedFileId: string | null;
  setSelectedFileId: (fileId: string | null) => void;

  processingStatus: Map<string, ProcessingStatus>;
  startProcessingListener: (fileId: string) => () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useFileStore = create<FileManagementState>((set, get) => ({
  currentWorkspaceId: 'default',
  setCurrentWorkspaceId: (workspaceId) => {
    set({ currentWorkspaceId: workspaceId });
    get().loadFiles(workspaceId);
  },

  files: [],
  filesLoading: false,
  loadFiles: async (workspaceId: string) => {
    set({ filesLoading: true });
    try {
      const files = await fileService.getFiles(workspaceId);
      set({ files, filesLoading: false });
    } catch (error) {
      console.error('[FileStore] Failed to load files:', error);
      set({ filesLoading: false });
    }
  },
  refreshFiles: async () => {
    await get().loadFiles(get().currentWorkspaceId);
  },

  uploadQueue: [],
  addToFileUploadQueue: (file) => {
    const uploadFile = {
      id: file.name,
      progress: 0,
      retryCount: 0,
      status: 'pending' as const,
    };
    set((state) => ({
      uploadQueue: [...state.uploadQueue, uploadFile],
    }));
  },
  removeFromFileUploadQueue: (fileId) => {
    set((state) => ({
      uploadQueue: state.uploadQueue.filter(f => f.id !== fileId),
    }));
  },
  updateUploadProgress: (fileId, progress) => {
    set((state) => ({
      uploadQueue: state.uploadQueue.map(f => 
        f.id === fileId ? { ...f, progress, status: progress >= 100 ? 'completed' : 'uploading' } : f
      ),
    }));
  },
  clearUploadQueue: () => set({ uploadQueue: [] }),

  viewMode: 'list',
  setViewMode: (mode) => set({ viewMode: mode }),

  filters: {},
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  clearFilters: () => set({ filters: {} }),

  selectedFileId: null,
  setSelectedFileId: (fileId) => set({ selectedFileId: fileId }),

  processingStatus: new Map(),
  startProcessingListener: (fileId: string) => {
    const unsubscribe = fileService.onProcessingStatus(fileId, (status) => {
      set((state) => {
        const statusMap = new Map(state.processingStatus);
        statusMap.set(fileId, status);
        return { processingStatus: statusMap };
      });
    });
    return unsubscribe;
  },

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

// Action函数
export const fileActions = {
  loadRAGFiles: async (workspaceId: string) => {
    useFileStore.getState().setCurrentWorkspaceId(workspaceId);
    await useFileStore.getState().refreshFiles();
  },

  deleteFile: async (fileId: string) => {
    try {
      await fileService.deleteFile(fileId);
      await useFileStore.getState().refreshFiles();
    } catch (error) {
      console.error('[FileActions] Failed to delete file:', error);
      throw error;
    }
  },
};

// 计算过滤后的文件列表（需要在组件中使用）
export const useFilteredFiles = () => {
  const { files, filters, searchQuery } = useFileStore();
  
  return files.filter(file => {
    if (searchQuery && !file.fileName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filters.processingStatus && file.processingStatus !== filters.processingStatus) {
      return false;
    }

    if (filters.fileType && !file.mimeType.includes(filters.fileType)) {
      return false;
    }

    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => file.tags.includes(tag));
      if (!hasTag) return false;
    }

    return true;
  });
};

export default useFileStore;
