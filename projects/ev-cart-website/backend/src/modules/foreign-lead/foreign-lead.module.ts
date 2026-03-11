import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ForeignLead } from './entities/foreign-lead.entity'
import { ForeignLeadService } from './foreign-lead.service'
import { ForeignLeadController } from './foreign-lead.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ForeignLead])],
  controllers: [ForeignLeadController],
  providers: [ForeignLeadService],
  exports: [ForeignLeadService],
})
export class ForeignLeadModule {}
