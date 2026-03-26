/**
 * File Management Page - Demo page with all components
 */

import React, { useState, useEffect } from 'react';
import { useFileStore, fileActions } from '../store/file-management';
import { useRAGStore } from '../store/file-management/rag-store';
import FileUploader from '../components/file-management/upload/FileUploader';
import FileList from '../components/file-management/list/FileList';
import MultimodalPreview from '../components/file-management/preview/MultimodalPreview';
import RAGDocumentManager from '../components/file-management/rag/RAGDocumentManager';
import RAGQueryPanel from '../components/file-management/rag/RAGQueryPanel';
import { FileInfo } from '../types/file-management.types';

// Main component
const FileManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rag'>('dashboard');
  const [previewFile, setPreviewFile] = useState<FileInfo | null>(null);
  const [workspaceId, setWorkspaceId] = useState('default');
  const { currentWorkspaceId, setCurrentWorkspaceId } = useFileStore();
  const { currentRAGFileId } = useRAGStore();

  useEffect(() => {
    setCurrentWorkspaceId(workspaceId);
  }, [workspaceId]);

  return (
    <div className="file-management-page">
      <PageHeader workspaceId={workspaceId} onWorkspaceChange={setWorkspaceId} />
      
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="page-content">
        <DashboardTab 
          active={activeTab === 'dashboard'} 
          workspaceId={workspaceId}
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
        />
        
        <RAGTab 
          active={activeTab === 'rag'} 
          workspaceId={workspaceId}
          fileId={currentRAGFileId || undefined}
        />
      </div>

      {/* Modal */}
      {previewFile && (
        <div className="modal-overlay" onClick={() => setPreviewFile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <MultimodalPreview
              fileId={previewFile.id}
              showAnalysis={true}
              onClose={() => setPreviewFile(null)}
            />
          </div>
        </div>
      )}

      <style>{`
        .file-management-page {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .page-header h1 {
          margin: 0;
          color: #1f2937;
          font-size: 24px;
        }
        .page-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          max-width: 900px;
          width: 90%;
          height: 80vh;
          overflow: hidden;
        }
        .mb-24 {
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

// Sub-components defined as inline for demo
const PageHeader: React.FC<{ workspaceId: string; onWorkspaceChange: (id: string) => void }> = ({ workspaceId, onWorkspaceChange }) => (
  <div className="page-header">
    <h1>📁 文件管理</h1>
    <div className="workspace-selector">
      <select value={workspaceId} onChange={(e) => onWorkspaceChange(e.target.value)}>
        <option value="default">默认工作区</option>
        <option value="project-ai">AI项目</option>
        <option value="data-analysis">数据分析</option>
      </select>
    </div>
  </div>
);

const Tabs: React.FC<{ activeTab: 'dashboard' | 'rag'; onTabChange: (tab: 'dashboard' | 'rag') => void }> = ({ activeTab, onTabChange }) => (
  <div className="tabs">
    <button className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => onTabChange('dashboard')}>
      📁 文件管理
    </button>
    <button className={`tab ${activeTab === 'rag' ? 'active' : ''}`} onClick={() => onTabChange('rag')}>
      🧠 RAG管理
    </button>
  </div>
);

const DashboardTab: React.FC<{
  active: boolean;
  workspaceId: string;
  previewFile: FileInfo | null;
  setPreviewFile: (file: FileInfo | null) => void;
}> = ({ active, workspaceId, previewFile, setPreviewFile }) => {
  if (!active) return null;

  return (
    <>
      <section className="upload-section">
        <h2>文件上传</h2>
        <FileUploader
          workspaceId={workspaceId}
          allowedTypes={['image/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
          maxFiles={10}
          maxFileSize={100 * 1024 * 1024}
          className="mb-24"
        />
      </section>

      <section className="list-section">
        <h2>文件列表</h2>
        <div style={{ marginBottom: '16px' }}>
          <button onClick={() => fileActions.loadRAGFiles(workspaceId)} className="refresh-btn">🔄 刷新</button>
        </div>
        <FileList workspaceId={workspaceId} onSelectFile={setPreviewFile} className="mb-24" />
      </section>

      <section className="rag-section">
        <h2>RAG文档管理</h2>
        <RAGDocumentManager workspaceId={workspaceId} className="mb-24" />
      </section>
    </>
  );
};

const RAGTab: React.FC<{ active: boolean; workspaceId: string; fileId?: string }> = ({ active, workspaceId, fileId }) => {
  if (!active) return null;

  return (
    <section className="rag-query-section">
      <h2>RAG问答</h2>
      <RAGQueryPanel workspaceId={workspaceId} fileId={fileId} className="mb-24" />
    </section>
  );
};

export default FileManagementPage;
