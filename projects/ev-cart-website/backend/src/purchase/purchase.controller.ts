import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
@ApiTags('采购管理')
@Controller('erp/purchase')
export class PurchaseController {
  constructor(private readonly service: PurchaseService) {}
  @Get() @ApiOperation({ summary: '获取采购订单列表' }) findAll(@Query() params: any) { return this.service.findAll(params); }
  @Post() @ApiOperation({ summary: '创建采购订单' }) create(@Body() data: any) { return this.service.create(data); }
  @Put(':id') @ApiOperation({ summary: '更新采购订单' }) update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
  @Delete(':id') @ApiOperation({ summary: '删除采购订单' }) remove(@Param('id') id: string) { return this.service.remove(id); }
}
