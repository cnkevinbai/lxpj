import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HrService } from './hr.service';
@ApiTags('人力资源')
@Controller('hr')
export class HrController {
  constructor(private readonly service: HrService) {}
  @Get() @ApiOperation({ summary: '获取员工列表' }) findAll(@Query() params: any) { return this.service.findAll(params); }
  @Post() @ApiOperation({ summary: '创建员工' }) create(@Body() data: any) { return this.service.create(data); }
  @Put(':id') @ApiOperation({ summary: '更新员工' }) update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
  @Delete(':id') @ApiOperation({ summary: '删除员工' }) remove(@Param('id') id: string) { return this.service.remove(id); }
}
