/**
 * 客户满意度服务单元测试
 */
import { Test, TestingModule } from '@nestjs/testing'
import {
  CustomerSatisfactionService,
  SurveyType,
  SurveyStatus,
  QuestionType,
  ComplaintStatus,
  ComplaintLevel,
  FeedbackType,
} from './customer-satisfaction.service'

describe('CustomerSatisfactionService', () => {
  let service: CustomerSatisfactionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerSatisfactionService],
    }).compile()

    service = module.get<CustomerSatisfactionService>(CustomerSatisfactionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getSurveys', () => {
    it('should return surveys list', async () => {
      const result = await service.getSurveys()

      expect(Array.isArray(result)).toBe(true)
    })

    it('should filter by survey type', async () => {
      const result = await service.getSurveys({ surveyType: SurveyType.OVERALL })

      result.forEach((survey) => {
        expect(survey.surveyType).toBe(SurveyType.OVERALL)
      })
    })

    it('should filter by status', async () => {
      const result = await service.getSurveys({ status: SurveyStatus.COMPLETED })

      result.forEach((survey) => {
        expect(survey.status).toBe(SurveyStatus.COMPLETED)
      })
    })
  })

  describe('getSurvey', () => {
    it('should return a survey by id', async () => {
      const result = await service.getSurvey('survey-001')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('survey-001')
      expect(result?.questions.length).toBeGreaterThan(0)
    })
  })

  describe('createSurvey', () => {
    it('should create a new survey', async () => {
      const result = await service.createSurvey({
        surveyName: '测试满意度调查',
        surveyType: SurveyType.CSAT,
        questions: [
          {
            id: 'q1',
            questionText: '您对服务满意吗？',
            questionType: QuestionType.SCALE,
            required: true,
            sortOrder: 1,
          },
        ],
      })

      expect(result).toBeDefined()
      expect(result.surveyName).toBe('测试满意度调查')
      expect(result.status).toBe(SurveyStatus.DRAFT)
      expect(result.questions.length).toBe(1)
    })
  })

  describe('getComplaints', () => {
    it('should return complaints list', async () => {
      const result = await service.getComplaints()

      expect(Array.isArray(result)).toBe(true)
    })

    it('should filter by status', async () => {
      const result = await service.getComplaints({ status: ComplaintStatus.RESOLVED })

      result.forEach((complaint) => {
        expect(complaint.status).toBe(ComplaintStatus.RESOLVED)
      })
    })
  })

  describe('createComplaint', () => {
    it('should create a new complaint', async () => {
      const result = await service.createComplaint({
        customerId: 'cust-001',
        customerName: '张三',
        complaintType: '服务质量',
        complaintLevel: ComplaintLevel.MEDIUM,
        title: '服务不满意',
        description: '服务态度差',
      })

      expect(result).toBeDefined()
      expect(result.status).toBe(ComplaintStatus.PENDING)
      expect(result.complaintLevel).toBe(ComplaintLevel.MEDIUM)
    })
  })

  describe('getStats', () => {
    it('should return satisfaction statistics', async () => {
      const result = await service.getStats()

      expect(result).toHaveProperty('surveys')
      expect(result).toHaveProperty('satisfaction')
      expect(result).toHaveProperty('complaints')
      expect(result).toHaveProperty('feedbacks')
    })
  })
})
