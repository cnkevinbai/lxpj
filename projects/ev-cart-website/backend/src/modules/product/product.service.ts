import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Product } from './entities/product.entity'
import { CreateProductDto, UpdateProductDto } from './dto/product.dto'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existing = await this.repository.findOne({ where: { model: createProductDto.model } })
    if (existing) {
      throw new ConflictException('Product model already exists')
    }
    const product = this.repository.create(createProductDto)
    return this.repository.save(product)
  }

  async findAll(page: number = 1, limit: number = 20, category?: string, status?: string) {
    const query = this.repository.createQueryBuilder('product')
    if (category) {
      query.where('product.category = :category', { category })
    }
    if (status) {
      query.andWhere('product.status = :status', { status })
    }
    query.orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repository.findOne({ where: { id } })
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id)
    Object.assign(product, updateProductDto)
    return this.repository.save(product)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.repository.delete(id)
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.repository.find({ where: { category } })
  }

  async findFeatured(limit: number = 6): Promise<Product[]> {
    return this.repository.find({
      where: { status: 'active' },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }
}
