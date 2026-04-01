/**
 * Workflow NestJS 包装器
 * 将热插拔模块包装为 NestJS 模块
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import {
  Module,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { WorkflowModule, WORKFLOW_MODULE_MANIFEST } from './workflow.module'
import {
  CreateWorkflowDefinitionDto,
  UpdateWorkflowDefinitionDto,
  StartWorkflowDto,
  ApproveDto,
  RejectDto,
  TransferDto,
  CancelDto,
  DingTalkCallbackDto,
} from './workflow.module'

// ============================================
// 流程定义控制器
// ============================================

@Controller('api/v1/workflow/definitions')
class WorkflowDefinitionController {
  constructor(private readonly workflowModule: WorkflowModule) {}

  @Get()
  async list(@Query() query: { category?: string; isActive?: boolean }) {
    return this.workflowModule.listDefinitions(query)
  }

  @Post()
  async create(@Body() body: CreateWorkflowDefinitionDto, @Request() req: any) {
    return this.workflowModule.createDefinition(body, req.user?.id)
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.workflowModule.getDefinition(id)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateWorkflowDefinitionDto) {
    return this.workflowModule.updateDefinition(id, body)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    // TODO: 实现删除逻辑
    return { success: true }
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string) {
    await this.workflowModule.activateDefinition(id)
    return { success: true }
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    await this.workflowModule.deactivateDefinition(id)
    return { success: true }
  }
}

// ============================================
// 流程实例控制器
// ============================================

@Controller('api/v1/workflow/instances')
class WorkflowInstanceController {
  constructor(private readonly workflowModule: WorkflowModule) {}

  @Post()
  async start(@Body() body: StartWorkflowDto) {
    return this.workflowModule.startWorkflow(body)
  }

  @Get('pending')
  async getPending(@Request() req: any) {
    return this.workflowModule.getMyPending(req.user?.id)
  }

  @Get('initiated')
  async getInitiated(@Request() req: any) {
    return this.workflowModule.getMyInitiated(req.user?.id)
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.workflowModule.getInstance(id)
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.workflowModule.getHistory(id)
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Body() body: ApproveDto, @Request() req: any) {
    return this.workflowModule.approve({ ...body, instanceId: id, approverId: req.user?.id })
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() body: RejectDto, @Request() req: any) {
    return this.workflowModule.reject({ ...body, instanceId: id, approverId: req.user?.id })
  }

  @Post(':id/transfer')
  async transfer(@Param('id') id: string, @Body() body: TransferDto, @Request() req: any) {
    return this.workflowModule.transfer({ ...body, instanceId: id, approverId: req.user?.id })
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Body() body: CancelDto, @Request() req: any) {
    return this.workflowModule.cancel({ ...body, instanceId: id, initiatorId: req.user?.id })
  }
}

// ============================================
// 钉钉回调控制器
// ============================================

@Controller('api/v1/workflow/dingtalk')
class DingTalkWorkflowController {
  constructor(private readonly workflowModule: WorkflowModule) {}

  @Post('sync/:id')
  async sync(@Param('id') id: string) {
    // TODO: 实现手动同步逻辑
    return { success: true }
  }

  @Post('callback')
  async callback(@Body() body: DingTalkCallbackDto) {
    await this.workflowModule.handleDingTalkCallback(body)
    return { success: true }
  }
}

// ============================================
// NestJS 模块定义
// ============================================

@Module({
  controllers: [
    WorkflowDefinitionController,
    WorkflowInstanceController,
    DingTalkWorkflowController,
  ],
  providers: [WorkflowModule],
  exports: [WorkflowModule],
})
export class WorkflowNestModule {
  // 模块清单引用
  readonly manifest = WORKFLOW_MODULE_MANIFEST
}
