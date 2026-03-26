import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CmsService } from './cms.service';
@ApiTags('内容管理')
@Controller('cms')
export class CmsController {
  constructor(private readonly service: CmsService) {}
  @Get() @ApiOperation({ summary: '获取文章列表' }) findAll(@Query() params: any) { return this.service.findAll(params); }
  @Post() @ApiOperation({ summary: '创建文章' }) create(@Body() data: any) { return this.service.create(data); }
  @Put(':id') @ApiOperation({ summary: '更新文章' }) update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
  @Delete(':id') @ApiOperation({ summary: '删除文章' }) remove(@Param('id') id: string) { return this.service.remove(id); }
}
