import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
@ApiTags('财务管理')
@Controller('finance')
export class FinanceController {
  constructor(private readonly service: FinanceService) {}
  @Get() @ApiOperation({ summary: '获取财务记录列表' }) findAll(@Query() params: any) { return this.service.findAll(params); }
  @Post() @ApiOperation({ summary: '创建财务记录' }) create(@Body() data: any) { return this.service.create(data); }
  @Put(':id') @ApiOperation({ summary: '更新财务记录' }) update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
  @Delete(':id') @ApiOperation({ summary: '删除财务记录' }) remove(@Param('id') id: string) { return this.service.remove(id); }
}
