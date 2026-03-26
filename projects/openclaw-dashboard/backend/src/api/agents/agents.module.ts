import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { CliModule } from '../../cli/cli.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [CliModule, ChatModule],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}