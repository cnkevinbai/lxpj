/**
 * Session Store - 会话状态管理
 * 
 * 管理会话压缩、摘要生成等对话增强功能
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sessionApi } from '../services/chat-api';

// Compression state
export interface CompressionState {
  isCompressing: boolean;
  autoCompressEnabled: boolean;
  compressionTriggerThreshold: number; // 触发压缩的消息数阈值
  lastCompressionTime?: string;
  compressionSummary?: string;
}

// Summary state
export interface SummaryState {
  isGeneratingSummary: boolean;
  summary?: string;
  lastSummaryTime?: string;
}

// Session state extension
export interface SessionState {
  // Compression
  compression: CompressionState;
  
  // Summary
  summary: SummaryState;
  
  // Actions
  // 压缩相关
  startCompression: () => void;
  finishCompression: (summary: string) => void;
  setAutoCompressEnabled: (enabled: boolean) => void;
  setCompressionTriggerThreshold: (threshold: number) => void;
  
  // 摘要相关
  startGeneratingSummary: () => void;
  finishGeneratingSummary: (summary: string) => void;
  
  // 会话相关
  updateSessionCompression: (sessionId: string, summary: string) => Promise<void>;
  updateSessionSummary: (sessionId: string, summary: string) => Promise<void>;
  clearSessionCompression: (sessionId: string) => Promise<void>;
  clearSessionSummary: (sessionId: string) => Promise<void>;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      // 压缩状态
      compression: {
        isCompressing: false,
        autoCompressEnabled: true,
        compressionTriggerThreshold: 20,
      },
      
      // 摘要状态
      summary: {
        isGeneratingSummary: false,
        summary: undefined,
      },

      // 开始压缩
      startCompression: () => {
        set({ compression: { ...get().compression, isCompressing: true } });
      },

      // 完成压缩
      finishCompression: (summary: string) => {
        set({
          compression: {
            ...get().compression,
            isCompressing: false,
            lastCompressionTime: new Date().toISOString(),
            compressionSummary: summary,
          },
          summary: {
            ...get().summary,
            summary: summary,
          },
        });
      },

      // 设置自动压缩
      setAutoCompressEnabled: (enabled: boolean) => {
        set({
          compression: {
            ...get().compression,
            autoCompressEnabled: enabled,
          },
        });
      },

      // 设置压缩触发阈值
      setCompressionTriggerThreshold: (threshold: number) => {
        set({
          compression: {
            ...get().compression,
            compressionTriggerThreshold: threshold,
          },
        });
      },

      // 开始生成摘要
      startGeneratingSummary: () => {
        set({ summary: { ...get().summary, isGeneratingSummary: true } });
      },

      // 完成生成摘要
      finishGeneratingSummary: (summary: string) => {
        set({
          summary: {
            ...get().summary,
            isGeneratingSummary: false,
            lastSummaryTime: new Date().toISOString(),
            summary,
          },
        });
      },

      // 更新会话压缩状态（调用 API）
      updateSessionCompression: async (sessionId: string, summary: string) => {
        try {
          await sessionApi.compressSession(sessionId);
          
          // 更新本地状态
          set((state) => ({
            compression: {
              ...state.compression,
              lastCompressionTime: new Date().toISOString(),
              compressionSummary: summary,
            },
          }));
          
          console.log(`[SessionStore] Session ${sessionId} compressed successfully`);
        } catch (error) {
          console.error(`[SessionStore] Failed to compress session ${sessionId}:`, error);
          throw error;
        }
      },

      // 更新会话摘要（调用 API）
      updateSessionSummary: async (sessionId: string, summary: string) => {
        try {
          await sessionApi.generateSummary(sessionId);
          
          // 更新本地状态
          set((state) => ({
            summary: {
              ...state.summary,
              lastSummaryTime: new Date().toISOString(),
              summary,
            },
          }));
          
          console.log(`[SessionStore] Session ${sessionId} summary generated successfully`);
        } catch (error) {
          console.error(`[SessionStore] Failed to generate summary for session ${sessionId}:`, error);
          throw error;
        }
      },

      // 清除会话压缩状态
      clearSessionCompression: async (sessionId: string) => {
        set((state) => ({
          compression: {
            ...state.compression,
            lastCompressionTime: undefined,
            compressionSummary: undefined,
          },
        }));
        
        console.log(`[SessionStore] Session ${sessionId} compression cleared`);
      },

      // 清除会话摘要状态
      clearSessionSummary: async (sessionId: string) => {
        set((state) => ({
          summary: {
            ...state.summary,
            lastSummaryTime: undefined,
            summary: undefined,
          },
        }));
        
        console.log(`[SessionStore] Session ${sessionId} summary cleared`);
      },
    }),
    {
      name: 'session-store',
      partialize: (state) => ({
        compression: state.compression,
      }),
    }
  )
);

export default useSessionStore;
