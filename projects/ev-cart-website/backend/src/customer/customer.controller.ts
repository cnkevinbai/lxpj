import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService, CreateCustomerDto } from './customer.service';

@ApiTags('客户管理')
@ApiBearerAuth()
@Controller('crm/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: '获取客户列表' })
  @ApiResponse({ status: 200, description: '客户列表获取成功' })
  findAll(@Query() params: any) {
    return this.customerService.findAll(params);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取客户统计' })
  @ApiResponse({ status: 200, description: '统计获取成功' })
  getStatistics(@Query() params: any) {
    return this.customerService.getStatistics(params);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取客户详情' })
  @ApiResponse({ status: 200, description: '客户详情获取成功' })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建客户' })
  @ApiResponse({ status: 201, description: '客户创建成功' })
  create(@Body() data: CreateCustomerDto) {
    return this.customerService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新客户' })
  @ApiResponse({ status: 200, description: '客户更新成功' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.customerService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除客户' })
  @ApiResponse({ status: 200, description: '客户删除成功' })
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
