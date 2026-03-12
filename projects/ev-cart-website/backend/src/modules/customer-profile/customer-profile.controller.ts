import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CustomerProfileService } from './customer-profile.service'

@ApiTags('customer-profile')
@Controller('customer-profile')
@UseGuards(JwtAuthGuard)
export class CustomerProfileController {
  constructor(private readonly profileService: CustomerProfileService) {}

  @Get(':id')
  @ApiOperation({ summary: '获取客户完整画像' })
  async getProfile(@Param('id') id: string) {
    return this.profileService.getCustomerProfile(id)
  }

  @Post('batch')
  @ApiOperation({ summary: '批量获取客户画像' })
  async batchGetProfiles(@Body() dto: { customerIds: string[] }) {
    return this.profileService.batchGetProfiles(dto.customerIds)
  }
}
