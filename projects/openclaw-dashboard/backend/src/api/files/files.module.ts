import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileParserService } from '../../services/file-parser.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, FileParserService],
  exports: [FilesService, FileParserService],
})
export class FilesModule {}