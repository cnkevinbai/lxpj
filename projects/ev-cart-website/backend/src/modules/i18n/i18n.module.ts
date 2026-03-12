import { Global, Module } from '@nestjs/common'
import { I18nService } from './i18n.service'
import { I18nController } from './i18n.controller'

@Global()
@Module({
  providers: [I18nService],
  controllers: [I18nController],
  exports: [I18nService],
})
export class I18nModule {}
