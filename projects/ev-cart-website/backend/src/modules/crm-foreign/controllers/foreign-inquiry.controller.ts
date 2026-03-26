import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

/**
 * ForeignInquiry 控制器
 */
@ApiTags('foreign-inquiry')
@Controller('foreign-inquiry')
export class ForeignInquiryController {
  @Get()
  @ApiOperation({ summary: '获取列表' })
  findAll() {
    return []
  }

  @Get(':id')
  @ApiOperation({ summary: '获取详情' })
  findOne(@Param('id') id: string) {
    return { id }
  }

  @Post()
  @ApiOperation({ summary: '创建' })
  create(@Body() body: any) {
    return body
  }

  @Put(':id')
  @ApiOperation({ summary: '更新' })
  update(@Param('id') id: string, @Body() body: any) {
    return { id, ...body }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  remove(@Param('id') id: string) {
    return { deleted: true }
  }
}
