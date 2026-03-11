import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Case } from './entities/case.entity'
import { News } from './entities/news.entity'
import { CmsService } from './cms.service'
import { CmsController } from './cms.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Case, News])],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
