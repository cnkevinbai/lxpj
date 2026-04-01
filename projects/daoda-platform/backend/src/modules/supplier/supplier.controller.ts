/**
 * 供应商管理控制器
 */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SupplierService } from './supplier.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('供应商管理')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @Roles('ADMIN', 'PURCHASER')
  @ApiOperation({ summary: '获取供应商列表' })
  findAll(@Query() query: any) {
    return this.supplierService.findAll(query)
  }

  @Get('categories')
  @ApiOperation({ summary: '获取供应商分类' })
  getCategories() {
    return this.supplierService.getCategories()
  }

  @Get('stats')
  @ApiOperation({ summary: '获取供应商统计' })
  getStats() {
    return this.supplierService.getStats()
  }

  @Get(':id')
  @Roles('ADMIN', 'PURCHASER')
  @ApiOperation({ summary: '获取供应商详情' })
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id)
  }

  @Get(':id/evaluations')
  @Roles('ADMIN', 'PURCHASER')
  @ApiOperation({ summary: '获取供应商评估历史' })
  getEvaluations(@Param('id') id: string, @Query() query: any) {
    return this.supplierService.getEvaluations(id, query)
  }

  @Post()
  @Roles('ADMIN', 'PURCHASER')
  @ApiOperation({ summary: '创建供应商' })
  create(@Body() data: any) {
    return this.supplierService.create(data)
  }

  @Put(':id')
  @Roles('ADMIN', 'PURCHASER')
  @ApiOperation({ summary: '更新供应商' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.supplierService.update(id, data)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '删除供应商' })
  delete(@Param('id') id: string) {
    return this.supplierService.delete(id)
  }

  @Post(':id/blacklist')
  @Roles('ADMIN')
  @ApiOperation({ summary: '加入黑名单' })
  blacklist(@Param('id') id: string, @Body('reason') reason: string) {
    return this.supplierService.blacklist(id, reason)
  }

  @Post(':id/evaluate')
  @Roles('ADMIN', 'PURCHASER')
  @ApiOperation({ summary: '供应商评估' })
  evaluate(@Param('id') id: string, @Body() data: any) {
    return this.supplierService.evaluate(id, data)
  }
}
