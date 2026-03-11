import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { DealerService } from './dealer.service'
import { CreateDealerDto, UpdateDealerDto } from './dto/dealer.dto'

@ApiTags('dealers')
@Controller('dealers')
export class DealerController {
  constructor(private readonly dealerService: DealerService) {}

  @Post()
  @ApiOperation({ summary: '创建经销商' })
  create(@Body() createDealerDto: CreateDealerDto) {
    return this.dealerService.create(createDealerDto)
  }

  @Get()
  @ApiOperation({ summary: '获取经销商列表' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20, @Query('province') province?: string, @Query('status') status?: string) {
    return this.dealerService.findAll(page, limit, province, status)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取经销商统计' })
  getStatistics() {
    return this.dealerService.getStatistics()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取经销商详情' })
  findOne(@Param('id') id: string) {
    return this.dealerService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新经销商' })
  update(@Param('id') id: string, @Body() updateDealerDto: UpdateDealerDto) {
    return this.dealerService.update(id, updateDealerDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除经销商' })
  remove(@Param('id') id: string) {
    return this.dealerService.remove(id)
  }
}
