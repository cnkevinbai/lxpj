import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../cms/entities/product.entity';
import { Case } from '../cms/entities/case.entity';
import { News } from '../cms/entities/news.entity';

/**
 * 搜索服务
 * 提供全站搜索功能（产品/案例/新闻）
 */
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  /**
   * 全局搜索
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    this.logger.log(`搜索：${query}`, options);

    const {
      types = ['product', 'case', 'news'],
      limit = 20,
      page = 1,
    } = options || {};

    const results: SearchResult = {
      query,
      total: 0,
      page,
      limit,
      products: [],
      cases: [],
      news: [],
    };

    // 搜索产品
    if (types.includes('product')) {
      const products = await this.searchProducts(query, limit);
      results.products = products;
      results.total += products.length;
    }

    // 搜索案例
    if (types.includes('case')) {
      const cases = await this.searchCases(query, limit);
      results.cases = cases;
      results.total += cases.length;
    }

    // 搜索新闻
    if (types.includes('news')) {
      const news = await this.searchNews(query, limit);
      results.news = news;
      results.total += news.length;
    }

    return results;
  }

  /**
   * 搜索产品
   */
  private async searchProducts(query: string, limit: number): Promise<any[]> {
    const searchTerms = query.toLowerCase().split(' ');

    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.status = :status', { status: 'published' })
      .andWhere(
        new Brackets((qb) => {
          searchTerms.forEach((term, index) => {
            qb.orWhere(`LOWER(product.name) LIKE :term${index}`, { [`term${index}`]: `%${term}%` })
              .orWhere(`LOWER(product.description) LIKE :term${index}`, { [`term${index}`]: `%${term}%` })
              .orWhere(`LOWER(product.model) LIKE :term${index}`, { [`term${index}`]: `%${term}%` });
          });
        }),
      )
      .orderBy('product.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    return products.map((product) => ({
      id: product.id,
      type: 'product',
      title: product.name,
      description: product.description,
      image: product.images?.[0],
      url: `/products/${product.id}`,
      score: this.calculateRelevance(product, query),
    }));
  }

  /**
   * 搜索案例
   */
  private async searchCases(query: string, limit: number): Promise<any[]> {
    const searchTerms = query.toLowerCase().split(' ');

    const cases = await this.caseRepository
      .createQueryBuilder('case')
      .where('case.status = :status', { status: 'published' })
      .andWhere(
        new Brackets((qb) => {
          searchTerms.forEach((term, index) => {
            qb.orWhere(`LOWER(case.title) LIKE :term${index}`, { [`term${index}`]: `%${term}%` })
              .orWhere(`LOWER(case.description) LIKE :term${index}`, { [`term${index}`]: `%${term}%` })
              .orWhere(`LOWER(case.location) LIKE :term${index}`, { [`term${index}`]: `%${term}%` });
          });
        }),
      )
      .orderBy('case.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    return cases.map((item) => ({
      id: item.id,
      type: 'case',
      title: item.title,
      description: item.description,
      image: item.images?.[0],
      url: `/cases/${item.id}`,
      score: this.calculateRelevance(item, query),
    }));
  }

  /**
   * 搜索新闻
   */
  private async searchNews(query: string, limit: number): Promise<any[]> {
    const searchTerms = query.toLowerCase().split(' ');

    const news = await this.newsRepository
      .createQueryBuilder('news')
      .where('news.status = :status', { status: 'published' })
      .andWhere(
        new Brackets((qb) => {
          searchTerms.forEach((term, index) => {
            qb.orWhere(`LOWER(news.title) LIKE :term${index}`, { [`term${index}`]: `%${term}%` })
              .orWhere(`LOWER(news.excerpt) LIKE :term${index}`, { [`term${index}`]: `%${term}%` })
              .orWhere(`LOWER(news.content) LIKE :term${index}`, { [`term${index}`]: `%${term}%` });
          });
        }),
      )
      .orderBy('news.publishedAt', 'DESC')
      .limit(limit)
      .getMany();

    return news.map((item) => ({
      id: item.id,
      type: 'news',
      title: item.title,
      description: item.excerpt,
      image: item.coverImage,
      url: `/news/${item.id}`,
      publishedAt: item.publishedAt,
      score: this.calculateRelevance(item, query),
    }));
  }

  /**
   * 计算相关性得分
   */
  private calculateRelevance(item: any, query: string): number {
    const queryLower = query.toLowerCase();
    let score = 0;

    // 标题匹配得分高
    if (item.title?.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // 描述匹配
    if (item.description?.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // 精确匹配加分
    if (item.title?.toLowerCase() === queryLower) {
      score += 20;
    }

    return score;
  }

  /**
   * 搜索建议（自动补全）
   */
  async getSuggestions(query: string, limit: number = 5): Promise<Suggestion[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const suggestions: Suggestion[] = [];

    // 产品建议
    const productSuggestions = await this.productRepository
      .createQueryBuilder('product')
      .select('product.name')
      .where('product.status = :status', { status: 'published' })
      .andWhere('LOWER(product.name) LIKE :query', { query: `%${query.toLowerCase()}%` })
      .limit(limit)
      .getRawMany();

    suggestions.push(
      ...productSuggestions.map((p: any) => ({
        text: p.product_name,
        type: 'product',
        url: `/products`,
      })),
    );

    // 热门搜索
    const hotSearches = await this.getHotSearches(limit);
    suggestions.push(...hotSearches);

    return suggestions.slice(0, limit);
  }

  /**
   * 获取热门搜索
   */
  private async getHotSearches(limit: number): Promise<Suggestion[]> {
    // TODO: 从数据库获取热门搜索词
    return [
      { text: '电动观光车', type: 'keyword', url: '/search?q=电动观光车' },
      { text: '23 座观光车', type: 'keyword', url: '/search?q=23 座观光车' },
      { text: '景区接驳车', type: 'keyword', url: '/search?q=景区接驳车' },
    ].slice(0, limit);
  }

  /**
   * 记录搜索历史
   */
  async recordSearch(query: string, userId?: string): Promise<void> {
    // TODO: 记录到数据库
    this.logger.debug(`记录搜索：${query}, userId: ${userId}`);
  }
}

// ========== 类型定义 ==========

interface SearchOptions {
  types?: ('product' | 'case' | 'news')[];
  limit?: number;
  page?: number;
}

interface SearchResult {
  query: string;
  total: number;
  page: number;
  limit: number;
  products: SearchItem[];
  cases: SearchItem[];
  news: SearchItem[];
}

interface SearchItem {
  id: string;
  type: 'product' | 'case' | 'news';
  title: string;
  description?: string;
  image?: string;
  url: string;
  score?: number;
  publishedAt?: Date;
}

interface Suggestion {
  text: string;
  type: 'product' | 'keyword';
  url: string;
}
