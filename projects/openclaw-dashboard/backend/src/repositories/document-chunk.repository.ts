import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DocumentChunkRepository implements OnModuleInit {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async createChunk(chunkData: {
    fileId: string;
    chunkIndex: number;
    content: string;
    tokenCount: number;
    embeddingId?: string;
  }) {
    return this.prisma.documentChunk.create({
      data: {
        ...chunkData,
        createdAt: new Date(),
      },
    });
  }

  async findChunkById(id: string) {
    return this.prisma.documentChunk.findUnique({
      where: { id },
    });
  }

  async findChunksByFileId(fileId: string) {
    return this.prisma.documentChunk.findMany({
      where: { fileId },
      orderBy: { chunkIndex: 'asc' },
    });
  }

  async findChunksByEmbeddingId(embeddingId: string) {
    return this.prisma.documentChunk.findMany({
      where: { embeddingId },
    });
  }

  async updateChunkEmbeddingId(id: string, embeddingId: string) {
    return this.prisma.documentChunk.update({
      where: { id },
      data: { embeddingId },
    });
  }

  async deleteChunksByFileId(fileId: string) {
    return this.prisma.documentChunk.deleteMany({
      where: { fileId },
    });
  }

  async countChunksByFileId(fileId: string) {
    return this.prisma.documentChunk.count({
      where: { fileId },
    });
  }

  async findAllChunks() {
    return this.prisma.documentChunk.findMany();
  }
}