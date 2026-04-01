/**
 * 营销自动化服务单元测试
 */
import { Test, TestingModule } from '@nestjs/testing'
import {
  MarketingAutomationService,
  CampaignType,
  CampaignStatus,
  AudienceType,
} from './marketing-automation.service'

describe('MarketingAutomationService', () => {
  let service: MarketingAutomationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketingAutomationService],
    }).compile()

    service = module.get<MarketingAutomationService>(MarketingAutomationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getCampaigns', () => {
    it('should return paginated campaigns list', async () => {
      const result = await service.getCampaigns({ page: 1, pageSize: 10 })

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should filter by campaign type', async () => {
      const result = await service.getCampaigns({ campaignType: CampaignType.EMAIL })

      result.data.forEach((campaign) => {
        expect(campaign.campaignType).toBe(CampaignType.EMAIL)
      })
    })

    it('should filter by status', async () => {
      const result = await service.getCampaigns({ status: CampaignStatus.RUNNING })

      result.data.forEach((campaign) => {
        expect(campaign.status).toBe(CampaignStatus.RUNNING)
      })
    })
  })

  describe('getCampaign', () => {
    it('should return a campaign by id', async () => {
      const result = await service.getCampaign('campaign-001')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('campaign-001')
      expect(result?.campaignName).toContain('春季新品')
    })
  })

  describe('createCampaign', () => {
    it('should create a new campaign', async () => {
      const newCampaign = {
        campaignName: '测试营销活动',
        campaignType: CampaignType.EMAIL,
        audienceType: AudienceType.CUSTOMERS,
        subject: '测试邮件主题',
        content: '<p>测试内容</p>',
        targetCount: 1000,
      }

      const result = await service.createCampaign(newCampaign)

      expect(result).toBeDefined()
      expect(result.campaignName).toBe('测试营销活动')
      expect(result.status).toBe(CampaignStatus.DRAFT)
      expect(result.stats.sent).toBe(0)
    })
  })

  describe('launchCampaign', () => {
    it('should launch a campaign', async () => {
      const campaign = await service.createCampaign({
        campaignName: '待发布活动',
        campaignType: CampaignType.EMAIL,
        content: '测试',
      })

      const result = await service.launchCampaign(campaign.id)

      expect(result).not.toBeNull()
      expect(result?.status).toBe(CampaignStatus.RUNNING)
      expect(result?.startedAt).toBeDefined()
    })
  })

  describe('getStats', () => {
    it('should return marketing statistics', async () => {
      const result = await service.getStats()

      expect(result).toHaveProperty('campaigns')
      expect(result).toHaveProperty('templates')
      expect(result).toHaveProperty('segments')
      expect(result).toHaveProperty('performance')
    })
  })
})
