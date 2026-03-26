/**
 * 移动端控制器 - 精简接口/批量操作
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MobileService } from './services/mobile.service'

@Controller('mobile')
export class MobileController {
  constructor(private readonly mobileService: MobileService) {}

  // ========== 精简查询 ==========

  @Get(':entity/:id')
  async findOne(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Query('fields') fields?: string
  ) {
    const fieldList = fields ? fields.split(',') : ['id', 'name']
    return this.mobileService.findWithFields(entity, id, fieldList)
  }

  // ========== 批量操作 ==========

  @Post(':entity/batch')
  async batchCreate(
    @Param('entity') entity: string,
    @Body('items') items: any[]
  ) {
    return this.mobileService.batchCreate(entity, items)
  }

  @Put(':entity/batch')
  async batchUpdate(
    @Param('entity') entity: string,
    @Body('items') items: Array<{ id: string; [key: string]: any }>
  ) {
    return this.mobileService.batchUpdate(entity, items)
  }

  @Delete(':entity/batch')
  async batchDelete(
    @Param('entity') entity: string,
    @Body('ids') ids: string[]
  ) {
    return this.mobileService.batchDelete(entity, ids)
  }

  // ========== 游标分页 ==========

  @Get(':entity/list')
  async findWithCursor(
    @Param('entity') entity: string,
    @Query('limit') limit: number = 20,
    @Query('cursor') cursor?: string,
    @Query('filters') filters?: string
  ) {
    return this.mobileService.findWithCursor(
      entity,
      limit,
      cursor,
      filters ? JSON.parse(filters) : undefined
    )
  }

  // ========== 二维码 ==========

  @Post('qrcode/generate')
  async generateQRCode(@Body('data') data: string) {
    const qrCode = await this.mobileService.generateQRCode(data)
    return { qrCode }
  }

  @Post('qrcode/parse')
  async parseQRCode(@Body('qrCode') qrCode: string) {
    const data = this.mobileService.parseQRCode(qrCode)
    return { data }
  }

  // ========== 文件上传 ==========

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/uploads/${file.filename}`,
      filename: file.originalname,
      size: file.size
    }
  }

  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('compress') compress?: string,
    @Body('quality') quality?: string
  ) {
    // TODO: 图片压缩处理
    return {
      url: `/uploads/${file.filename}`,
      filename: file.originalname,
      size: file.size,
      compressed: compress === 'true'
    }
  }
}
