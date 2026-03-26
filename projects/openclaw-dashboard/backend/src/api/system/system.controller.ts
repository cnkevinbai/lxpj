import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('status')
  getStatus() {
    return this.systemService.getStatus();
  }

  @Get('health')
  getHealth() {
    return this.systemService.getHealth();
  }

  @Get('metrics')
  getMetrics() {
    return this.systemService.getMetrics();
  }

  /**
   * 重启服务
   */
  @Post('restart')
  async restartService(
    @Body() body: { service?: string; force?: boolean },
  ) {
    return this.systemService.restartService(body.service, body.force);
  }

  /**
   * 获取系统日志
   */
  @Get('logs')
  async getLogs(
    @Query('tail') tail?: number,
    @Query('grep') grep?: string,
    @Query('level') level?: string,
    @Query('service') service?: string,
  ) {
    return this.systemService.getLogs({ tail, grep, level, service });
  }

  /**
   * 运行诊断
   */
  @Post('diagnose')
  async runDiagnose() {
    return this.systemService.runDiagnose();
  }
}