import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('file_processing')
export class FileProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(FileProcessingProcessor.name);

  async process(job: Job): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    
    switch (job.name) {
      case 'parse':
        return this.processParseJob(job.data);
      case 'chunk':
        return this.processChunkJob(job.data);
      case 'embed':
        return this.processEmbedJob(job.data);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async processParseJob(data: any) {
    this.logger.log(`Parsing file: ${data.fileId}`);
    // 实际解析在 FilesService 中完成
    return { success: true, fileId: data.fileId };
  }

  private async processChunkJob(data: any) {
    this.logger.log(`Chunking text for file: ${data.fileId}`);
    return { success: true, fileId: data.fileId };
  }

  private async processEmbedJob(data: any) {
    this.logger.log(`Embedding chunks for file: ${data.fileId}`);
    return { success: true, fileId: data.fileId };
  }
}