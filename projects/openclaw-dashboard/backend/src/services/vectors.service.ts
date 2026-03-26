import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { VectorIndexEntry } from '../types/file.types';

@Injectable()
export class VectorsService {
  private readonly logger = new Logger(VectorsService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly memUEngine: any;

  constructor(
    @InjectQueue('vector_embeddings') private readonly vectorQueue: Queue,
  ) {
    this.initializeMemUEngine();
  }

  private async initializeMemUEngine(): Promise<void> {
    try {
      // memU-engine 集成将在此处实现
      this.logger.log('MemU-engine initialized (placeholder)');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.warn('MemU-engine initialization failed:', errorMessage);
    }
  }

  // 文本嵌入
  public async embedText(text: string, model: string = 'text-embedding-ada-002'): Promise<number[]> {
    try {
      // 集成真实的 memU-engine API
      if (this.memUEngine && this.memUEngine.embed) {
        return await this.memUEngine.embed(text);
      }

      // 占位实现：返回随机向量
      this.logger.warn('Using placeholder embedding for text');
      return this.generateRandomEmbedding(768);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Embedding failed:', errorMessage);
      return this.generateRandomEmbedding(768);
    }
  }

  // 批量文本嵌入
  public async embedTextBatch(
    texts: string[],
    model: string = 'text-embedding-ada-002',
  ): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
      const embedding = await this.embedText(text, model);
      embeddings.push(embedding);
    }
    return embeddings;
  }

  // 保存向量索引
  public async saveVectorIndex(
    fileId: string,
    chunkId: string,
    content: string,
    embedding: number[],
  ): Promise<string> {
    const vectorId = uuidv4();

    const entry: VectorIndexEntry = {
      vectorId,
      fileId,
      chunkId,
      embedding,
      embeddingModel: 'text-embedding-ada-002',
      content,
      metadata: {
        fileName: '',
        fileType: '',
        pageNumber: 0,
        wordCount: content.length,
        createdAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const vectorPath = path.join(this.uploadDir, `${vectorId}_vector.json`);
    await fs.writeFile(vectorPath, JSON.stringify(entry, null, 2));

    this.logger.log(`Saved vector index: ${vectorId}`);
    return vectorId;
  }

  // 批量保存向量索引
  public async saveVectorIndexBatch(
    fileId: string,
    chunks: { chunkId: string; content: string; embedding: number[] }[],
  ): Promise<string[]> {
    const vectorIds: string[] = [];
    for (const chunk of chunks) {
      const vectorId = await this.saveVectorIndex(
        fileId,
        chunk.chunkId,
        chunk.content,
        chunk.embedding,
      );
      vectorIds.push(vectorId);
    }
    return vectorIds;
  }

  // 语义搜索
  public async semanticSearch(
    query: string,
    workspaceId: string,
    topK: number = 5,
    fileId?: string,
  ): Promise<any[]> {
    try {
      // 集成真实的 memU-engine 搜索 API
      if (this.memUEngine && this.memUEngine.search) {
        return await this.memUEngine.search(query, topK);
      }

      // 占位实现：返回空结果
      this.logger.warn('Using placeholder search for query');
      return [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Semantic search failed:', errorMessage);
      return [];
    }
  }

  // 混合搜索（向量 + 关键词）
  public async hybridSearch(
    query: string,
    workspaceId: string,
    topK: number = 5,
  ): Promise<any[]> {
    try {
      // 集成 memU-engine 的混合搜索
      if (this.memUEngine && this.memUEngine.hybridSearch) {
        return await this.memUEngine.hybridSearch(query, topK);
      }

      return [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error('Hybrid search failed:', errorMessage);
      return [];
    }
  }

  // 获取向量
  public async getVector(vectorId: string): Promise<VectorIndexEntry | null> {
    try {
      const vectorPath = path.join(this.uploadDir, `${vectorId}_vector.json`);
      const data = await fs.readFile(vectorPath, 'utf-8');
      return JSON.parse(data);
    } catch (error: unknown) {
      return null;
    }
  }

  // 删除向量索引
  public async deleteVectorIndex(vectorId: string): Promise<boolean> {
    try {
      const vectorPath = path.join(this.uploadDir, `${vectorId}_vector.json`);
      await fs.unlink(vectorPath);
      this.logger.log(`Deleted vector index: ${vectorId}`);
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to delete vector index: ${vectorId}`, errorMessage);
      return false;
    }
  }

  // 清理文件的向量索引
  public async deleteFileVectors(fileId: string): Promise<number> {
    let deletedCount = 0;
    try {
      const uploadDir = path.join(process.cwd(), 'uploads');
      const files = await fs.readdir(uploadDir);

      for (const file of files) {
        if (file.endsWith('_vector.json')) {
          const vectorPath = path.join(uploadDir, file);
          const data = await fs.readFile(vectorPath, 'utf-8');
          const entry = JSON.parse(data);

          if (entry.fileId === fileId) {
            await fs.unlink(vectorPath);
            deletedCount++;
          }
        }
      }

      this.logger.log(`Deleted ${deletedCount} vectors for file: ${fileId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to delete vectors for file: ${fileId}`, errorMessage);
    }

    return deletedCount;
  }

  // 生成随机嵌入（占位实现）
  private generateRandomEmbedding(dim: number): number[] {
    return Array.from({ length: dim }, () => Math.random() * 2 - 1);
  }

  // 获取嵌入维度
  public getEmbeddingDimension(): number {
    // 这里应该从 memU-engine 获取实际维度
    return 768;
  }

  // 检查向量存储状态
  public async getMetrics(): Promise<any> {
    try {
      const uploadDir = path.join(process.cwd(), 'uploads');
      const files = await fs.readdir(uploadDir);

      const vectorFiles = files.filter(f => f.endsWith('_vector.json'));
      const chunkFiles = files.filter(f => f.endsWith('_chunk.json'));

      return {
        totalVectors: vectorFiles.length,
        totalChunks: chunkFiles.length,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  }
}
