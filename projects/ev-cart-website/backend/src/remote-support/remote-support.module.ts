import { Module } from '@nestjs/common';
import { RemoteSupportController } from './remote-support.controller';
import { RemoteSupportService } from './remote-support.service';

@Module({
  controllers: [RemoteSupportController],
  providers: [RemoteSupportService],
})
export class RemoteSupportModule {}
