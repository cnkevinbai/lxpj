import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RecycleBinService } from './recycle-bin.service'

@Controller('recycle-bin')
@UseGuards(JwtAuthGuard)
export class RecycleBinController {
  constructor(private readonly recycleBinService: RecycleBinService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('entityType') entityType?: string,
  ) {
    return this.recycleBinService.findAll(page, limit, entityType)
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    await this.recycleBinService.restore(id)
    return { success: true, message: '恢复成功' }
  }

  @Post('restore-batch')
  async restoreBatch(@Body('ids') ids: string[]) {
    const count = await this.recycleBinService.restoreBatch(ids)
    return { success: true, message: `已恢复 ${count} 条记录` }
  }

  @Delete(':id')
  async deletePermanently(@Param('id') id: string) {
    await this.recycleBinService.deletePermanently(id)
    return { success: true, message: '永久删除成功' }
  }
}
