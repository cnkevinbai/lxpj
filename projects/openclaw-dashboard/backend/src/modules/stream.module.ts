/**
 * 流式响应模块
 */

import { Module } from '@nestjs/common';
import { StreamService } from '../services/stream.service';
import { StreamController } from '../controllers/stream.controller';

@Module({
  controllers: [StreamController],
  providers: [StreamService],
  exports: [StreamService],
})
export class StreamModule {}