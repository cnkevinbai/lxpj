import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemSetting } from './entities/system-setting.entity'
import { SystemDictionary } from './entities/system-dictionary.entity'
import { SettingsService } from './settings.service'
import { SettingsController } from './settings.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SystemSetting, SystemDictionary])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
