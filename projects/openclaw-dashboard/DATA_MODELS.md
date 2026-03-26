# OpenClaw 文件管理模块数据模型

## 数据库实体设计

### 1. 文件元数据 (File)

```typescript
// file.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('files')
@Index(['workspaceId', 'ownerId'])
@Index(['fileHash'])
@Index(['processingStatus'])
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  workspaceId: string;

  @Column({ nullable: false })
  fileName: string; // 存储文件名（哈希值）

  @Column({ nullable: false })
  originalName: string; // 原始文件名

  @Column({ nullable: false })
  fileType: string; // MIME类型

  @Column({ nullable: false, type: 'bigint' })
  fileSize: number;

  @Column({ nullable: false, unique: true })
  fileHash: string; // SHA256哈希

  @Column({
    type: 'enum',
    enum: ['multimodal', 'rag', 'none'],
    default: 'none',
  })
  processingType: 'multimodal' | 'rag' | 'none';

  @Column({
    type: 'enum',
    enum: ['uploaded', 'queued', 'processing', 'completed', 'failed'],
    default: 'uploaded',
  })
  processingStatus: 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed';

  @Column({ nullable: true })
  processingError?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'simple-array', nullable: true, default: [] })
  tags: string[];

  @Column({ nullable: true, type: 'int' })
  pageCount?: number;

  @Column({ nullable: true, type: 'int' })
  wordCount?: number;

  @Column({ nullable: true })
  language?: string;

  @Column({ nullable: false })
  ownerId: string;

  @Column({ type: 'simple-array', nullable: true, default: [] })
  sharedWith: string[];

  @Column({ nullable: false })
  storagePath: string;

  @Column({
    type: 'enum',
    enum: ['local', 'cloud'],
    default: 'local',
  })
  storageType: 'local' | 'cloud';

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ nullable: true })
  processedAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. 文本块 (Chunk)

```typescript
// chunk.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { File } from './file.entity';

@Entity('chunks')
export class Chunk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  fileId: string;

  @ManyToOne(() => File, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fileId' })
  file: File;

  @Column({ nullable: false, type: 'text' })
  content: string;

  @Column({ nullable: false, type: 'int' })
  sequence: number;

  @Column({ nullable: false, type: 'int' })
  wordCount: number;

  @Column({ nullable: false, type: 'int' })
  charCount: number;

  @Column({ type: 'json', nullable: true })
  metadata: {
    sourceType: 'paragraph' | 'sentence' | 'fixed' | 'table' | 'code';
    pageNumber?: number;
    sectionTitle?: string;
    previousChunkId?: string;
    nextChunkId?: string;
    [key: string]: any;
  };

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;
}
```

### 3. 向量索引 (VectorIndex)

```typescript
// vector-index.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { File } from './file.entity';

@Entity('vector_index')
export class VectorIndex {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  vectorId: string; // 对应向量存储中的ID

  @Column({ nullable: false })
  fileId: string;

  @ManyToOne(() => File, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fileId' })
  file: File;

  @Column({ nullable: false })
  chunkId: string;

  @Column({ type: 'json', nullable: false })
  embedding: number[]; // 实际存储可能只存引用，取决于配置

  @Column({ nullable: false })
  embeddingModel: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'json', nullable: false })
  metadata: {
    fileName: string;
    fileType: string;
    pageNumber?: number;
    sectionTitle?: string;
    wordCount: number;
    createdAt: Date;
    [key: string]: any;
  };

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true, type: 'double precision' })
  similarityScore?: number; // 仅在搜索结果中使用
}
```

### 4. 处理任务队列 (ProcessingTask)

```typescript
// processing-task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('processing_tasks')
export class ProcessingTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  fileId: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed', 'retrying'],
    default: 'pending',
  })
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'json', nullable: true })
  context: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  startedAt?: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 向量存储结构

### memU-engine 集成

OpenClaw 使用内置的 memU-engine 作为向量存储后端，支持多种部署模式：

#### 本地模式 (SQLite-Vec)
- **存储位置**: `~/.openclaw/vector-storage/`
- **文件格式**: SQLite数据库
- **向量维度**: 自动适配嵌入模型
- **索引类型**: HNSW (Hierarchical Navigable Small World)

#### 云端模式 (Pinecone/Qdrant)
- **连接配置**: 通过环境变量配置
- **命名空间**: 按工作区隔离 (`workspace-{id}`)
- **元数据**: 完整的文件和块元数据

### 向量文档结构

每个向量文档包含以下字段：

```json
{
  "id": "vector-uuid-here",
  "values": [0.1, -0.5, 0.8, ...], // 嵌入向量
  "metadata": {
    "fileId": "file-uuid-here",
    "chunkId": "chunk-uuid-here",
    "fileName": "document.pdf",
    "fileType": "application/pdf",
    "workspaceId": "workspace-123",
    "content": "Actual text content here...",
    "pageNumber": 12,
    "sectionTitle": "Payment Terms",
    "wordCount": 28,
    "createdAt": "2026-03-19T12:35:22.456Z"
  }
}
```

## 缓存策略

### Redis 缓存结构

#### 文件处理状态缓存
- **Key**: `file:status:{fileId}`
- **Value**: JSON序列化的状态对象
- **TTL**: 1小时

#### 搜索结果缓存
- **Key**: `search:{hash(query + workspaceId + topK)}`
- **Value**: JSON序列化的搜索结果
- **TTL**: 30分钟

#### 多模态分析缓存
- **Key**: `analysis:{fileId}:{hash(prompt + model)}`
- **Value**: JSON序列化的分析结果
- **TTL**: 24小时

## 文件存储结构

### 本地存储布局

```
~/.openclaw/file-storage/
├── workspaces/
│   └── {workspaceId}/
│       ├── {fileHash}.{extension}
│       └── thumbnails/
│           └── {fileHash}.jpg
└── temp/
    └── {tempFileId}
```

### 云存储适配器

支持多种云存储后端：

- **AWS S3**: `s3://{bucket}/workspaces/{workspaceId}/{fileHash}`
- **Google Cloud Storage**: `gs://{bucket}/workspaces/{workspaceId}/{fileHash}`
- **Azure Blob Storage**: `https://{account}.blob.core.windows.net/{container}/workspaces/{workspaceId}/{fileHash}`

## 索引策略

### 数据库索引

| 表 | 字段 | 类型 | 说明 |
|----|------|------|------|
| files | workspaceId, ownerId | 复合索引 | 工作区文件列表查询 |
| files | fileHash | 唯一索引 | 防止重复上传 |
| files | processingStatus | 普通索引 | 处理队列查询 |
| chunks | fileId | 普通索引 | 文件块查询 |
| vector_index | fileId | 普通索引 | 向量搜索过滤 |
| processing_tasks | status | 普通索引 | 任务队列查询 |

### 向量索引参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| dimensions | 1536 | OpenAI ada-002 维度 |
| metric | cosine | 相似度计算方式 |
| hnsw_m | 16 | HNSW M参数 |
| hnsw_ef_construction | 100 | HNSW 构建时ef参数 |
| hnsw_ef_search | 10 | HNSW 搜索时ef参数 |

## 数据生命周期

### 文件保留策略

- **活跃文件**: 永久保留
- **临时文件**: 24小时后自动清理
- **失败处理文件**: 7天后自动清理
- **已删除文件**: 立即从数据库删除，物理文件24小时后清理

### 向量数据同步

- **实时同步**: 文件处理完成后立即同步到向量存储
- **批量同步**: 支持批量导入历史文件
- **增量同步**: 只同步新处理的文件块

## 数据迁移策略

### 版本兼容性

- **向后兼容**: 新版本能读取旧版本数据
- **迁移脚本**: 提供数据库迁移脚本
- **零停机迁移**: 支持在线数据迁移

### 扩展字段

所有JSON字段都设计为可扩展，支持添加新字段而不破坏现有功能。

## 数据安全

### 加密策略

- **传输加密**: TLS 1.3+
- **存储加密**: 敏感字段AES-256加密
- **密钥管理**: 通过环境变量或密钥管理服务

### 访问控制

- **行级安全**: 基于工作区和用户权限
- **审计日志**: 所有数据访问记录
- **GDPR合规**: 支持数据导出和删除

## 性能优化

### 分区策略

- **时间分区**: 按月分区处理任务表
- **工作区分区**: 大型部署按工作区分表
- **读写分离**: 主从复制支持高并发读取

### 批量操作

- **批量插入**: 文件块和向量批量插入
- **批量删除**: 支持工作区级别批量清理
- **批量更新**: 状态批量更新优化

这个数据模型设计支持高并发、大规模文件处理，同时保持良好的扩展性和维护性。