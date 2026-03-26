import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { DatabaseModule } from '../../database/database.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [DatabaseModule, DashboardModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
