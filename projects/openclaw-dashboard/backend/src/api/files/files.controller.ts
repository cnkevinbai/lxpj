import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Res,
  UseInterceptors,
  UploadedFiles,
  Query,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FilesService } from './files.service';
import {
  UploadRequest,
  UploadResponse,
  FileStatusResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  SearchRequest,
  SearchResult,
  AskRequest,
  AskResponse,
} from '../types/file.types';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * 获取文件列表
   */
  @Get()
  async getFiles(@Query('workspaceId') workspaceId?: string): Promise<any[]> {
    return this.filesService.getAllFiles();
  }

  /**
   * 获取单个文件信息
   */
  @Get(':id')
  async getFileById(@Param('id') id: string): Promise<any> {
    return this.filesService.getFileById(id);
  }

  /**
   * 下载文件
   */
  @Get(':id/download')
  async downloadFile(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const fileInfo = await this.filesService.getFileById(id);
    const metadata = await this.filesService.getFileMetadata(id);

    if (!metadata || !metadata.storagePath) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    res.download(metadata.storagePath, fileInfo.fileName);
  }

  /**
   * 获取文件内容
   */
  @Get(':id/content')
  async getFileContent(@Param('id') id: string) {
    const metadata = await this.filesService.getFileMetadata(id);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    // 返回预览 URL 或内容
    return {
      fileId: id,
      content: '文件内容预览...',
      path: metadata.storagePath,
    };
  }

  // 通用文件上传
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { workspaceId: string; tags?: string[]; description?: string },
  ): Promise<UploadResponse | UploadResponse[]> {
    if (!files || files.length === 0) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    const workspaceId = body.workspaceId;
    const tags = body.tags || [];
    const description = body.description || '';

    const results: UploadResponse[] = [];

    for (const file of files) {
      const buffer = file.buffer;
      const originalName = file.originalname;

      const metadata = await this.filesService.saveFile(
        buffer,
        originalName,
        workspaceId,
        tags,
        description,
      );

      results.push({
        fileId: metadata.id,
        fileName: metadata.fileName,
        fileType: metadata.fileType,
        fileSize: metadata.fileSize,
        processingStatus: metadata.processingStatus,
        processingType: metadata.processingType,
        uploadTime: metadata.uploadedAt.toISOString(),
      });
    }

    return files.length === 1 ? results[0] : results;
  }

  // 获取文件状态
  @Get(':id/status')
  async getFileStatus(
    @Param('id') fileId: string,
  ): Promise<FileStatusResponse> {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return {
      fileId: metadata.id,
      processingStatus: metadata.processingStatus,
      processingType: metadata.processingType,
      progress: (metadata as any).progress || 0,
      errorMessage: metadata.processingError,
      completedAt: metadata.processedAt?.toISOString(),
    };
  }

  /**
   * 多模态分析 (支持两种路径)
   * - POST /files/:id/analyze
   * - POST /files/multimodal/:id/analyze
   */
  @Post(':id/analyze')
  async analyzeFile(
    @Param('id') fileId: string,
    @Body() body: AnalyzeRequest,
  ): Promise<AnalyzeResponse> {
    return this.performAnalyze(fileId, body);
  }

  @Post('multimodal/:id/analyze')
  async analyzeMultimodal(
    @Param('id') fileId: string,
    @Body() body: AnalyzeRequest,
  ): Promise<AnalyzeResponse> {
    return this.performAnalyze(fileId, body);
  }

  private async performAnalyze(fileId: string, body: AnalyzeRequest): Promise<AnalyzeResponse> {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    const result = await this.filesService.analyzeMultimodal(
      fileId,
      metadata.storagePath,
      metadata.fileType,
      body.prompt,
    );

    return {
      fileId,
      analysisResult: result,
      modelUsed: body.model || 'unknown',
      tokensUsed: 0,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 获取分析结果
   */
  @Get(':id/analysis')
  async getAnalysisResult(@Param('id') fileId: string) {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return {
      fileId,
      status: 'completed',
      result: '分析结果...',
      timestamp: new Date().toISOString(),
    };
  }

  // RAG 文档解析
  @Post('rag/:id/parse')
  async parseDocument(
    @Param('id') fileId: string,
  ): Promise<{ success: boolean; fileId: string }> {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    await this.filesService.parseDocument(
      fileId,
      metadata.storagePath,
      metadata.fileType,
    );

    return { success: true, fileId };
  }

  // RAG 文本分块
  @Post('rag/:id/chunk')
  async chunkText(
    @Param('id') fileId: string,
    @Body() body: { strategy?: 'paragraph' | 'sentence' | 'fixed' },
  ): Promise<{ success: boolean; fileId: string; chunkCount: number }> {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    const chunkCount = await this.filesService.chunkText(
      fileId,
      body.strategy || 'paragraph',
    );

    return {
      success: true,
      fileId,
      chunkCount,
    };
  }

  // RAG 向量化嵌入
  @Post('rag/:id/embed')
  async embedChunks(
    @Param('id') fileId: string,
  ): Promise<{ success: boolean; fileId: string }> {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    await this.filesService.embedChunks(fileId, metadata.workspaceId);

    return { success: true, fileId };
  }

  /**
   * RAG 索引 (兼容前端路径)
   */
  @Post(':id/rag/index')
  async startRagIndex(@Param('id') fileId: string) {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      fileId,
      status: 'indexing',
      message: 'RAG indexing started',
    };
  }

  /**
   * 获取 RAG 索引状态
   */
  @Get(':id/rag/index')
  async getRagIndexStatus(@Param('id') fileId: string) {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return {
      fileId,
      status: 'completed',
      chunkCount: 10,
      vectorCount: 10,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * RAG 分块列表
   */
  @Get(':id/rag/chunks')
  async getRagChunks(@Param('id') fileId: string) {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return {
      fileId,
      chunks: [
        { id: 1, content: '分块内容 1...', position: 0 },
        { id: 2, content: '分块内容 2...', position: 1 },
      ],
      total: 2,
    };
  }

  /**
   * RAG 查询 (支持两种路径)
   * - POST /files/rag/query
   * - POST /files/rag/search
   */
  @Post('rag/query')
  async ragQuery(@Body() body: any) {
    const result = await this.filesService.ragQuery(
      body.workspaceId,
      body.question || body.query,
      body.fileId,
      body.topK || 5,
    );

    return {
      question: body.question || body.query,
      answer: result.answer,
      sources: result.sources,
      timestamp: new Date().toISOString(),
    };
  }

  // RAG 语义检索
  @Post('rag/search')
  async semanticSearch(
    @Body() body: SearchRequest,
  ): Promise<SearchResult> {
    const results = await this.filesService.semanticSearch(
      body.query,
      body.workspaceId,
      body.topK || 5,
      body.similarityThreshold || 0.7,
    );

    return {
      query: body.query,
      results,
      totalResults: results.length,
    };
  }

  // RAG 问答 (按文件)
  @Post('rag/:id/query')
  async ragQueryByFile(
    @Param('id') fileId: string,
    @Body() body: AskRequest,
  ): Promise<AskResponse> {
    const metadata = await this.filesService.getFileMetadata(fileId);

    if (!metadata) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    const result = await this.filesService.ragQuery(
      metadata.workspaceId,
      body.question,
      fileId,
      body.contextChunks || 3,
    );

    return {
      question: result.question,
      answer: result.answer,
      sources: result.sources,
      modelUsed: 'unknown',
    };
  }

  // 删除文件
  @Delete(':id')
  async deleteFile(
    @Param('id') fileId: string,
  ): Promise<{ success: boolean; id: string }> {
    await this.filesService.deleteFile(fileId);
    return { success: true, id: fileId };
  }

  // ========== 新增文件解析 API ==========

  /**
   * 解析文件内容
   */
  @Post(':id/parse')
  async parseFile(
    @Param('id') fileId: string,
  ): Promise<{
    success: boolean;
    fileId: string;
    parsedData: any;
    errorMessage?: string;
  }> {
    return this.filesService.parseFile(fileId);
  }

  /**
   * 获取文件预览
   */
  @Get(':id/preview')
  async getFilePreview(
    @Param('id') fileId: string,
    @Query('page') page?: number,
    @Query('maxPages') maxPages?: number,
  ): Promise<{
    success: boolean;
    preview: any;
    errorMessage?: string;
  }> {
    return this.filesService.getFilePreview(fileId, { page, maxPages });
  }

  /**
   * 获取文件缩略图
   */
  @Get(':id/thumbnail')
  async getFileThumbnail(
    @Param('id') fileId: string,
  ): Promise<{
    success: boolean;
    thumbnail?: string;
    errorMessage?: string;
  }> {
    return this.filesService.getFileThumbnail(fileId);
  }

  /**
   * 批量解析文件
   */
  @Post('parse/batch')
  async parseFiles(
    @Body() body: { fileIds: string[] },
  ): Promise<{
    results: {
      fileId: string;
      success: boolean;
      parsedData?: any;
      errorMessage?: string;
    }[];
  }> {
    return this.filesService.parseFiles(body.fileIds);
  }
}
