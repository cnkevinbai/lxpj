/**
 * 线索管理 NestJS 包装器
 */
import { Module, Global } from '@nestjs/common'
import { LeadService } from './lead.service'
import { LeadController } from './lead.controller'
import { LeadHotplugModule, LEAD_HOTPLUG_MODULE } from './lead.hotplug.module'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [LeadController],
  providers: [
    LeadService,
    {
      provide: 'LEAD_HOTPLUG_MODULE',
      useValue: new LeadHotplugModule(),
    },
  ],
  exports: [LeadService, 'LEAD_HOTPLUG_MODULE'],
})
export class LeadNestModule {}
