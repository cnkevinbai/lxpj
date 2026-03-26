import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
@ApiTags('库存管理')
@Controller('erp/inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}
  @Get() @ApiOperation({ summary: '获取库存列表' }) findAll(@Query() params: any) { return this.service.findAll(params); }
  @Post() @ApiOperation({ summary: '创建库存记录' }) create(@Body() data: any) { return this.service.create(data); }
  @Put(':id') @ApiOperation({ summary: '更新库存记录' }) update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
  @Delete(':id') @ApiOperation({ summary: '删除库存记录' }) remove(@Param('id') id: string) { return this.service.remove(id); }
}
