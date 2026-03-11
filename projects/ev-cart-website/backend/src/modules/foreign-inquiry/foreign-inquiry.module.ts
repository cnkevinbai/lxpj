import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ForeignInquiry } from './entities/foreign-inquiry.entity'
import { ForeignInquiryService } from './foreign-inquiry.service'
import { ForeignInquiryController } from './foreign-inquiry.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ForeignInquiry])],
  controllers: [ForeignInquiryController],
  providers: [ForeignInquiryService],
  exports: [ForeignInquiryService],
})
export class ForeignInquiryModule {}
