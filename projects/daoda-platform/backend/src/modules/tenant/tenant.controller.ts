/**
 * 租户管理 Controller
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
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { TenantService } from './tenant.service'
import { CreateTenantDto, UpdateTenantDto, TenantQueryDto } from './tenant.dto'

@ApiTags('租户管理')
@ApiBearerAuth()
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  @ApiOperation({ summary: '获取租户列表' })
  findAll(@Query() query: TenantQueryDto) {
    return this.tenantService.findAll(query)
  }

  @Get('active')
  @ApiOperation({ summary: '获取活跃租户列表' })
  getActiveTenants() {
    return this.tenantService.getActiveTenants()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取租户详情' })
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: '创建租户' })
  create(@Body() dto: CreateTenantDto) {
    return this.tenantService.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新租户' })
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantService.update(id, dto)
  }

  @Put(':id/suspend')
  @ApiOperation({ summary: '暂停租户' })
  suspend(@Param('id') id: string) {
    return this.tenantService.suspend(id)
  }

  @Put(':id/activate')
  @ApiOperation({ summary: '激活租户' })
  activate(@Param('id') id: string) {
    return this.tenantService.activate(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除租户' })
  delete(@Param('id') id: string) {
    return this.tenantService.delete(id)
  }
}