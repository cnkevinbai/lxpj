import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { writeFile, unlink, mkdir, readFile, stat, access, readdir } from 'fs/promises';
import { join, basename, extname } from 'path';
import { existsSync } from 'fs';
import {
  ProcessingType,
  ProcessingStatus,
  FileMetadata,
  VectorIndexEntry,
  TextChunk,
  UploadResponse,
  FileStatusResponse,
} from '../types/file.types';
import { v4 as uuidv4 } from 'uuid';
import { FileParserService } from '../../services/file-parser.service';

// 本地 FileInfo 类型
interface FileInfo {
  id: string;
  workspaceId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  size: number;
  type: string;
  processingType: ProcessingType;
  processingStatus: ProcessingStatus;
  uploadTime: string;
  path?: string;
  modified?: string;
  mimeType?: string;
}

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadDir = join(process.cwd(), 'uploads');
  private fileCounter = 0;

  constructor(private readonly fileParser: FileParserService) {
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      if (!existsSync(this.uploadDir)) {
        await mkdir(this.uploadDir, { recursive: true });
      }
    } catch (error) {
      this.logger.error('Failed to create upload directory:', (error as Error).message);
    }
  }

  private generateFileId(): string {
    this.fileCounter++;
    return `file_${Date.now()}_${this.fileCounter}`;
  }

  private getMimeType(filePath: string): string {
    const ext = extname(filePath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.markdown': 'text/markdown',
      '.js': 'text/javascript',
      '.ts': 'text/typescript',
      '.json': 'application/json',
      '.html': 'text/html',
      '.css': 'text/css',
      '.py': 'text/x-python',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return mimeMap[ext] || 'application/octet-stream';
  }

  async getAllFiles(): Promise<FileInfo[]> {
    try {
      const entries = await readdir(this.uploadDir, { withFileTypes: true });
      const files: FileInfo[] = [];

      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.json')) {
          const fullPath = join(this.uploadDir, entry.name);
          try {
            const data = await readFile(fullPath, 'utf-8');
            const metadata = JSON.parse(data);
            if (metadata.fileName) {
              files.push({
                id: metadata.id,
                workspaceId: metadata.workspaceId || '',
                fileName: metadata.fileName,
                originalName: metadata.originalName || '',
                fileType: metadata.fileType || '',
                fileSize: metadata.fileSize || 0,
                size: metadata.fileSize || 0,
                type: 'file',
                processingType: metadata.processingType || 'none',
                processingStatus: metadata.processingStatus || 'completed',
                uploadTime: metadata.uploadedAt?.toISOString() || '',
                path: metadata.storagePath,
                modified: metadata.uploadedAt?.toString() || '',
                mimeType: metadata.fileType,
              });
            }
          } catch (error) {
            this.logger.warn(`Failed to read metadata file ${entry.name}:`, (error as Error).message);
          }
        }
      }

      return files;
    } catch (error) {
      this.logger.error('Failed to list files:', (error as Error).message);
      return [];
    }
  }

  async getFileById(id: string): Promise<FileInfo> {
    const metadata = await this.getFileMetadata(id);

    if (!metadata) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return {
      id: metadata.id,
      workspaceId: metadata.workspaceId || '',
      fileName: metadata.fileName,
      originalName: metadata.originalName || '',
      fileType: metadata.fileType || '',
      fileSize: metadata.fileSize || 0,
      size: metadata.fileSize || 0,
      type: 'file',
      processingType: metadata.processingType || 'none',
      processingStatus: metadata.processingStatus || 'completed',
      uploadTime: metadata.uploadedAt?.toISOString() || '',
      path: metadata.storagePath,
      modified: metadata.uploadedAt?.toString() || '',
      mimeType: metadata.fileType,
    };
  }

  async saveFile(
    buffer: Buffer,
    originalName: string,
    workspaceId: string,
    tags: string[] = [],
    description: string = '',
  ): Promise<FileMetadata> {
    await this.ensureUploadDir();

    const fileId = uuidv4();
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = join(this.uploadDir, `${fileId}_${safeName}`);

    // Save the file
    await writeFile(filePath, buffer);

    const stats = await stat(filePath);
    const mimeType = this.getMimeType(safeName);
    const processingType = this.determineProcessingType(mimeType);

    const fileMetadata: FileMetadata = {
      id: fileId,
      workspaceId,
      fileName: safeName,
      originalName,
      fileType: mimeType,
      fileSize: stats.size,
      fileHash: '', // SHA256 hash
      processingType,
      processingStatus: processingType === 'none' ? 'completed' : 'queued',
      tags,
      description,
      uploadedAt: new Date(),
      updatedAt: new Date(),
      storagePath: filePath,
      storageType: 'local',
      ownerId: workspaceId,
      sharedWith: [],
    };

    // 保存元数据
    const metadataPath = join(this.uploadDir, `${fileId}_metadata.json`);
    await writeFile(metadataPath, JSON.stringify(fileMetadata, null, 2));

    this.logger.log(`File saved: ${fileId} (${originalName})`);
    return fileMetadata;
  }

  async getFileMetadata(fileId: string): Promise<FileMetadata | null> {
    try {
      const metadataPath = join(this.uploadDir, `${fileId}_metadata.json`);
      if (!existsSync(metadataPath)) {
        return null;
      }
      const data = await readFile(metadataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Failed to load metadata for ${fileId}:`, (error as Error).message);
      return null;
    }
  }

  async deleteFile(id: string): Promise<{ success: boolean; id: string }> {
    const metadata = await this.getFileMetadata(id);
    
    if (!metadata || !existsSync(metadata.storagePath)) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    await unlink(metadata.storagePath);

    // 删除元数据文件
    const metadataPath = join(this.uploadDir, `${id}_metadata.json`);
    if (existsSync(metadataPath)) {
      await unlink(metadataPath);
    }

    return { success: true, id };
  }

  // 确定处理类型
  private determineProcessingType(mimeType: string): ProcessingType {
    const multimodalTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];
    
    const ragTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/html',
      'text/markdown',
      'text/plain',
    ];

    if (multimodalTypes.includes(mimeType)) {
      return 'multimodal';
    } else if (ragTypes.includes(mimeType)) {
      return 'rag';
    }
    return 'none';
  }

  // 多模态分析（占位实现）
  async analyzeMultimodal(
    fileId: string,
    filePath: string,
    mimeType: string,
    prompt?: string,
  ): Promise<string> {
    // 集成多模态 LLM API
    this.logger.log(`Analyzing multimodal file: ${fileId}`);
    return '多模态分析结果: 这是一个占位的分析结果。';
  }

  // 文档解析（占位实现）
  async parseDocument(
    fileId: string,
    filePath: string,
    mimeType: string,
  ): Promise<string> {
    // 集成文档解析器
    this.logger.log(`Parsing document: ${fileId}`);
    return '文档内容: 这是一个占位的解析结果。';
  }

  // 文本分块（占位实现）
  async chunkText(
    fileId: string,
    strategy: 'paragraph' | 'sentence' | 'fixed' = 'paragraph',
  ): Promise<number> {
    // 集成文本分块
    this.logger.log(`Chunking text for: ${fileId}`);
    return 0;
  }

  // 向量化嵌入（占位实现）
  async embedChunks(fileId: string, workspaceId: string): Promise<void> {
    // 集成向量嵌入服务
    this.logger.log(`Embedding chunks for: ${fileId}`);
  }

  // 语义搜索（占位实现）
  async semanticSearch(
    query: string,
    workspaceId: string,
    topK: number = 5,
    similarityThreshold: number = 0.7,
  ): Promise<any[]> {
    // 集成向量搜索
    this.logger.log(`Semantic search: ${query}`);
    return [];
  }

  // RAG 问答（占位实现）
  async ragQuery(
    workspaceId: string,
    question: string,
    fileId?: string,
    contextChunks: number = 3,
  ): Promise<any> {
    // 集成 RAG 问答
    this.logger.log(`RAG query: ${question}`);
    return {
      question,
      answer: 'RAG 回答: 这是一个占位的问答结果。',
      sources: [],
    };
  }

  // ========== 新增文件解析方法 ==========

  /**
   * 解析文件内容
   */
  async parseFile(
    fileId: string,
  ): Promise<{
    success: boolean;
    fileId: string;
    parsedData: any;
    errorMessage?: string;
  }> {
    const metadata = await this.getFileMetadata(fileId);
    
    if (!metadata) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    if (!metadata.storagePath || !existsSync(metadata.storagePath)) {
      throw new NotFoundException(`File not found at storage path`);
    }

    try {
      const buffer = await readFile(metadata.storagePath);
      const parsedData = await this.fileParser.parseFileByType(
        buffer,
        metadata.fileType,
      );

      return {
        success: true,
        fileId,
        parsedData,
      };
    } catch (error) {
      this.logger.error(`Failed to parse file ${fileId}:`, (error as Error).message);
      
      return {
        success: false,
        fileId,
        parsedData: null,
        errorMessage: (error as Error).message,
      };
    }
  }

  /**
   * 获取文件预览
   */
  async getFilePreview(
    fileId: string,
    options?: { page?: number; maxPages?: number },
  ): Promise<{
    success: boolean;
    preview: any;
    errorMessage?: string;
  }> {
    const metadata = await this.getFileMetadata(fileId);
    
    if (!metadata) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    try {
      const buffer = await readFile(metadata.storagePath);

      if (metadata.fileType === 'application/pdf') {
        const pages = await this.fileParser.generatePDFPreview(
          buffer,
          options ? [options.page || 0] : [0],
        );
        
        return {
          success: true,
          preview: {
            type: 'pdf',
            pages,
            pageCount: (metadata as any).pageCount || 1,
          },
        };
      } else if (metadata.fileType.startsWith('image/')) {
        const analysis = await this.fileParser.analyzeImage(buffer, metadata.fileType);
        
        return {
          success: true,
          preview: {
            type: 'image',
            width: analysis.width,
            height: analysis.height,
            format: analysis.format,
            thumbnail: analysis.thumbnail,
            metadata: analysis.metadata,
          },
        };
      } else if (metadata.fileType === 'text/html') {
        const parsed = await this.fileParser.parseHTML(buffer);
        
        return {
          success: true,
          preview: {
            type: 'html',
            title: parsed.title,
            text: parsed.text,
            links: parsed.links,
            images: parsed.images,
          },
        };
      } else {
        // For text-based files, return the text content
        const textData = await this.fileParser.parseText(buffer, metadata.fileType);
        
        return {
          success: true,
          preview: {
            type: 'text',
            text: textData.text.substring(0, 10000), // Limit to first 10k chars
            lines: textData.lines,
            words: textData.words,
          },
        };
      }
    } catch (error) {
      this.logger.error(`Failed to generate preview for ${fileId}:`, (error as Error).message);
      
      return {
        success: false,
        preview: null,
        errorMessage: (error as Error).message,
      };
    }
  }

  /**
   * 获取文件缩略图
   */
  async getFileThumbnail(
    fileId: string,
  ): Promise<{
    success: boolean;
    thumbnail?: string;
    errorMessage?: string;
  }> {
    const metadata = await this.getFileMetadata(fileId);
    
    if (!metadata) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    try {
      const buffer = await readFile(metadata.storagePath);

      if (metadata.fileType.startsWith('image/')) {
        const analysis = await this.fileParser.analyzeImage(buffer, metadata.fileType);
        
        return {
          success: true,
          thumbnail: analysis.thumbnail,
        };
      } else if (metadata.fileType === 'application/pdf') {
        const pages = await this.fileParser.generatePDFPreview(buffer, [0]);
        
        if (pages.length > 0) {
          return {
            success: true,
            thumbnail: pages[0].dataUrl,
          };
        }
      }

      // No thumbnail available
      return {
        success: true,
        thumbnail: undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to generate thumbnail for ${fileId}:`, (error as Error).message);
      
      return {
        success: false,
        thumbnail: undefined,
        errorMessage: (error as Error).message,
      };
    }
  }

  /**
   * 批量解析文件
   */
  async parseFiles(fileIds: string[]): Promise<{
    results: {
      fileId: string;
      success: boolean;
      parsedData?: any;
      errorMessage?: string;
    }[];
  }> {
    const results: {
      fileId: string;
      success: boolean;
      parsedData?: any;
      errorMessage?: string;
    }[] = [];

    for (const fileId of fileIds) {
      const result = await this.parseFile(fileId);
      results.push({
        fileId,
        success: result.success,
        parsedData: result.parsedData,
        errorMessage: result.errorMessage,
      });
    }

    return { results };
  }
}
