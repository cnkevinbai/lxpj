import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService, CreateUserDto, UpdateUserDto } from './user.service';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ status: 200, description: '用户列表获取成功' })
  findAll(@Query() params: any) {
    return this.userService.findAll(params);
  }

  @Get('engineers')
  @ApiOperation({ summary: '获取工程师列表' })
  @ApiResponse({ status: 200, description: '工程师列表获取成功' })
  getEngineers(@Query() params: any) {
    return this.userService.getEngineers(params);
  }

  @Get('supervisors')
  @ApiOperation({ summary: '获取主管列表' })
  @ApiResponse({ status: 200, description: '主管列表获取成功' })
  getSupervisors(@Query() params: any) {
    return this.userService.getSupervisors(params);
  }

  @Get('customer-services')
  @ApiOperation({ summary: '获取客服列表' })
  @ApiResponse({ status: 200, description: '客服列表获取成功' })
  getCustomerServices(@Query() params: any) {
    return this.userService.getCustomerServices(params);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  @ApiResponse({ status: 200, description: '用户详情获取成功' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户创建成功' })
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  @ApiResponse({ status: 200, description: '用户更新成功' })
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 200, description: '用户删除成功' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
