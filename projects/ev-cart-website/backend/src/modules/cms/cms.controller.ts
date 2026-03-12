import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CmsService } from './cms.service';

@Controller('api/v1/cms')
@UseGuards(AuthGuard('jwt'))
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // ========== Case 相关 ==========
  @Get('cases')
  async getCases(@Query('status') status?: string) {
    return this.cmsService.findAllCases(status);
  }

  @Get('cases/:id')
  async getCase(@Param('id') id: string) {
    return this.cmsService.findOneCase(id);
  }

  @Post('cases')
  async createCase(@Body() data: any) {
    return this.cmsService.createCase(data);
  }

  @Put('cases/:id')
  async updateCase(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updateCase(id, data);
  }

  @Delete('cases/:id')
  async removeCase(@Param('id') id: string) {
    return this.cmsService.removeCase(id);
  }

  @Post('cases/batch-delete')
  async batchRemoveCases(@Body('ids') ids: string[]) {
    return this.cmsService.batchRemoveCases(ids);
  }

  // ========== News 相关 ==========
  @Get('news')
  async getNews(@Query('status') status?: string, @Query('category') category?: string) {
    return this.cmsService.findAllNews(status, category);
  }

  @Get('news/:id')
  async getNewsItem(@Param('id') id: string) {
    return this.cmsService.findOneNews(id);
  }

  @Post('news')
  async createNews(@Body() data: any) {
    return this.cmsService.createNews(data);
  }

  @Put('news/:id')
  async updateNews(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updateNews(id, data);
  }

  @Delete('news/:id')
  async removeNews(@Param('id') id: string) {
    return this.cmsService.removeNews(id);
  }

  @Post('news/batch-delete')
  async batchRemoveNews(@Body('ids') ids: string[]) {
    return this.cmsService.batchRemoveNews(ids);
  }

  // ========== Video 相关 ==========
  @Get('videos')
  async getVideos(@Query('status') status?: string, @Query('category') category?: string) {
    return this.cmsService.findAllVideos(status, category);
  }

  @Get('videos/:id')
  async getVideo(@Param('id') id: string) {
    return this.cmsService.findOneVideo(id);
  }

  @Post('videos')
  async createVideo(@Body() data: any) {
    return this.cmsService.createVideo(data);
  }

  @Put('videos/:id')
  async updateVideo(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updateVideo(id, data);
  }

  @Delete('videos/:id')
  async removeVideo(@Param('id') id: string) {
    return this.cmsService.removeVideo(id);
  }

  @Post('videos/batch-delete')
  async batchRemoveVideos(@Body('ids') ids: string[]) {
    return this.cmsService.batchRemoveVideos(ids);
  }

  @Post('videos/:id/like')
  async likeVideo(@Param('id') id: string) {
    return this.cmsService.likeVideo(id);
  }

  // ========== Solution 相关 ==========
  @Get('solutions')
  async getSolutions(@Query('status') status?: string) {
    return this.cmsService.findAllSolutions(status);
  }

  @Get('solutions/:id')
  async getSolution(@Param('id') id: string) {
    return this.cmsService.findOneSolution(id);
  }

  @Post('solutions')
  async createSolution(@Body() data: any) {
    return this.cmsService.createSolution(data);
  }

  @Put('solutions/:id')
  async updateSolution(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updateSolution(id, data);
  }

  @Delete('solutions/:id')
  async removeSolution(@Param('id') id: string) {
    return this.cmsService.removeSolution(id);
  }

  @Post('solutions/batch-delete')
  async batchRemoveSolutions(@Body('ids') ids: string[]) {
    return this.cmsService.batchRemoveSolutions(ids);
  }

  // ========== 统计 ==========
  @Get('stats')
  async getStats() {
    return this.cmsService.getStats();
  }
}
