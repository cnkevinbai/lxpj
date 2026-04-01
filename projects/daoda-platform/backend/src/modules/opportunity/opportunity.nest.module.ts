/**
 * 商机管理 NestJS 包装器
 */
import { Module, Global } from '@nestjs/common'
import { OpportunityService } from './opportunity.service'
import { OpportunityController } from './opportunity.controller'
import { OpportunityHotplugModule, OPPORTUNITY_HOTPLUG_MODULE } from './opportunity.hotplug.module'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [OpportunityController],
  providers: [
    OpportunityService,
    {
      provide: 'OPPORTUNITY_HOTPLUG_MODULE',
      useValue: new OpportunityHotplugModule(),
    },
  ],
  exports: [OpportunityService, 'OPPORTUNITY_HOTPLUG_MODULE'],
})
export class OpportunityNestModule {}
