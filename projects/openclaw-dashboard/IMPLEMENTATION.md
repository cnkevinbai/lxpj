# OpenClaw 文件管理模块技术实现细节

## 目录结构

```
src/
├── modules/
│   └── file-management/
│       ├── controllers/
│       │   ├── file-upload.controller.ts
│       │   ├── multimodal.controller.ts
│       │   ├── rag.controller.ts
│       │   └── file-management.controller.ts
│       ├── services/
│       │   ├── file-upload.service.ts
│       │   ├── file-processor.service.ts
│       │   ├── multimodal.service.ts
│       │   ├── rag.service.ts
│       │   ├── metadata.service.ts
│       │   └── vector-storage.service.ts
│       ├── processors/
│       │   ├── image.processor.ts
│       │   ├── pdf.processor.ts
│       │   ├── docx.processor.ts
│       │   ├── html.processor.ts
│       │   └── text.processor.ts
│       ├── entities/
│       │   ├── file.entity.ts
│       │   ├── chunk.entity.ts
│       │   └── vector-index.entity.ts
│       ├── dtos/
│       │   ├── upload.dto.ts
│       │   ├── search.dto.ts
│       │   └── analysis.dto.ts
│       ├── interfaces/
│       │   ├── file-processor.interface.ts
│       │   └── vector-storage.interface.ts
│       ├── guards/
│       │   └── file-access.guard.ts
│       ├── interceptors/
│       │   └── file-upload.interceptor.ts
│       ├── queues/
│       │   └── processing.queue.ts
│       └── file-management.module.ts
├── shared/
│   └── memu-engine/
│       ├── memu-client.service.ts
│       └── embedding-strategies/
│           ├── openai-embedding.strategy.ts
│           └── local-embedding.strategy.ts
└── app.module.ts
```

## 核心服务实现

### 1. 文件上传服务 (file-upload.service.ts)

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { FileProcessorService } from './file-processor.service';

@Injectable()
export class FileUploadService {
  private readonly MAX_FILE_SIZE: number;
  private readonly ALLOWED_MIME_TYPES: string[] = [
    // 多模态支持
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // RAG支持
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/html', 'text/markdown', 'text/plain'
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly fileProcessorService: FileProcessorService,
  ) {
    this.MAX_FILE_SIZE = this.configService.get<number>('FILE_MAX_SIZE', 50 * 1024 * 1024); // 50MB
  }

  async validateFile(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }
    
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not supported`);
    }
  }

  async generateFileHash(buffer: Buffer): Promise<string> {
    return createHash('sha256').update(buffer).digest('hex');
  }

  async determineProcessingType(mimeType: string): Promise<'multimodal' | 'rag'> {
    const multimodalTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    return multimodalTypes.includes(mimeType) ? 'multimodal' : 'rag';
  }

  async uploadFile(
    file: Express.Multer.File,
    workspaceId: string,
    userId: string,
    metadata?: { tags?: string[], description?: string }
  ): Promise<FileMetadata> {
    await this.validateFile(file);
    
    const fileHash = await this.generateFileHash(file.buffer);
    const processingType = await this.determineProcessingType(file.mimetype);
    
    // 创建文件元数据
    const fileMetadata = await this.createFileMetadata({
      originalName: file.originalname,
      fileName: `${fileHash}.${this.getFileExtension(file.mimetype)}`,
      fileType: file.mimetype,
      fileSize: file.size,
      fileHash,
      workspaceId,
      ownerId: userId,
      processingType,
      processingStatus: 'queued',
      ...metadata
    });
    
    // 保存文件到存储
    await this.saveFileToStorage(file.buffer, fileMetadata.fileName);
    
    // 触发异步处理
    await this.fileProcessorService.queueFileProcessing(fileMetadata.id);
    
    return fileMetadata;
  }
}
```

### 2. 文件处理器服务 (file-processor.service.ts)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { FileProcessorInterface } from '../interfaces/file-processor.interface';
import { ImageProcessor } from '../processors/image.processor';
import { PdfProcessor } from '../processors/pdf.processor';
import { DocxProcessor } from '../processors/docx.processor';

@Injectable()
export class FileProcessorService {
  private readonly logger = new Logger(FileProcessorService.name);
  private readonly processors: Map<string, FileProcessorInterface> = new Map();

  constructor(
    @InjectQueue('file-processing') private readonly processingQueue: Queue,
  ) {
    // 注册处理器
    this.registerProcessors();
  }

  private registerProcessors(): void {
    this.processors.set('image/jpeg', new ImageProcessor());
    this.processors.set('image/png', new ImageProcessor());
    this.processors.set('image/gif', new ImageProcessor());
    this.processors.set('image/webp', new ImageProcessor());
    this.processors.set('image/svg+xml', new ImageProcessor());
    this.processors.set('application/pdf', new PdfProcessor());
    this.processors.set('application/vnd.openxmlformats-officedocument.wordprocessingml.document', new DocxProcessor());
    this.processors.set('application/msword', new DocxProcessor());
    // ... 其他处理器
  }

  async queueFileProcessing(fileId: string): Promise<void> {
    await this.processingQueue.add('process-file', { fileId }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      priority: 10,
    });
  }

  async processFile(fileId: string): Promise<void> {
    const fileMetadata = await this.getFileMetadata(fileId);
    
    try {
      // 更新状态为处理中
      await this.updateFileStatus(fileId, 'processing');
      
      const processor = this.processors.get(fileMetadata.fileType);
      if (!processor) {
        throw new Error(`No processor found for file type: ${fileMetadata.fileType}`);
      }
      
      if (fileMetadata.processingType === 'multimodal') {
        await this.processMultimodalFile(fileMetadata, processor);
      } else {
        await this.processRagFile(fileMetadata, processor);
      }
      
      // 更新状态为完成
      await this.updateFileStatus(fileId, 'completed');
    } catch (error) {
      this.logger.error(`Failed to process file ${fileId}: ${error.message}`, error.stack);
      await this.updateFileStatus(fileId, 'failed', error.message);
      throw error;
    }
  }
}
```

### 3. 多模态服务 (multimodal.service.ts)

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMService } from '../../shared/llm/llm.service';

@Injectable()
export class MultimodalService {
  private readonly DEFAULT_MODEL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly llmService: LLMService,
  ) {
    this.DEFAULT_MODEL = this.configService.get<string>('MULTIMODAL_DEFAULT_MODEL', 'gpt-4-vision-preview');
  }

  async analyzeImage(
    fileId: string,
    prompt?: string,
    model?: string
  ): Promise<MultimodalAnalysisResult> {
    const actualModel = model || this.DEFAULT_MODEL;
    const fileData = await this.getFileData(fileId);
    
    const analysisPrompt = prompt || 'Analyze this image and provide a detailed description of its content, including any text, objects, charts, or diagrams present.';
    
    const result = await this.llmService.analyzeImageWithText(
      fileData.buffer,
      fileData.mimeType,
      analysisPrompt,
      actualModel
    );
    
    return {
      fileId,
      analysisResult: result.text,
      modelUsed: actualModel,
      tokensUsed: result.tokens,
      timestamp: new Date(),
    };
  }
}
```

### 4. RAG服务 (rag.service.ts)

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { VectorStorageService } from './vector-storage.service';
import { MemUClientService } from '../../shared/memu-engine/memu-client.service';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly vectorStorageService: VectorStorageService,
    private readonly memuClientService: MemUClientService,
  ) {}

  async processDocumentForRag(fileId: string): Promise<void> {
    // 1. 解析文档获取文本内容
    const documentContent = await this.parseDocument(fileId);
    
    // 2. 文本分块
    const chunks = await this.chunkText(documentContent);
    
    // 3. 向量化嵌入
    const embeddings = await this.generateEmbeddings(chunks);
    
    // 4. 存储到向量索引
    await this.vectorStorageService.storeVectors(fileId, chunks, embeddings);
  }

  async searchSimilarContent(
    query: string,
    workspaceId: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    // 1. 生成查询向量
    const queryVector = await this.memuClientService.embed(query);
    
    // 2. 向量搜索
    const results = await this.vectorStorageService.search(
      queryVector,
      workspaceId,
      options.topK || 5,
      options.similarityThreshold || 0.7
    );
    
    return results;
  }

  async answerQuestion(
    fileId: string,
    question: string,
    contextChunks: number = 3
  ): Promise<AnswerResult> {
    // 1. 搜索相关上下文
    const contextResults = await this.searchSimilarContent(question, null, {
      topK: contextChunks,
      fileId,
    });
    
    // 2. 构建上下文
    const context = contextResults.map(r => r.content).join('\n\n');
    
    // 3. 调用LLM回答
    const answer = await this.llmService.answerWithContext(question, context);
    
    return {
      question,
      answer: answer.text,
      sources: contextResults.map(r => ({
        fileId: r.fileId,
        chunkId: r.chunkId,
        content: r.content,
        page: r.metadata?.pageNumber,
      })),
      modelUsed: answer.model,
    };
  }
}
```

### 5. 向量存储服务 (vector-storage.service.ts)

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MemUClientService } from '../../shared/memu-engine/memu-client.service';

@Injectable()
export class VectorStorageService {
  private readonly storageType: 'local' | 'cloud';

  constructor(
    private readonly configService: ConfigService,
    private readonly memuClientService: MemUClientService,
  ) {
    this.storageType = this.configService.get<'local' | 'cloud'>('VECTOR_STORAGE_TYPE', 'local');
  }

  async storeVectors(
    fileId: string,
    chunks: TextChunk[],
    embeddings: number[][]
  ): Promise<void> {
    const vectors = chunks.map((chunk, index) => ({
      id: chunk.chunkId,
      vector: embeddings[index],
      metadata: {
        fileId,
        chunkId: chunk.chunkId,
        content: chunk.content,
        ...chunk.metadata,
      },
    }));
    
    await this.memuClientService.upsertVectors(vectors);
  }

  async search(
    queryVector: number[],
    workspaceId: string,
    topK: number,
    similarityThreshold: number
  ): Promise<VectorSearchResult[]> {
    const filters = workspaceId ? { workspaceId } : {};
    
    const results = await this.memuClientService.search(
      queryVector,
      topK,
      similarityThreshold,
      filters
    );
    
    return results.map(result => ({
      fileId: result.metadata.fileId,
      chunkId: result.metadata.chunkId,
      content: result.metadata.content,
      similarityScore: result.score,
      metadata: result.metadata,
    }));
  }
}
```

## 前端组件实现

### 1. 文件上传组件 (FileUploadDropzone.tsx)

```tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, Loader2 } from 'lucide-react';

interface FileUploadDropzoneProps {
  onUploadComplete: (fileId: string) => void;
  allowedTypes: string[];
  maxFileSize: number;
  workspaceId: string;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onUploadComplete,
  allowedTypes,
  maxFileSize,
  workspaceId,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      formData.append('workspaceId', workspaceId);
      
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          onUploadComplete(response.fileId);
        }
        setUploading(false);
      });
      
      xhr.open('POST', '/api/files/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      xhr.send(formData);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  }, [workspaceId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize,
    multiple: false,
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-green-500" />;
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
        </div>
      ) : (
        <>
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop your file here, or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports images, PDFs, documents, and more
          </p>
        </>
      )}
    </div>
  );
};

export default FileUploadDropzone;
```

### 2. 文件预览组件 (FilePreview.tsx)

```tsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, Image as ImageIcon, Code } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// 配置PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FilePreviewProps {
  fileId: string;
  showAnalysis?: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileId, showAnalysis = false }) => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    const loadFile = async () => {
      try {
        const response = await fetch(`/api/files/${fileId}/preview`);
        const data = await response.json();
        setFileData(data);
        
        if (showAnalysis && data.processingType === 'multimodal') {
          const analysisResponse = await fetch(`/api/files/${fileId}/analyze`);
          const analysisData = await analysisResponse.json();
          setAnalysisResult(analysisData.analysisResult);
        }
      } catch (error) {
        console.error('Failed to load file:', error);
      }
    };
    
    loadFile();
  }, [fileId, showAnalysis]);

  if (!fileData) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const renderPreview = () => {
    switch (fileData.fileType) {
      case 'application/pdf':
        return (
          <div className="flex flex-col items-center">
            <Document
              file={fileData.url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="shadow-lg"
            >
              <Page pageNumber={pageNumber} />
            </Document>
            {numPages && numPages > 1 && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                  disabled={pageNumber <= 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                  disabled={pageNumber >= numPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );
      
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/webp':
        return (
          <img
            src={fileData.url}
            alt={fileData.fileName}
            className="max-w-full max-h-96 object-contain rounded shadow-lg"
          />
        );
      
      case 'image/svg+xml':
        return (
          <div className="border rounded p-4 bg-white">
            <img
              src={fileData.url}
              alt={fileData.fileName}
              className="max-w-full max-h-96"
            />
          </div>
        );
      
      case 'text/plain':
      case 'text/markdown':
        return (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {fileData.content}
          </pre>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600">Preview not available for this file type</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          {getFileIcon(fileData.fileType)}
          <span className="ml-2">{fileData.fileName}</span>
        </h3>
        {renderPreview()}
      </div>
      
      {analysisResult && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Analysis Result:</h4>
          <p className="text-blue-700 whitespace-pre-wrap">{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) {
    return <ImageIcon className="h-6 w-6" />;
  }
  return <FileText className="h-6 w-6" />;
};

export default FilePreview;
```

## 配置文件

### 1. 环境配置 (.env)

```env
# 文件管理配置
FILE_MAX_SIZE=52428800
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/html,text/markdown,text/plain

# 向量存储配置
VECTOR_STORAGE_TYPE=local
MEMU_ENGINE_URL=http://localhost:8080
EMBEDDING_MODEL=text-embedding-ada-002

# 多模态配置
MULTIMODAL_DEFAULT_MODEL=gpt-4-vision-preview
LLM_API_KEY=your-api-key-here

# 队列配置
REDIS_URL=redis://localhost:6379
```

### 2. NestJS模块配置 (file-management.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileManagementController } from './controllers/file-management.controller';
import { FileUploadController } from './controllers/file-upload.controller';
import { MultimodalController } from './controllers/multimodal.controller';
import { RagController } from './controllers/rag.controller';

import { FileUploadService } from './services/file-upload.service';
import { FileProcessorService } from './services/file-processor.service';
import { MultimodalService } from './services/multimodal.service';
import { RagService } from './services/rag.service';
import { MetadataService } from './services/metadata.service';
import { VectorStorageService } from './services/vector-storage.service';

import { File } from './entities/file.entity';
import { Chunk } from './entities/chunk.entity';
import { VectorIndex } from './entities/vector-index.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([File, Chunk, VectorIndex]),
    BullModule.registerQueueAsync({
      name: 'file-processing',
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    FileManagementController,
    FileUploadController,
    MultimodalController,
    RagController,
  ],
  providers: [
    FileUploadService,
    FileProcessorService,
    MultimodalService,
    RagService,
    MetadataService,
    VectorStorageService,
  ],
  exports: [
    FileUploadService,
    FileProcessorService,
    MultimodalService,
    RagService,
    MetadataService,
    VectorStorageService,
  ],
})
export class FileManagementModule {}
```

## 测试策略

### 1. 单元测试示例

```typescript
// file-upload.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  let service: FileUploadService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'FILE_MAX_SIZE') return 50 * 1024 * 1024;
              return null;
            }),
          },
        },
        {
          provide: FileProcessorService,
          useValue: {
            queueFileProcessing: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('validateFile', () => {
    it('should throw error for no file', async () => {
      await expect(service.validateFile(null)).rejects.toThrow('No file provided');
    });

    it('should throw error for file too large', async () => {
      const largeFile = {
        size: 60 * 1024 * 1024,
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      
      await expect(service.validateFile(largeFile)).rejects.toThrow('File size exceeds');
    });

    it('should throw error for unsupported file type', async () => {
      const unsupportedFile = {
        size: 1024,
        mimetype: 'application/zip',
      } as Express.Multer.File;
      
      await expect(service.validateFile(unsupportedFile)).rejects.toThrow('File type');
    });

    it('should pass validation for valid file', async () => {
      const validFile = {
        size: 1024,
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      
      await expect(service.validateFile(validFile)).resolves.not.toThrow();
    });
  });
});
```

### 2. 集成测试策略

- **端到端文件处理测试**: 上传文件 → 验证处理结果 → 验证检索功能
- **性能测试**: 并发上传、大文件处理、向量搜索性能
- **错误恢复测试**: 网络中断、存储失败、LLM API错误的恢复能力
- **安全测试**: 文件类型绕过、恶意文件上传、权限验证

## 部署考虑

### 1. 容器化部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY public ./public

EXPOSE 3000

CMD ["node", "dist/main"]
```

### 2. Kubernetes部署

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openclaw-file-management
spec:
  replicas: 3
  selector:
    matchLabels:
      app: openclaw-file-management
  template:
    metadata:
      labels:
        app: openclaw-file-management
    spec:
      containers:
      - name: file-management
        image: openclaw/file-management:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: openclaw-config
        - secretRef:
            name: openclaw-secrets
        volumeMounts:
        - name: file-storage
          mountPath: /app/uploads
      volumes:
      - name: file-storage
        persistentVolumeClaim:
          claimName: openclaw-file-storage
---
apiVersion: v1
kind: Service
metadata:
  name: openclaw-file-management
spec:
  selector:
    app: openclaw-file-management
  ports:
  - port: 80
    targetPort: 3000
```

这个实现提供了完整的文件管理模块架构，支持多模态直接识别和RAG文档处理两种模式，具有良好的扩展性和性能优化。