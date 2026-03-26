import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductionService } from './production.service';

@ApiTags('生产管理')
@Controller('erp/production')
export class ProductionController {
  constructor(private readonly service: ProductionService) {}

  @Get()
  @ApiOperation({ summary: '获取生产订单列表' })
  findAll(@Query() params: any) { return this.service.findAll(params); }

  @Post()
  @ApiOperation({ summary: '创建生产订单' })
  create(@Body() data: any) { return this.service.create(data); }

  @Put(':id')
  @ApiOperation({ summary: '更新生产订单' })
  update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }

  @Delete(':id')
  @ApiOperation({ summary: '删除生产订单' })
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
