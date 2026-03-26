import { Module } from '@nestjs/common';
import { FileRepository } from './file.repository';
import { DocumentChunkRepository } from './document-chunk.repository';
import { RAGIndexRepository } from './rag-index.repository';

@Module({
  providers: [
    FileRepository,
    DocumentChunkRepository,
    RAGIndexRepository,
  ],
  exports: [
    FileRepository,
    DocumentChunkRepository,
    RAGIndexRepository,
  ],
})
export class RepositoriesModule {}