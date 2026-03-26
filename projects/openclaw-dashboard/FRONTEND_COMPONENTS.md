# OpenClaw 文件管理模块前端组件设计

## 组件架构

前端采用模块化设计，主要包含以下组件层次：

```
src/
├── components/
│   └── file-management/
│       ├── upload/              # 上传相关组件
│       ├── preview/             # 预览相关组件  
│       ├── search/              # 搜索相关组件
│       ├── list/                # 列表相关组件
│       └── common/              # 通用组件
├── hooks/                       # 自定义Hooks
│   └── file-management/
│       ├── useFileUpload.ts
│       ├── useFilePreview.ts
│       ├── useRagSearch.ts
│       └── useMultimodalAnalysis.ts
├── contexts/                    # React Context
│   └── FileManagementContext.tsx
└── types/                       # TypeScript类型定义
    └── file-management.types.ts
```

## 核心组件详细设计

### 1. 文件上传组件

#### FileUploadDropzone (主上传组件)

**Props**:
```typescript
interface FileUploadDropzoneProps {
  onUploadComplete: (fileId: string) => void;
  allowedTypes?: string[];
  maxFileSize?: number; // bytes
  workspaceId: string;
  multiple?: boolean; // 是否支持多文件
  showProgress?: boolean; // 是否显示进度
  className?: string; // 自定义样式
}
```

**状态管理**:
- `isDragging`: 拖拽状态
- `uploading`: 上传状态
- `uploadProgress`: 上传进度 (0-100)
- `uploadError`: 上传错误信息

**交互流程**:
1. 用户拖拽文件或点击选择文件
2. 前端验证文件类型和大小
3. 显示上传进度条
4. 上传完成后触发 `onUploadComplete` 回调
5. 支持取消上传

**UI设计**:
- 拖拽区域：虚线边框 + 云上传图标
- 悬停效果：边框变蓝 + 背景变浅蓝
- 上传中：旋转加载图标 + 进度百分比
- 错误状态：红色边框 + 错误消息

#### FileUploadQueue (批量上传队列)

**功能特性**:
- 支持多文件同时上传
- 独立的进度条每个文件
- 暂停/继续/取消单个文件
- 自动重试失败的上传
- 上传历史记录

### 2. 文件列表组件

#### FileList (主列表组件)

**Props**:
```typescript
interface FileListProps {
  workspaceId: string;
  filters?: {
    fileType?: string;
    tags?: string[];
    processingStatus?: 'completed' | 'processing' | 'failed';
    dateRange?: { start: Date; end: Date };
  };
  viewMode?: 'grid' | 'list'; // 视图模式
  onFileSelect: (fileId: string) => void;
  onFileAction: (action: 'delete' | 'share' | 'download', fileId: string) => void;
}
```

**功能特性**:
- **表格/网格视图切换**: 用户可选择显示模式
- **排序**: 按名称、大小、上传时间、处理状态排序
- **过滤**: 按文件类型、标签、处理状态过滤
- **分页**: 支持大文件集分页
- **批量操作**: 选择多个文件进行批量操作
- **实时更新**: WebSocket连接实时更新处理状态

**UI元素**:
- 文件图标 (根据MIME类型)
- 文件名和原始文件名
- 文件大小和上传时间
- 处理状态指示器 (彩色徽章)
- 标签显示 (可点击过滤)
- 操作菜单 (更多操作按钮)

#### FileCard (网格视图卡片)

**设计要点**:
- 缩略图预览 (图片/PDF第一页)
- 文件类型图标
- 处理状态彩色边框
- 悬停显示操作按钮
- 响应式设计 (桌面/平板/手机)

### 3. 文件预览组件

#### FilePreview (通用预览组件)

**Props**:
```typescript
interface FilePreviewProps {
  fileId: string;
  showAnalysis?: boolean; // 是否显示多模态分析结果
  showMetadata?: boolean; // 是否显示元数据
  onDownload?: () => void; // 下载回调
  onClose?: () => void; // 关闭回调
}
```

**支持的文件类型预览**:

| 文件类型 | 预览方式 | 组件 |
|----------|----------|------|
| JPG/PNG/GIF/WebP | `<img>` 标签 | ImagePreview |
| SVG | SVG渲染 | SvgPreview |
| PDF | react-pdf | PdfPreview |
| DOCX/DOC | 文本提取预览 | DocumentPreview |
| HTML | 安全HTML渲染 | HtmlPreview |
| MD/TXT | 代码高亮 | TextPreview |

**交互功能**:
- **缩放控制**: 图片和PDF支持缩放
- **页面导航**: PDF支持翻页
- **文本选择**: 可选择和复制文本
- **下载按钮**: 直接下载原始文件
- **分享链接**: 生成分享链接

#### MultimodalAnalysisOverlay (多模态分析叠加层)

**功能**:
- 在图像上叠加分析结果
- 可折叠/展开分析面板
- 支持重新分析 (自定义提示)
- 显示使用的模型和token使用量

### 4. RAG检索组件

#### RagSearchInterface (RAG搜索界面)

**Props**:
```typescript
interface RagSearchInterfaceProps {
  workspaceId: string;
  selectedFileId?: string; // 限定搜索特定文件
  onSearchResultSelect?: (result: SearchResult) => void;
  showQuestionMode?: boolean; // 显示问答模式
}
```

**UI布局**:
```
┌─────────────────────────────────┐
│  🔍 搜索框                      │
├─────────────────────────────────┤
│  📝 问答模式开关                │
├─────────────────────────────────┤
│  📄 搜索结果列表                │
│  • 结果1 - 相似度 89%          │
│  • 结果2 - 相似度 82%          │
│  • 结果3 - 相似度 76%          │
├─────────────────────────────────┤
│  💬 AI回答区域 (问答模式)       │
└─────────────────────────────────┘
```

**功能特性**:
- **智能搜索建议**: 基于历史搜索提供建议
- **结果高亮**: 在原文中高亮匹配内容
- **上下文查看**: 点击结果查看完整上下文
- **问答模式**: 将搜索结果作为上下文回答问题
- **结果导出**: 导出搜索结果为Markdown/JSON

#### SearchResultItem (搜索结果项)

**设计**:
- 文件图标 + 文件名
- 相似度分数 (彩色进度条)
- 匹配内容片段 (高亮关键词)
- 元数据 (页码、章节标题)
- 操作按钮 (查看上下文、引用)

### 5. 处理进度监控组件

#### ProcessingProgressModal (处理进度模态框)

**Props**:
```typescript
interface ProcessingProgressModalProps {
  fileId: string;
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void; // 处理失败时重试
}
```

**进度阶段显示**:
1. **上传完成** → 📤
2. **格式解析** → 📄  
3. **内容提取** → 🔍
4. **文本分块** → ✂️
5. **向量化** → 🧠
6. **索引建立** → 📚
7. **处理完成** → ✅

**错误处理**:
- 显示具体错误信息
- 提供重试按钮
- 显示技术支持链接

### 6. 通用组件

#### FileStatusBadge (文件状态徽章)

**状态颜色编码**:
- `uploaded`: 灰色
- `queued`: 蓝色  
- `processing`: 黄色
- `completed`: 绿色
- `failed`: 红色

#### FileTypeIcon (文件类型图标)

**图标映射**:
- 图片: 📷
- PDF: 📄
- Word: 📝
- HTML: 🌐
- Markdown: 🔖
- 文本: 📄

#### TagChip (标签芯片)

**功能**:
- 可点击过滤
- 彩色背景 (随机但一致的颜色)
- 删除按钮 (编辑模式)

## 自定义Hooks设计

### useFileUpload Hook

```typescript
interface UseFileUploadOptions {
  workspaceId: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (fileId: string) => void;
  onError?: (error: Error) => void;
}

interface FileUploadResult {
  uploadFile: (file: File) => Promise<string>;
  uploading: boolean;
  progress: number;
  error: Error | null;
}

const useFileUpload = (options: UseFileUploadOptions): FileUploadResult => {
  // 实现文件上传逻辑
};
```

### useRagSearch Hook

```typescript
interface UseRagSearchOptions {
  workspaceId: string;
  fileId?: string;
}

interface RagSearchResult {
  search: (query: string, options?: SearchOptions) => Promise<SearchResult[]>;
  askQuestion: (question: string, options?: AskOptions) => Promise<AnswerResult>;
  loading: boolean;
  results: SearchResult[];
  answer: AnswerResult | null;
}

const useRagSearch = (options: UseRagSearchOptions): RagSearchResult => {
  // 实现RAG搜索逻辑
};
```

### useMultimodalAnalysis Hook

```typescript
interface UseMultimodalAnalysisOptions {
  fileId: string;
}

interface MultimodalAnalysisResult {
  analyze: (prompt?: string, model?: string) => Promise<AnalysisResult>;
  loading: boolean;
  result: AnalysisResult | null;
  error: Error | null;
}

const useMultimodalAnalysis = (options: UseMultimodalAnalysisOptions): MultimodalAnalysisResult => {
  // 实现多模态分析逻辑
};
```

## 状态管理

### FileManagementContext

```typescript
interface FileManagementContextType {
  // 当前选中的文件
  selectedFileId: string | null;
  setSelectedFileId: (id: string | null) => void;
  
  // 工作区文件列表
  files: FileInfo[];
  loading: boolean;
  refreshFiles: () => void;
  
  // WebSocket连接状态
  wsConnected: boolean;
  
  // 当前工作区
  currentWorkspaceId: string;
  setCurrentWorkspaceId: (id: string) => void;
}

const FileManagementContext = createContext<FileManagementContextType>(null!);
```

## 类型定义

### 核心类型

```typescript
// file-management.types.ts
export interface FileInfo {
  id: string;
  workspaceId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  processingStatus: 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed';
  processingType: 'multimodal' | 'rag' | 'none';
  tags: string[];
  description?: string;
  uploadedAt: string;
  processedAt?: string;
  pageCount?: number;
  wordCount?: number;
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
    wordCount: number;
    [key: string]: any;
  };
}

export interface AnalysisResult {
  fileId: string;
  analysisResult: string;
  modelUsed: string;
  tokensUsed: number;
  timestamp: string;
}

export interface AnswerResult {
  question: string;
  answer: string;
  sources: {
    fileId: string;
    chunkId: string;
    content: string;
    page?: number;
  }[];
  modelUsed: string;
}
```

## 响应式设计

### 断点设计

| 断点 | 宽度 | 设计特点 |
|------|------|----------|
| 手机 | < 768px | 单列布局，简化操作 |
| 平板 | 768px - 1024px | 双列布局，适中功能 |
| 桌面 | > 1024px | 多列布局，完整功能 |

### 移动端优化

- **触摸友好**: 按钮足够大，间距合适
- **手势支持**: 滑动删除、长按选择
- **性能优化**: 懒加载、虚拟滚动
- **离线支持**: 缓存最近访问的文件

## 主题和样式

### 主题变量

```css
:root {
  --file-upload-border: #d1d5db;
  --file-upload-hover: #3b82f6;
  --file-status-uploaded: #6b7280;
  --file-status-queued: #3b82f6;
  --file-status-processing: #f59e0b;
  --file-status-completed: #10b981;
  --file-status-failed: #ef4444;
  --search-result-highlight: #fbbf24;
}
```

### 动画效果

- **上传进度**: 平滑进度条动画
- **状态变化**: 渐变颜色过渡
- **加载状态**: 旋转加载图标
- **悬停效果**: 平滑阴影和缩放

## 性能优化

### 虚拟滚动

- **大文件列表**: 使用react-virtual实现虚拟滚动
- **搜索结果**: 虚拟滚动长结果列表
- **内存优化**: 只渲染可见项目

### 懒加载

- **图片预览**: 交集观察器懒加载
- **PDF页面**: 按需加载页面
- **组件代码分割**: 动态导入重型组件

### 缓存策略

- **文件列表缓存**: SWR缓存策略
- **搜索结果缓存**: 内存缓存 + localStorage
- **预览缓存**: IndexedDB存储预览数据

## 可访问性 (Accessibility)

### ARIA标签

- **上传区域**: `role="button"` + `aria-label`
- **文件列表**: `role="list"` + `aria-labelledby`
- **搜索结果**: `aria-live="polite"` 实时更新

### 键盘导航

- **Tab键**: 在可聚焦元素间导航
- **Enter/Space**: 触发按钮和选择
- **方向键**: 在列表中导航
- **Escape**: 关闭模态框

### 屏幕阅读器支持

- **状态更新**: 适当的aria-live区域
- **错误消息**: aria-describedby关联
- **加载状态**: aria-busy指示

## 国际化 (i18n)

### 多语言支持

- **文件类型描述**: 本地化文件类型名称
- **状态消息**: 本地化处理状态文本
- **错误消息**: 本地化错误提示
- **日期格式**: 本地化日期显示

### RTL支持

- **布局镜像**: 支持从右到左布局
- **文本对齐**: 自动调整文本对齐
- **图标方向**: 镜像导航图标

这个前端组件设计提供了完整的用户体验，支持两种文件处理模式，具有良好的性能、可访问性和国际化支持。