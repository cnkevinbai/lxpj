import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FileRepository implements OnModuleInit {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async createFile(fileData: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: bigint;
    path: string;
    hash: string;
    category: string;
    status?: string;
    uploadedBy?: string;
  }) {
    return this.prisma.fileMetadata.create({
      data: {
        ...fileData,
        status: fileData.status || 'UPLOADED',
      },
    });
  }

  async findFileById(id: string) {
    return this.prisma.fileMetadata.findUnique({
      where: { id },
    });
  }

  async findFileByHash(hash: string) {
    return this.prisma.fileMetadata.findUnique({
      where: { hash },
    });
  }

  async findFilesByCategory(category: string) {
    return this.prisma.fileMetadata.findMany({
      where: { category },
    });
  }

  async findFilesByStatus(status: string) {
    return this.prisma.fileMetadata.findMany({
      where: { status },
    });
  }

  async updateFileStatus(id: string, status: string) {
    return this.prisma.fileMetadata.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  async updateFile(id: string, data: Partial<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: bigint;
    path: string;
    hash: string;
    category: string;
    status: string;
    uploadedBy: string;
  }>) {
    return this.prisma.fileMetadata.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteFile(id: string) {
    return this.prisma.fileMetadata.delete({
      where: { id },
    });
  }

  async findAllFiles() {
    return this.prisma.fileMetadata.findMany();
  }

  async findUploadedFiles() {
    return this.prisma.fileMetadata.findMany({
      where: { status: 'UPLOADED' },
    });
  }

  async findProcessingFiles() {
    return this.prisma.fileMetadata.findMany({
      where: { status: 'PROCESSING' },
    });
  }

  async findCompletedFiles() {
    return this.prisma.fileMetadata.findMany({
      where: { status: 'COMPLETED' },
    });
  }

  async findFailedFiles() {
    return this.prisma.fileMetadata.findMany({
      where: { status: 'FAILED' },
    });
  }
}