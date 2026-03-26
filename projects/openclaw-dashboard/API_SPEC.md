# OpenClaw 文件管理模块 API 规范

## 概述

本API规范定义了OpenClaw文件管理模块的所有端点，支持两种主要的文件处理模式：
- **多模态直接识别**: 适用于图片、图表等视觉内容
- **RAG文档处理**: 适用于PDF、Word、HTML等文本密集型文档

所有API端点都遵循RESTful设计原则，使用JSON格式进行数据交换。

## 认证

所有API端点都需要认证。使用Bearer Token认证：

```http
Authorization: Bearer <your-access-token>
```

## 错误响应格式

所有错误响应都遵循统一格式：

```json
{
  "statusCode": 400,
  "message": "错误描述",
  "error": "BadRequest"
}
```

常见的HTTP状态码：
- `400 Bad Request`: 请求参数无效
- `401 Unauthorized`: 认证失败
- `403 Forbidden`: 权限不足
- `404 Not Found`: 资源不存在
- `413 Payload Too Large`: 文件过大
- `422 Unprocessable Entity`: 文件处理失败
- `500 Internal Server Error`: 服务器内部错误

## 文件上传 API

### POST /api/files/upload

上传单个文件到指定工作区。

#### 请求

**Content-Type**: `multipart/form-data`

**表单字段**:
- `file` (required): 文件二进制数据
- `workspaceId` (required): 工作区ID
- `tags` (optional): 标签数组，JSON格式字符串
- `description` (optional): 文件描述

**示例请求**:
```bash
curl -X POST \
  -H "Authorization: Bearer your-token" \
  -F "file=@document.pdf" \
  -F "workspaceId=workspace-123" \
  -F "tags=[\"important\",\"contract\"]" \
  -F "description=Important contract document" \
  http://localhost:3000/api/files/upload
```

#### 响应

**成功 (201 Created)**:
```json
{
  "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "fileName": "a1b2c3d4e5f67890g1h2i3j4k5l6m7n8.pdf",
  "originalName": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 2048576,
  "processingStatus": "queued",
  "processingType": "rag",
  "uploadTime": "2026-03-19T12:30:45.123Z",
  "workspaceId": "workspace-123"
}
```

**错误 (413 Payload Too Large)**:
```json
{
  "statusCode": 413,
  "message": "File size exceeds 50MB limit",
  "error": "PayloadTooLarge"
}
```

## 文件状态查询 API

### GET /api/files/{fileId}/status

获取文件处理状态。

#### 请求

**路径参数**:
- `fileId`: 文件ID

**示例请求**:
```bash
curl -H "Authorization: Bearer your-token" \
  http://localhost:3000/api/files/file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8/status
```

#### 响应

**成功 (200 OK)**:
```json
{
  "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "processingStatus": "completed",
  "processingType": "rag",
  "progress": 100,
  "completedAt": "2026-03-19T12:35:22.456Z",
  "wordCount": 15420,
  "pageCount": 24
}
```

**处理中 (200 OK)**:
```json
{
  "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "processingStatus": "processing",
  "processingType": "rag",
  "progress": 65,
  "currentStage": "vector_embedding"
}
```

## 多模态分析 API

### POST /api/files/{fileId}/analyze

对图像文件执行多模态分析。

#### 请求

**路径参数**:
- `fileId`: 文件ID

**请求体 (application/json)**:
```json
{
  "prompt": "Describe the chart and extract key data points",
  "model": "gpt-4-vision-preview"
}
```

**字段说明**:
- `prompt` (optional): 自定义分析提示，默认为通用图像描述
- `model` (optional): 指定使用的多模态模型

**示例请求**:
```bash
curl -X POST \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Extract all text from this screenshot and summarize the main points",
    "model": "gpt-4-vision-preview"
  }' \
  http://localhost:3000/api/files/file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8/analyze
```

#### 响应

**成功 (200 OK)**:
```json
{
  "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "analysisResult": "This is a bar chart showing quarterly sales performance for 2025. Q1: $1.2M, Q2: $1.5M, Q3: $1.8M, Q4: $2.1M. The chart indicates steady growth throughout the year with Q4 being the strongest quarter.",
  "modelUsed": "gpt-4-vision-preview",
  "tokensUsed": 128,
  "timestamp": "2026-03-19T12:40:15.789Z"
}
```

**错误 (422 Unprocessable Entity)**:
```json
{
  "statusCode": 422,
  "message": "File is not an image or has not been processed yet",
  "error": "UnprocessableEntity"
}
```

## RAG检索 API

### POST /api/files/search

在指定工作区中搜索相关文档内容。

#### 请求

**请求体 (application/json)**:
```json
{
  "query": "What are the key terms of the contract?",
  "workspaceId": "workspace-123",
  "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "topK": 5,
  "similarityThreshold": 0.7
}
```

**字段说明**:
- `query` (required): 搜索查询
- `workspaceId` (required): 工作区ID
- `fileId` (optional): 限定搜索特定文件
- `topK` (optional): 返回结果数量，默认5
- `similarityThreshold` (optional): 相似度阈值，默认0.7

**示例请求**:
```bash
curl -X POST \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "payment terms and conditions",
    "workspaceId": "workspace-123",
    "topK": 3
  }' \
  http://localhost:3000/api/files/search
```

#### 响应

**成功 (200 OK)**:
```json
{
  "query": "payment terms and conditions",
  "results": [
    {
      "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
      "fileName": "contract_v2.pdf",
      "chunkId": "chunk-12345",
      "content": "Payment shall be made within 30 days of invoice date. Late payments will incur a 2% monthly interest charge.",
      "similarityScore": 0.89,
      "metadata": {
        "pageNumber": 12,
        "sectionTitle": "Payment Terms",
        "wordCount": 28
      }
    },
    {
      "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
      "fileName": "contract_v2.pdf",
      "chunkId": "chunk-12346",
      "content": "All invoices must be paid in USD. International wire transfers may incur additional bank fees which are the responsibility of the payer.",
      "similarityScore": 0.82,
      "metadata": {
        "pageNumber": 13,
        "sectionTitle": "Payment Methods",
        "wordCount": 32
      }
    }
  ],
  "totalResults": 2
}
```

### POST /api/files/{fileId}/ask

针对特定文件提问并获取答案。

#### 请求

**路径参数**:
- `fileId`: 文件ID

**请求体 (application/json)**:
```json
{
  "question": "What is the termination clause?",
  "contextChunks": 3
}
```

**字段说明**:
- `question` (required): 问题
- `contextChunks` (optional): 用于构建上下文的块数量，默认3

**示例请求**:
```bash
curl -X POST \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the confidentiality obligations?",
    "contextChunks": 4
  }' \
  http://localhost:3000/api/files/file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8/ask
```

#### 响应

**成功 (200 OK)**:
```json
{
  "question": "What are the confidentiality obligations?",
  "answer": "Both parties agree to maintain strict confidentiality regarding all proprietary information disclosed during the term of this agreement and for a period of 5 years after termination. This includes but is not limited to business strategies, customer lists, pricing information, and technical specifications.",
  "sources": [
    {
      "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
      "chunkId": "chunk-23456",
      "content": "Confidentiality: Both parties shall keep confidential all information received from the other party that is marked as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.",
      "page": 18
    },
    {
      "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
      "chunkId": "chunk-23457",
      "content": "The confidentiality obligations shall survive termination of this agreement for a period of five (5) years.",
      "page": 19
    }
  ],
  "modelUsed": "gpt-4"
}
```

## 文件管理 API

### GET /api/files

列出工作区中的所有文件。

#### 请求

**查询参数**:
- `workspaceId` (required): 工作区ID
- `fileType` (optional): 文件类型过滤
- `tags` (optional): 标签过滤（逗号分隔）
- `processingStatus` (optional): 处理状态过滤
- `limit` (optional): 每页数量，默认20
- `offset` (optional): 偏移量，默认0

**示例请求**:
```bash
curl -H "Authorization: Bearer your-token" \
  "http://localhost:3000/api/files?workspaceId=workspace-123&fileType=application/pdf&tags=important&limit=10"
```

#### 响应

**成功 (200 OK)**:
```json
{
  "files": [
    {
      "id": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
      "fileName": "contract_v2.pdf",
      "originalName": "Contract Version 2.pdf",
      "fileType": "application/pdf",
      "fileSize": 2048576,
      "processingStatus": "completed",
      "processingType": "rag",
      "tags": ["important", "contract"],
      "description": "Final version of the service contract",
      "uploadedAt": "2026-03-19T12:30:45.123Z",
      "processedAt": "2026-03-19T12:35:22.456Z",
      "pageCount": 24,
      "wordCount": 15420
    },
    {
      "id": "file-b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9",
      "fileName": "chart_q4_sales.png",
      "originalName": "Q4 Sales Chart.png",
      "fileType": "image/png",
      "fileSize": 245760,
      "processingStatus": "completed",
      "processingType": "multimodal",
      "tags": ["sales", "q4"],
      "description": "Q4 2025 sales performance chart",
      "uploadedAt": "2026-03-19T11:15:30.789Z",
      "processedAt": "2026-03-19T11:16:05.123Z"
    }
  ],
  "total": 2,
  "hasMore": false
}
```

### GET /api/files/{fileId}

获取单个文件的详细信息。

#### 请求

**路径参数**:
- `fileId`: 文件ID

**示例请求**:
```bash
curl -H "Authorization: Bearer your-token" \
  http://localhost:3000/api/files/file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8
```

#### 响应

**成功 (200 OK)**:
```json
{
  "id": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "workspaceId": "workspace-123",
  "fileName": "a1b2c3d4e5f67890g1h2i3j4k5l6m7n8.pdf",
  "originalName": "Contract Version 2.pdf",
  "fileType": "application/pdf",
  "fileSize": 2048576,
  "fileHash": "a1b2c3d4e5f67890g1h2i3j4k5l6m7n8a1b2c3d4e5f67890g1h2i3j4k5l6m7n8",
  "processingType": "rag",
  "processingStatus": "completed",
  "title": "Service Agreement between Company A and Company B",
  "description": "Final version of the service contract",
  "tags": ["important", "contract"],
  "pageCount": 24,
  "wordCount": 15420,
  "language": "en",
  "uploadedAt": "2026-03-19T12:30:45.123Z",
  "processedAt": "2026-03-19T12:35:22.456Z",
  "updatedAt": "2026-03-19T12:35:22.456Z",
  "storagePath": "/uploads/a1b2c3d4e5f67890g1h2i3j4k5l6m7n8.pdf",
  "storageType": "local",
  "ownerId": "user-123",
  "sharedWith": ["user-456", "user-789"]
}
```

### DELETE /api/files/{fileId}

删除文件及其所有相关数据。

#### 请求

**路径参数**:
- `fileId`: 文件ID

**示例请求**:
```bash
curl -X DELETE \
  -H "Authorization: Bearer your-token" \
  http://localhost:3000/api/files/file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8
```

#### 响应

**成功 (204 No Content)**: 无响应体

**错误 (403 Forbidden)**:
```json
{
  "statusCode": 403,
  "message": "You do not have permission to delete this file",
  "error": "Forbidden"
}
```

## 文件预览 API

### GET /api/files/{fileId}/preview

获取文件预览数据。

#### 请求

**路径参数**:
- `fileId`: 文件ID

**查询参数**:
- `page` (optional): PDF页面号，默认1
- `width` (optional): 图像预览宽度
- `height` (optional): 图像预览高度

**示例请求**:
```bash
curl -H "Authorization: Bearer your-token" \
  "http://localhost:3000/api/files/file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8/preview?page=2"
```

#### 响应

**PDF文件 (200 OK)**:
```json
{
  "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "fileName": "contract_v2.pdf",
  "fileType": "application/pdf",
  "url": "/api/files/file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8/content",
  "currentPage": 2,
  "totalPages": 24,
  "textContent": "Page 2 content extracted from PDF..."
}
```

**图像文件 (200 OK)**:
```json
{
  "fileId": "file-b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9",
  "fileName": "chart_q4_sales.png",
  "fileType": "image/png",
  "url": "/api/files/file-b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9/content",
  "width": 1920,
  "height": 1080,
  "size": 245760
}
```

### GET /api/files/{fileId}/content

获取文件原始内容（用于前端显示）。

#### 请求

**路径参数**:
- `fileId`: 文件ID

**响应**

**成功 (200 OK)**: 返回文件的原始二进制内容，Content-Type根据文件类型设置

## WebSocket 实时更新

### 连接

WebSocket端点：`ws://localhost:3000/files/ws`

**连接参数**:
- `Authorization`: Bearer token (通过查询参数传递)

**示例连接**:
```javascript
const ws = new WebSocket('ws://localhost:3000/files/ws?token=your-token');
```

### 消息格式

所有消息都是JSON格式：

```json
{
  "type": "file_processing_update",
  "data": {
    "fileId": "file-a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    "status": "processing",
    "progress": 75,
    "stage": "vector_embedding"
  }
}
```

### 消息类型

- `file_upload_complete`: 文件上传完成
- `file_processing_update`: 文件处理进度更新
- `file_processing_complete`: 文件处理完成
- `file_processing_failed`: 文件处理失败

## 速率限制

API实施速率限制以防止滥用：

- **文件上传**: 10次/分钟/用户
- **文件分析**: 20次/分钟/用户
- **RAG搜索**: 50次/分钟/用户
- **文件列表**: 100次/分钟/用户

超过限制将返回 `429 Too Many Requests` 错误。

## 版本控制

API版本通过URL路径指定：`/api/v1/files/...`

当前版本：`v1`

向后兼容性保证：不会在不增加版本号的情况下破坏现有API。