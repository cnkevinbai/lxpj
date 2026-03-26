# File Parser Service

提供全面的文件解析支持，包括 PDF、Word 文档、图片、HTML 等多种文件格式。

## 功能特性

### PDF 解析
- 文本提取
- 页数统计
- 元数据提取

### Word 文档解析
- `.doc` (旧版 Word) - 文本提取
- `.docx` (新版 Word) - 文本提取和段落分析

### 图片分析
- 尺寸信息
- 格式识别
- 缩略图生成

### HTML 解析
- 标题提取
- 文本内容提取
- 链接和图片提取

### 文本文件
- 纯文本文件
- Markdown 文件
- 代码文件 (JS, TS, Python 等)

## API 端点

### `POST /api/files/:id/parse`
解析文件内容

**响应:**
```json
{
  "success": true,
  "fileId": "uuid",
  "parsedData": {
    // 根据文件类型返回不同的数据结构
  }
}
```

### `GET /api/files/:id/preview`
获取文件预览

**查询参数:**
- `page` - 对于 PDF 文件，指定页码
- `maxPages` - 最大页面数

**响应:**
```json
{
  "success": true,
  "preview": {
    "type": "pdf" | "image" | "html" | "text",
    // 类型特定的数据
  }
}
```

### `GET /api/files/:id/thumbnail`
获取文件缩略图

**响应:**
```json
{
  "success": true,
  "thumbnail": "data:image/jpeg;base64,..."
}
```

## 安装依赖

```bash
npm install pdf-parse mammoth sharp pdf-lib jsdom cheerio
```

## 使用示例

### 解析 PDF 文件
```typescript
const result = await filesService.parseFile(fileId);
if (result.success) {
  console.log('PDF Text:', result.parsedData.text);
  console.log('Pages:', result.parsedData.pages);
}
```

### 获取图片分析
```typescript
const result = await filesService.getFileThumbnail(fileId);
if (result.success && result.thumbnail) {
  console.log('Image width:', result.thumbnail.width);
  console.log('Image height:', result.thumbnail.height);
}
```

### 预览 HTML 文件
```typescript
const result = await filesService.getFilePreview(fileId);
if (result.success) {
  console.log('HTML Title:', result.preview.title);
  console.log('HTML Text:', result.preview.text);
  console.log('Links:', result.preview.links);
}
```
