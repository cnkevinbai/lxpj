# OpenClaw 文件管理模块

## 功能概述

OpenClaw 文件管理模块提供了一个完整的文件管理系统，支持：

### 主要功能
- **文件上传**: 多文件批量上传，拖拽支持，进度跟踪
- **文件列表**: 列表/网格视图切换，搜索、筛选
- **多模态预览**: 图片预览、分析结果展示
- **RAG管理**: 文档解析状态、分块可视化、向量索引
- **RAG问答**: 问题输入、检索结果、AI回答

## 安装

```bash
npm install @openclaw/file-management
```

## 使用

### 基础组件

```tsx
import { FileManagementPage } from '@openclaw/file-management';

function App() {
  return <FileManagementPage workspaceId="default" />;
}
```

### 单独组件

```tsx
import { FileUploader, FileList } from '@openclaw/file-management';
import { useFileStore } from '@openclaw/file-management';

function MyComponent() {
  const { currentWorkspaceId } = useFileStore();
  
  return (
    <>
      <FileUploader workspaceId={currentWorkspaceId} />
      <FileList workspaceId={currentWorkspaceId} />
    </>
  );
}
```

## API

- `useFileStore` - 主Store
- `useRAGStore` - RAG Store
- `fileService` - 文件服务
- `FileUploader` - 上传组件
- `FileList` - 列表组件
- `MultimodalPreview` - 预览组件
- `RAGDocumentManager` - RAG管理
- `RAGQueryPanel` - RAG问答

## 类型

```typescript
type ProcessingStatus = 
  | 'uploaded' 
  | 'queued' 
  | 'processing' 
  | 'completed' 
  | 'failed';

type ViewMode = 'grid' | 'list';
```

## 许可证
MIT
