# OpenClaw Dashboard - 文件支持实现总结

## 已完成的功能

### 后端实现

#### 1. 文件解析服务 (`FileParserService`)
**位置:** `backend/src/services/file-parser.service.ts`

**支持的文件类型:**

- **PDF** (`application/pdf`)
  - `parsePDF(buffer)`: 解析 PDF 文件，提取文本、页数和元数据
  - `generatePDFPreview(buffer, pages)`: 生成 PDF 预览（支持分页）

- **Word 文档**
  - `parseDocx(buffer)`: 解析 `.docx` 文件
  - `parseDoc(buffer)`: 解析旧版 `.doc` 文件

- **图片** (`image/*`)
  - `analyzeImage(buffer, mimeType)`: 分析图片，提取尺寸、格式、缩略图

- **HTML** (`text/html`)
  - `parseHTML(buffer)`: 解析 HTML，提取标题、文本、链接和图片

- **文本文件**
  - `parseText(buffer, mimeType)`: 解析纯文本文件
  - `parseMarkdown(buffer)`: 解析 Markdown 文件（标题提取）

- **自动类型识别**
  - `parseFileByType(buffer, mimeType)`: 根据 MIME 类型自动选择解析器

#### 2. FilesService 更新
**位置:** `backend/src/api/files/files.service.ts`

新增方法:
- `parseFile(fileId)`: 解析文件内容
- `getFilePreview(fileId, options)`: 获取文件预览
- `getFileThumbnail(fileId)`: 获取文件缩略图
- `parseFiles(fileIds)`: 批量解析文件

#### 3. API 端点

**位置:** `backend/src/api/files/files.controller.ts`

新端点:
- `POST /api/files/:id/parse` - 解析文件内容
- `GET /api/files/:id/preview` - 获取文件预览
- `GET /api/files/:id/thumbnail` - 获取文件缩略图
- `POST /api/files/parse/batch` - 批量解析文件

#### 4. 依赖更新
**位置:** `backend/package.json`

新增依赖:
- `pdf-parse`: PDF 文本提取
- `mammoth`: Word 文档解析
- `sharp`: 图片处理和缩略图生成
- `pdf-lib`: PDF 预览生成

### 前端实现

#### 1. FilePreview 组件
**位置:** `src/components/files/FilePreview.tsx`

功能特性:
- **PDF 预览**: 使用 react-pdf 渲染 PDF 页面
- **图片预览**: 图片显示（支持各种格式）
- **HTML 预览**: 使用 iframe 渲染 HTML 内容
- **文档预览**: 文本/Word 文档的格式化显示
- **文件信息**: 显示文件大小、类型、状态等元数据

#### 2. FilesPage 更新
**位置:** `src/pages/FilesPage.tsx`

集成:
- 导入并使用 `FilePreview` 组件
- 简化了预览模态框的实现
- 保持了原有的上传、下载、删除功能

## 使用方法

### 后端使用

#### 解析文件
```typescript
import { FilesService } from './api/files/files.service';

// 解析单个文件
const result = await filesService.parseFile(fileId);
if (result.success) {
  console.log('解析数据:', result.parsedData);
}

// 批量解析
const results = await filesService.parseFiles([fileId1, fileId2]);
```

#### 获取预览
```typescript
// 获取文件预览
const preview = await filesService.getFilePreview(fileId, { page: 0 });

// 获取缩略图
const thumbnail = await filesService.getFileThumbnail(fileId);
```

### 前端使用

#### 预览文件
```tsx
import { FilePreview } from './components/files/FilePreview';

<FilePreview
  fileUrl="/files/xxx.pdf"
  fileType="application/pdf"
  fileName="document.pdf"
  onClose={handleClose}
  onDownload={handleDownload}
/>
```

## API 文档

### POST /api/files/:id/parse
解析文件内容

**请求参数:**
- `id` (path): 文件 ID

**响应:**
```json
{
  "success": "boolean",
  "fileId": "string",
  "parsedData": "object | null",
  "errorMessage": "string | undefined"
}
```

### GET /api/files/:id/preview
获取文件预览

**请求参数:**
- `id` (path): 文件 ID
- `page` (query, optional): PDF 页码
- `maxPages` (query, optional): 最大页面数

**响应:**
```json
{
  "success": "boolean",
  "preview": "object | null",
  "errorMessage": "string | undefined"
}
```

### GET /api/files/:id/thumbnail
获取文件缩略图

**请求参数:**
- `id` (path): 文件 ID

**响应:**
```json
{
  "success": "boolean",
  "thumbnail": "string | undefined",
  "errorMessage": "string | undefined"
}
```

## 构建和运行

### 后端
```bash
cd backend
npm install
npm run build
npm start
```

### 前端
```bash
cd src
npm install
npm run dev
```

## 注意事项

1. **PDF.js Worker**: 前端使用了外部的 PDF.js worker，确保网络连接可用
2. **文件路径**: 后端静态文件服务在 `/files/` 路径下
3. **错误处理**: 所有解析方法都包含完善的错误处理机制
4. **性能考虑**: 大文件解析可能导致性能问题，建议添加进度提示

## 后续优化方向

1. **OCR 支持**: 添加 Tesseract.js 支持图片中的文字识别
2. **缓存机制**: 添加解析结果缓存避免重复解析
3. **进度监控**: 为长时间运行的解析任务添加进度监控
4. **批量处理**: 优化批量解析的性能
5. **PDF 缩略图**: 为 PDF 文件生成更好的缩略图
