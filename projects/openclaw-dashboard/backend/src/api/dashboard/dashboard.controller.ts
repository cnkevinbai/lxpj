import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('activities')
  async getActivities() {
    return this.dashboardService.getActivities(10);
  }

  @Get('charts')
  async getCharts() {
    return this.dashboardService.getCharts();
  }
}
