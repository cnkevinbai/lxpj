import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RAGIndexRepository implements OnModuleInit {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async createIndex(indexData: {
    name: string;
    documentCount?: number;
    chunkCount?: number;
    status?: string;
    config?: any;
  }) {
    return this.prisma.rAGIndex.create({
      data: {
        ...indexData,
        documentCount: indexData.documentCount || 0,
        chunkCount: indexData.chunkCount || 0,
        status: indexData.status || 'EMPTY',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findIndexById(id: string) {
    return this.prisma.rAGIndex.findUnique({
      where: { id },
    });
  }

  async findIndexByName(name: string) {
    return this.prisma.rAGIndex.findUnique({
      where: { name },
    });
  }

  async updateIndexStatus(id: string, status: string) {
    return this.prisma.rAGIndex.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  async updateIndexCounts(id: string, documentCount: number, chunkCount: number) {
    return this.prisma.rAGIndex.update({
      where: { id },
      data: { documentCount, chunkCount, updatedAt: new Date() },
    });
  }

  async updateIndexConfig(id: string, config: any) {
    return this.prisma.rAGIndex.update({
      where: { id },
      data: { config, updatedAt: new Date() },
    });
  }

  async incrementDocumentCount(id: string, increment: number = 1) {
    return this.prisma.rAGIndex.update({
      where: { id },
      data: {
        documentCount: {
          increment: increment,
        },
        updatedAt: new Date(),
      },
    });
  }

  async incrementChunkCount(id: string, increment: number = 1) {
    return this.prisma.rAGIndex.update({
      where: { id },
      data: {
        chunkCount: {
          increment: increment,
        },
        updatedAt: new Date(),
      },
    });
  }

  async deleteIndex(id: string) {
    return this.prisma.rAGIndex.delete({
      where: { id },
    });
  }

  async findAllIndexes() {
    return this.prisma.rAGIndex.findMany();
  }

  async findEmptyIndexes() {
    return this.prisma.rAGIndex.findMany({
      where: { status: 'EMPTY' },
    });
  }

  async findBuildingIndexes() {
    return this.prisma.rAGIndex.findMany({
      where: { status: 'BUILDING' },
    });
  }

  async findReadyIndexes() {
    return this.prisma.rAGIndex.findMany({
      where: { status: 'READY' },
    });
  }

  async findErrorIndexes() {
    return this.prisma.rAGIndex.findMany({
      where: { status: 'ERROR' },
    });
  }
}