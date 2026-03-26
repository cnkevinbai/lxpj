import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CustomerService } from './services/customer.service'
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: '创建客户' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto)
  }

  @Get()
  @ApiOperation({ summary: '获取客户列表' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20, @Query('search') search?: string) {
    return this.customerService.findAll(page, limit, search)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取客户详情' })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新客户' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除客户' })
  remove(@Param('id') id: string) {
    return this.customerService.remove(id)
  }
}
