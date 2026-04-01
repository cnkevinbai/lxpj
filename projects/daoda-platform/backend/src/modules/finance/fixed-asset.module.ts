/**
 * 固定资产管理 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { FixedAssetController } from './fixed-asset.controller'
import { FixedAssetService } from './fixed-asset.service'

@Module({
  controllers: [FixedAssetController],
  providers: [FixedAssetService],
  exports: [FixedAssetService],
})
export class FixedAssetModule {}
