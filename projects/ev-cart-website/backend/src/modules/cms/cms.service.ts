import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Case } from './entities/case.entity'
import { News } from './entities/news.entity'

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  // Case 相关
  async createCase(data: any): Promise<Case> {
    const caseItem = this.caseRepository.create(data)
    return this.caseRepository.save(caseItem)
  }

  async findAllCases(status?: string) {
    const query = this.caseRepository.createQueryBuilder('case')
    if (status) {
      query.where('case.status = :status', { status })
    }
    query.orderBy('case.createdAt', 'DESC')
    return query.getMany()
  }

  async findOneCase(id: string): Promise<Case> {
    const caseItem = await this.caseRepository.findOne({ where: { id } })
    if (!caseItem) {
      throw new NotFoundException('Case not found')
    }
    return caseItem
  }

  async updateCase(id: string, data: any): Promise<Case> {
    const caseItem = await this.findOneCase(id)
    Object.assign(caseItem, data)
    return this.caseRepository.save(caseItem)
  }

  async removeCase(id: string): Promise<void> {
    await this.findOneCase(id)
    await this.caseRepository.delete(id)
  }

  // News 相关
  async createNews(data: any): Promise<News> {
    const news = this.newsRepository.create(data)
    return this.newsRepository.save(news)
  }

  async findAllNews(status?: string) {
    const query = this.newsRepository.createQueryBuilder('news')
    if (status) {
      query.where('news.status = :status', { status })
    }
    query.orderBy('news.createdAt', 'DESC')
    return query.getMany()
  }

  async findOneNews(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } })
    if (!news) {
      throw new NotFoundException('News not found')
    }
    news.viewCount += 1
    await this.newsRepository.save(news)
    return news
  }

  async updateNews(id: string, data: any): Promise<News> {
    const news = await this.findOneNews(id)
    Object.assign(news, data)
    return this.newsRepository.save(news)
  }

  async removeNews(id: string): Promise<void> {
    await this.findOneNews(id)
    await this.newsRepository.delete(id)
  }
}
