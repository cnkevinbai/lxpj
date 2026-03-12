import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Dealer } from './entities/dealer.entity'
import { DealerAssessment } from './entities/dealer-assessment.entity'
import { DealerRebate } from './entities/dealer-rebate.entity'
import { DealerLevelHistory } from './entities/dealer-level-history.entity'
import { DealerService } from './dealer.service'
import { DealerController } from './dealer.controller'
import { DealerAssessmentService } from './services/dealer-assessment.service'
import { DealerRebateService } from './services/dealer-rebate.service'
import { DealerLevelService } from './services/dealer-level.service'
import { DealerAssessmentController } from './controllers/dealer-assessment.controller'
import { DealerRebateController } from './controllers/dealer-rebate.controller'
import { DealerLevelController } from './controllers/dealer-level.controller'

@Module({
  imports: [TypeOrmModule.forFeature([
    Dealer,
    DealerAssessment,
    DealerRebate,
    DealerLevelHistory,
  ])],
  controllers: [
    DealerController,
    DealerAssessmentController,
    DealerRebateController,
    DealerLevelController,
  ],
  providers: [
    DealerService,
    DealerAssessmentService,
    DealerRebateService,
    DealerLevelService,
  ],
  exports: [
    DealerService,
    DealerAssessmentService,
    DealerRebateService,
    DealerLevelService,
  ],
})
export class DealerModule {}
