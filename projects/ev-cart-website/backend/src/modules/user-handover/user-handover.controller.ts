import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserHandoverService } from './user-handover.service'
import { getClientIp } from '../../common/utils/get-client-ip.util'

@ApiTags('user-handover')
@Controller('user-handover')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserHandoverController {
  constructor(private readonly handoverService: UserHandoverService) {}

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '创建离职交接单' })
  async createHandover(@Body() body: any, @Request() req: any) {
    return this.handoverService.createHandover(
      {
        leavingUserId: body.leavingUserId,
        leavingUserName: body.leavingUserName,
        receiverUserId: body.receiverUserId,
        receiverUserName: body.receiverUserName,
        handoverType: body.handoverType,
        description: body.description,
        approverId: body.approverId,
        approverName: body.approverName,
      },
      getClientIp(req),
    )
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '获取交接单列表' })
  async getHandovers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('leavingUserId') leavingUserId?: string,
    @Query('receiverUserId') receiverUserId?: string,
    @Query('status') status?: string,
    @Query('handoverType') handoverType?: string,
  ) {
    return this.handoverService.getHandovers(page, limit, {
      leavingUserId,
      receiverUserId,
      status,
      handoverType,
    })
  }

  @Get(':id')
  @ApiOperation({ summary: '获取交接单详情' })
  async getHandoverDetail(@Param('id') id: string) {
    return this.handoverService.getHandoverDetail(id)
  }

  @Post(':id/approve')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: '审批交接单' })
  async approveHandover(
    @Param('id') id: string,
    @Body('approved') approved: boolean,
    @Body('rejectReason') rejectReason?: string,
  ) {
    return this.handoverService.approveHandover(id, approved, rejectReason)
  }
}
