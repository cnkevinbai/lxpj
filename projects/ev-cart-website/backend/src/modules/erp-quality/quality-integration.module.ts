import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { QualityIntegrationService } from './services/quality-integration.service';
import { QualityIntegrationController } from './controllers/quality-integration.controller';
import { QualityInspection } from './entities/quality-inspection.entity';
import { QualityDefect } from './entities/quality-defect.entity';
import { QualityReport } from './entities/quality-report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QualityInspection,
      QualityDefect,
      QualityReport,
    ]),
    HttpModule,
  ],
  controllers: [QualityIntegrationController],
  providers: [QualityIntegrationService],
  exports: [QualityIntegrationService],
})
export class QualityIntegrationModule {}
