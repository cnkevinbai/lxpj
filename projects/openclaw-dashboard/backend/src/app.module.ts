import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CliModule } from './cli/cli.module';
import { WebSocketModule } from './websocket/websocket.module';
import { ChatModule } from './api/chat/chat.module';
import { DashboardModule } from './api/dashboard/dashboard.module';
import { AuthModule } from './api/auth/auth.module';
import { FilesModule } from './api/files/files.module';
import { TasksModule } from './api/tasks/tasks.module';
import { SettingsModule } from './api/settings/settings.module';
import { SystemModule } from './api/system/system.module';
import { AgentsModule } from './api/agents/agents.module';
import { NotificationsModule } from './api/notifications/notifications.module';
import { StreamModule } from './modules/stream.module';
import { SkillsModule } from './api/skills/skills.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CliModule,
    WebSocketModule,
    ChatModule,
    DashboardModule,
    AuthModule,
    FilesModule,
    TasksModule,
    SettingsModule,
    SystemModule,
    AgentsModule,
    NotificationsModule,
    StreamModule,
    SkillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}