import { Module, Global, Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class SystemMetricsService {
  getCurrentMetrics() {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    
    return {
      cpu: {
        model: cpus[0]?.model || 'Unknown',
        cores: cpus.length,
        usage: process.cpuUsage(),
      },
      memory: {
        total: Math.round(totalMemory / 1024 / 1024 / 1024),
        free: Math.round(freeMemory / 1024 / 1024 / 1024),
        used: Math.round((totalMemory - freeMemory) / 1024 / 1024 / 1024),
        usagePercent: Math.round((1 - freeMemory / totalMemory) * 100),
      },
      timestamp: new Date().toISOString(),
    };
  }
}

@Global()
@Module({
  providers: [SystemMetricsService],
  exports: [SystemMetricsService],
})
export class SystemMetricsModule {}