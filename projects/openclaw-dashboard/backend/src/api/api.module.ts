import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { AgentsController } from './agents/agents.controller';
import { AgentsService } from './agents/agents.service';
import { SystemController } from './system/system.controller';
import { SystemService } from './system/system.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { FilesController } from './files/files.controller';
import { FilesService } from './files/files.service';
import { CliModule } from '../cli/cli.module';
import { TasksModule } from './tasks/tasks.module';
import { SettingsModule } from './settings/settings.module';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';

@Module({
  imports: [CliModule, ChatModule, DashboardModule, AuthModule, TasksModule, SettingsModule],
  controllers: [
    AgentsController,
    SystemController,
    TasksController,
    FilesController,
    SettingsController,
  ],
  providers: [
    AgentsService,
    SystemService,
    TasksService,
    FilesService,
    SettingsService,
  ],
})
export class ApiModule {}
