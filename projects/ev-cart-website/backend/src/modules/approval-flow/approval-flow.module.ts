/**
 * 审批流模块 - 内部审批 + 第三方集成
 * 渔晓白 ⚙️ · 专业交付
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApprovalFlow } from './entities/approval-flow.entity'
import { ApprovalNode } from './entities/approval-node.entity'
import { ApprovalRecord } from './entities/approval-record.entity'
import { ApprovalFlowService } from './approval-flow.service'
import { ApprovalFlowController } from './approval-flow.controller'
import { IntegrationModule } from '../integration/integration.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ApprovalFlow, ApprovalNode, ApprovalRecord]),
    IntegrationModule,
  ],
  providers: [ApprovalFlowService],
  controllers: [ApprovalFlowController],
  exports: [ApprovalFlowService],
})
export class ApprovalFlowModule {}
