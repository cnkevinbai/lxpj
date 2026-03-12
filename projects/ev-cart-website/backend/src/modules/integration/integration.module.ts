import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { CrmModule } from '../crm/crm.module';
import { ErpModule } from '../erp/erp.module';
import { CmsModule } from '../cms/cms.module';

// 集成模块 - 打通 CRM/ERP/官网 数据流
@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    CrmModule,
    ErpModule,
    CmsModule,
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
