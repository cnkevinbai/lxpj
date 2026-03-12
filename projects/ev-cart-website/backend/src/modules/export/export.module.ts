import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExportOrder } from './entities/export-order.entity'
import { ExportService } from './services/export.service'
import { ExportController } from './controllers/export.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ExportOrder])],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
