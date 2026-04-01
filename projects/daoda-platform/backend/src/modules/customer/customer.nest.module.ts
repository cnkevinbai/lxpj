/**
 * 客户管理 NestJS 包装器
 */
import { Module, Global } from '@nestjs/common'
import { CustomerService } from './customer.service'
import { CustomerController } from './customer.controller'
import { CustomerHotplugModule, CUSTOMER_HOTPLUG_MODULE } from './customer.hotplug.module'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: 'CUSTOMER_HOTPLUG_MODULE',
      useValue: new CustomerHotplugModule(),
    },
  ],
  exports: [CustomerService, 'CUSTOMER_HOTPLUG_MODULE'],
})
export class CustomerNestModule {}
