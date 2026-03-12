/**
 * 移动端专用模块
 * 渔晓白 ⚙️ · 专业交付
 */

import { Module } from '@nestjs/common'
import { MobileController } from './mobile.controller'
import { MobileService } from './mobile.service'
import { WsGateway } from './ws.gateway'

@Module({
  controllers: [MobileController],
  providers: [MobileService, WsGateway],
  exports: [MobileService, WsGateway]
})
export class MobileModule {}
