import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './entities/case.entity';
import { News } from './entities/news.entity';
import { Video } from './entities/video.entity';
import { Solution } from './entities/solution.entity';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Solution)
    private solutionRepository: Repository<Solution>,
  ) {}

  // ========== Case 相关 ==========
  async createCase(data: any): Promise<Case> {
    const caseItem = this.caseRepository.create(data);
    return this.caseRepository.save(caseItem);
  }

  async findAllCases(status?: string) {
    const query = this.caseRepository.createQueryBuilder('case');
    if (status) {
      query.where('case.status = :status', { status });
    }
    query.orderBy('case.orderIndex', 'ASC').addOrderBy('case.createdAt', 'DESC');
    return query.getMany();
  }

  async findOneCase(id: string): Promise<Case> {
    const caseItem = await this.caseRepository.findOne({ where: { id } });
    if (!caseItem) {
      throw new NotFoundException('Case not found');
    }
    caseItem.viewCount += 1;
    await this.caseRepository.save(caseItem);
    return caseItem;
  }

  async updateCase(id: string, data: any): Promise<Case> {
    const caseItem = await this.findOneCase(id);
    Object.assign(caseItem, data);
    return this.caseRepository.save(caseItem);
  }

  async removeCase(id: string): Promise<void> {
    await this.findOneCase(id);
    await this.caseRepository.delete(id);
  }

  async batchRemoveCases(ids: string[]): Promise<void> {
    await this.caseRepository.delete(ids);
  }

  // ========== News 相关 ==========
  async createNews(data: any): Promise<News> {
    const news = this.newsRepository.create(data);
    return this.newsRepository.save(news);
  }

  async findAllNews(status?: string, category?: string) {
    const query = this.newsRepository.createQueryBuilder('news');
    if (status) {
      query.where('news.status = :status', { status });
    }
    if (category) {
      query.andWhere('news.category = :category', { category });
    }
    query.orderBy('news.publishedAt', 'DESC');
    return query.getMany();
  }

  async findOneNews(id: string): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException('News not found');
    }
    news.viewCount += 1;
    await this.newsRepository.save(news);
    return news;
  }

  async updateNews(id: string, data: any): Promise<News> {
    const news = await this.findOneNews(id);
    Object.assign(news, data);
    return this.newsRepository.save(news);
  }

  async removeNews(id: string): Promise<void> {
    await this.findOneNews(id);
    await this.newsRepository.delete(id);
  }

  async batchRemoveNews(ids: string[]): Promise<void> {
    await this.newsRepository.delete(ids);
  }

  // ========== Video 相关 ==========
  async createVideo(data: any): Promise<Video> {
    const video = this.videoRepository.create(data);
    return this.videoRepository.save(video);
  }

  async findAllVideos(status?: string, category?: string) {
    const query = this.videoRepository.createQueryBuilder('video');
    if (status) {
      query.where('video.status = :status', { status });
    }
    if (category) {
      query.andWhere('video.category = :category', { category });
    }
    query.orderBy('video.orderIndex', 'ASC').addOrderBy('video.publishedAt', 'DESC');
    return query.getMany();
  }

  async findOneVideo(id: string): Promise<Video> {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException('Video not found');
    }
    video.viewCount += 1;
    await this.videoRepository.save(video);
    return video;
  }

  async updateVideo(id: string, data: any): Promise<Video> {
    const video = await this.findOneVideo(id);
    Object.assign(video, data);
    return this.videoRepository.save(video);
  }

  async removeVideo(id: string): Promise<void> {
    await this.findOneVideo(id);
    await this.videoRepository.delete(id);
  }

  async batchRemoveVideos(ids: string[]): Promise<void> {
    await this.videoRepository.delete(ids);
  }

  async likeVideo(id: string): Promise<Video> {
    const video = await this.findOneVideo(id);
    video.likeCount += 1;
    return this.videoRepository.save(video);
  }

  // ========== Solution 相关 ==========
  async createSolution(data: any): Promise<Solution> {
    const solution = this.solutionRepository.create(data);
    return this.solutionRepository.save(solution);
  }

  async findAllSolutions(status?: string) {
    const query = this.solutionRepository.createQueryBuilder('solution');
    if (status) {
      query.where('solution.status = :status', { status });
    }
    query.orderBy('solution.orderIndex', 'ASC');
    return query.getMany();
  }

  async findOneSolution(id: string): Promise<Solution> {
    const solution = await this.solutionRepository.findOne({ where: { id } });
    if (!solution) {
      throw new NotFoundException('Solution not found');
    }
    return solution;
  }

  async updateSolution(id: string, data: any): Promise<Solution> {
    const solution = await this.findOneSolution(id);
    Object.assign(solution, data);
    return this.solutionRepository.save(solution);
  }

  async removeSolution(id: string): Promise<void> {
    await this.findOneSolution(id);
    await this.solutionRepository.delete(id);
  }

  async batchRemoveSolutions(ids: string[]): Promise<void> {
    await this.solutionRepository.delete(ids);
  }

  // ========== 统计相关 ==========
  async getStats() {
    const caseCount = await this.caseRepository.count();
    const newsCount = await this.newsRepository.count();
    const videoCount = await this.videoRepository.count();
    const solutionCount = await this.solutionRepository.count();

    const totalViews = await this.caseRepository
      .createQueryBuilder('case')
      .select('SUM(case.viewCount)', 'total')
      .getRawOne();

    return {
      caseCount,
      newsCount,
      videoCount,
      solutionCount,
      totalViews: totalViews.total || 0,
    };
  }
}
