import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { RecommendService } from './services/recommend.service'

@ApiTags('recommend')
@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Get('leads')
  @ApiOperation({ summary: '推荐优先跟进的线索' })
  recommendLeads(
    @Query('userId') userId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.recommendService.recommendLeadsToFollow(userId, limit)
  }

  @Get('products/:customerId')
  @ApiOperation({ summary: '为客户推荐产品' })
  recommendProducts(@Param('customerId') customerId: string) {
    return this.recommendService.recommendProductsForCustomer(customerId)
  }

  @Get('contact-time/:customerId')
  @ApiOperation({ summary: '推荐最佳联系时间' })
  recommendContactTime(@Param('customerId') customerId: string) {
    return this.recommendService.recommendContactTime(customerId)
  }

  @Get('next-action/:customerId')
  @ApiOperation({ summary: '推荐下一步行动' })
  recommendNextAction(@Param('customerId') customerId: string) {
    return this.recommendService.recommendNextAction(customerId)
  }
}
