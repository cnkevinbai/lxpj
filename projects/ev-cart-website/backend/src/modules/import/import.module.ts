import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Lead } from '../lead/entities/lead.entity'
import { Customer } from '../customer/entities/customer.entity'
import { ImportService } from './import.service'
import { ImportController } from './import.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Customer])],
  controllers: [ImportController],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
