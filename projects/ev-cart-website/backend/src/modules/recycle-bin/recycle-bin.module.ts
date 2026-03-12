import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RecycleBin } from './entities/recycle-bin.entity'
import { RecycleBinService } from './recycle-bin.service'
import { RecycleBinController } from './recycle-bin.controller'

@Module({
  imports: [TypeOrmModule.forFeature([RecycleBin])],
  providers: [RecycleBinService],
  controllers: [RecycleBinController],
  exports: [RecycleBinService],
})
export class RecycleBinModule {}
