/**
 * 报价单模块
 */
import { Module } from '@nestjs/common'
import { QuotationController } from './quotation.controller'
import { QuotationService } from './quotation.service'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
