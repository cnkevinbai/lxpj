/**
 * 培训管理服务单元测试
 */
import { Test, TestingModule } from '@nestjs/testing'
import {
  TrainingService,
  TrainingStatus,
  CourseType,
  TrainingCategory,
  RecordStatus,
} from './training.service'

describe('TrainingService', () => {
  let service: TrainingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingService],
    }).compile()

    service = module.get<TrainingService>(TrainingService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getCourses', () => {
    it('should return paginated courses list', async () => {
      const result = await service.getCourses({ page: 1, pageSize: 10 })

      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('total')
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should filter by course type', async () => {
      const result = await service.getCourses({ courseType: CourseType.INTERNAL })

      result.data.forEach((course) => {
        expect(course.courseType).toBe(CourseType.INTERNAL)
      })
    })

    it('should filter by category', async () => {
      const result = await service.getCourses({ category: TrainingCategory.INDUCTION })

      result.data.forEach((course) => {
        expect(course.category).toBe(TrainingCategory.INDUCTION)
      })
    })
  })

  describe('getCourse', () => {
    it('should return a course by id', async () => {
      const result = await service.getCourse('course-001')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('course-001')
      expect(result?.courseName).toContain('入职培训')
    })

    it('should return null for non-existent course', async () => {
      const result = await service.getCourse('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('createCourse', () => {
    it('should create a new course', async () => {
      const newCourse = {
        courseName: '测试课程',
        courseType: CourseType.INTERNAL,
        category: TrainingCategory.SKILL,
        duration: 4,
        credits: 1,
      }

      const result = await service.createCourse(newCourse)

      expect(result).toBeDefined()
      expect(result.courseName).toBe('测试课程')
      expect(result.status).toBe('ACTIVE')
      expect(result.totalTrainings).toBe(0)
    })
  })

  describe('createPlan', () => {
    it('should create a training plan', async () => {
      const result = await service.createPlan({
        courseId: 'course-001',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        maxParticipants: 30,
      })

      expect(result).toBeDefined()
      expect(result.courseId).toBe('course-001')
      expect(result.status).toBe(TrainingStatus.DRAFT)
      expect(result.currentParticipants).toBe(0)
    })
  })

  describe('publishPlan', () => {
    it('should publish a training plan', async () => {
      const plan = await service.createPlan({
        courseId: 'course-001',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
      })

      const result = await service.publishPlan(plan.id)

      expect(result).not.toBeNull()
      expect(result?.status).toBe(TrainingStatus.PUBLISHED)
    })
  })

  describe('getStats', () => {
    it('should return training statistics', async () => {
      const result = await service.getStats()

      expect(result).toHaveProperty('courses')
      expect(result).toHaveProperty('plans')
      expect(result).toHaveProperty('records')
      expect(result).toHaveProperty('byCategory')
    })
  })
})
