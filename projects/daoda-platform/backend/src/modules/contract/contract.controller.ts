/**
 * 合同控制器
 */
import {
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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ContractService } from './contract.service'
import {
  CreateContractDto,
  UpdateContractDto,
  ContractQueryDto,
  ContractStatus,
} from './contract.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('服务合同管理')
@Controller('service/contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '创建服务合同' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() dto: CreateContractDto, @Request() req: any) {
    return this.contractService.create(dto, req.user?.sub)
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取服务合同列表' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ContractStatus })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'upcoming', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: ContractQueryDto) {
    return this.contractService.findAll(query)
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取服务合同详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findOne(@Param('id') id: string) {
    return this.contractService.findOne(id)
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '更新服务合同' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(@Param('id') id: string, @Body() dto: UpdateContractDto) {
    return this.contractService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '删除服务合同' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async delete(@Param('id') id: string) {
    await this.contractService.delete(id)
    return { message: '删除成功' }
  }

  @Post(':id/renew')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '合同续约' })
  @ApiResponse({ status: 200, description: '续约成功' })
  async renew(@Param('id') id: string) {
    return this.contractService.renew(id)
  }

  @Post(':id/terminate')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '合同终止' })
  @ApiResponse({ status: 200, description: '终止成功' })
  async terminate(@Param('id') id: string) {
    return this.contractService.terminate(id)
  }

  @Get('upcoming')
  @Roles('ADMIN', 'MANAGER', 'SALES')
  @ApiOperation({ summary: '获取即将到期的合同列表' })
  @ApiQuery({ name: 'days', required: false, example: 30, description: '即将到期的天数范围' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getUpcoming(@Query('days') days?: number) {
    return this.contractService.getUpcomingExpiringContracts(days)
  }

  @Get('stats')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取合同统计' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getStats() {
    return this.contractService.getStats()
  }
}
