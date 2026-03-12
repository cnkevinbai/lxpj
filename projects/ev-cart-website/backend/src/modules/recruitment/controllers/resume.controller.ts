import { Controller, Get, Post, Body, Param, Put, Delete, Query, ParseUUIDPipe, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { ResumeService } from './resume.service'
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto'

@ApiTags('简历管理')
@ApiBearerAuth()
@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @ApiOperation({ summary: '创建简历' })
  create(@Body() createResumeDto: CreateResumeDto) {
    return this.resumeService.create(createResumeDto)
  }

  @Post('import')
  @ApiOperation({ summary: '导入简历' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File, @Query('source') source: string = 'website') {
    const fileContent = file.buffer.toString('base64')
    return this.resumeService.import(fileContent, file.originalname, source)
  }

  @Get()
  @ApiOperation({ summary: '获取简历列表' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('jobId') jobId?: string,
    @Query('status') status?: string,
    @Query('source') source?: string,
  ) {
    return this.resumeService.findAll({ page, limit, search, jobId, status, source })
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取简历统计' })
  getStatistics() {
    return this.resumeService.getStatistics()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取简历详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.resumeService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新简历' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumeService.update(id, updateResumeDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除简历' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.resumeService.remove(id)
  }
}
