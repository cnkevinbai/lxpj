/**
 * RAG文档管理Store
 */

import { create } from 'zustand';
import { fileService } from '../../services/file-api';
import { FileInfo, RAGChunk, VectorIndexInfo, ProcessingStatus } from '../../types/file-management.types';

interface RAGDocumentState {
  currentWorkspaceId: string;
  setCurrentWorkspaceId: (workspaceId: string) => void;

  ragFiles: FileInfo[];
  ragFilesLoading: boolean;
  loadRAGFiles: () => Promise<void>;

  currentRAGFileId: string | null;
  setCurrentRAGFileId: (fileId: string | null) => void;

  chunks: RAGChunk[];
  chunksLoading: boolean;
  loadChunks: (fileId: string) => Promise<void>;

  vectorIndex: VectorIndexInfo | null;
  vectorIndexLoading: boolean;
  loadVectorIndex: (fileId: string) => Promise<void>;
  refreshVectorIndex: (fileId: string) => Promise<void>;

  processingStatus: Map<string, ProcessingStatus>;
  startProcessingListener: (fileId: string) => () => void;

  startRAGIndexing: (fileId: string) => Promise<void>;
  startIndexingAndListen: (fileId: string) => Promise<void>;
}

export const useRAGStore = create<RAGDocumentState>((set, get) => ({
  currentWorkspaceId: 'default',
  setCurrentWorkspaceId: (workspaceId) => set({ currentWorkspaceId: workspaceId }),

  ragFiles: [],
  ragFilesLoading: false,
  loadRAGFiles: async () => {
    set({ ragFilesLoading: true });
    try {
      const files = await fileService.getFiles(get().currentWorkspaceId);
      const ragFiles = files.filter(f => f.processingType === 'rag' || f.processingType === 'multimodal');
      set({ ragFiles, ragFilesLoading: false });
    } catch (error) {
      console.error('[RAGStore] Failed to load RAG files:', error);
      set({ ragFilesLoading: false });
    }
  },

  currentRAGFileId: null,
  setCurrentRAGFileId: (fileId) => set({ currentRAGFileId: fileId }),

  chunks: [],
  chunksLoading: false,
  loadChunks: async (fileId: string) => {
    set({ chunksLoading: true });
    try {
      const chunks = await fileService.getRAGChunks(fileId);
      set({ chunks, chunksLoading: false });
    } catch (error) {
      console.error('[RAGStore] Failed to load chunks:', error);
      set({ chunksLoading: false });
    }
  },

  vectorIndex: null,
  vectorIndexLoading: false,
  loadVectorIndex: async (fileId: string) => {
    set({ vectorIndexLoading: true });
    try {
      const index = await fileService.getRAGIndexStatus(fileId);
      set({ vectorIndex: index, vectorIndexLoading: false });
    } catch (error) {
      console.error('[RAGStore] Failed to load vector index:', error);
      set({ vectorIndexLoading: false });
    }
  },

  refreshVectorIndex: async (fileId: string) => {
    await get().loadVectorIndex(fileId);
    const listener = get().startProcessingListener(fileId);
    listener();
  },

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

  startRAGIndexing: async (fileId: string) => {
    try {
      await fileService.startRAGIndexing(fileId);
      const listener = get().startProcessingListener(fileId);
      await get().refreshVectorIndex(fileId);
    } catch (error) {
      console.error('[RAGStore] Failed to start RAG indexing:', error);
      throw error;
    }
  },

  startIndexingAndListen: async (fileId: string) => {
    set({ currentRAGFileId: fileId });
    await get().startRAGIndexing(fileId);
    await get().loadChunks(fileId);
  },
}));

// Action函数
export const ragActions = {
  loadRAGFiles: async (workspaceId: string) => {
    useRAGStore.getState().setCurrentWorkspaceId(workspaceId);
    await useRAGStore.getState().loadRAGFiles();
  },

  loadChunks: async (fileId: string) => {
    await useRAGStore.getState().loadChunks(fileId);
  },

  startupIndexing: async (fileId: string, workspaceId: string) => {
    useRAGStore.getState().setCurrentWorkspaceId(workspaceId);
    await useRAGStore.getState().startIndexingAndListen(fileId);
  },
};

export default useRAGStore;
