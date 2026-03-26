import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import { DashboardStats, ChartData, AgentUsage } from './dashboard.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getStats(): Promise<DashboardStats> {
    return this.dashboardRepository.getStats();
  }

  async getActivities(limit: number = 10) {
    return this.dashboardRepository.getActivities(limit);
  }

  async getCharts() {
    const [trends, agentUsage] = await Promise.all([
      this.dashboardRepository.get7DayTrends(),
      this.dashboardRepository.getAgentUsage(),
    ]);

    return {
      messageTrends: {
        labels: trends.labels,
        datasets: [
          {
            label: '消息数量',
            data: trends.data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.4,
          },
        ],
      },
      agentUsage: {
        labels: agentUsage.map(a => a.agentId),
        datasets: [
          {
            label: '使用次数',
            data: agentUsage.map(a => a.count),
            backgroundColor: agentUsage.map((_, i) => 
              this.getRandomColor(i)
            ),
          },
        ],
      },
    };
  }

  private getRandomColor(index: number): string {
    const colors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
    ];
    return colors[index % colors.length];
  }
}
