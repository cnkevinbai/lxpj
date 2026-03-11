import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FollowUpLog } from './entities/follow-up.entity'
import { FollowUpService } from './follow-up.service'
import { FollowUpController } from './follow-up.controller'

@Module({
  imports: [TypeOrmModule.forFeature([FollowUpLog])],
  controllers: [FollowUpController],
  providers: [FollowUpService],
  exports: [FollowUpService],
})
export class FollowUpModule {}
