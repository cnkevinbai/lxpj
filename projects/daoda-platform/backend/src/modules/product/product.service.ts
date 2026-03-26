/**
 * 产品服务
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Product, ProductStatus } from '@prisma/client'
import { CreateProductDto, UpdateProductDto, ProductQueryDto, ProductListResponse } from './product.dto'

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name)

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.prisma.product.findUnique({ where: { code: dto.code } })
    if (existing) {
      throw new BadRequestException('产品编码已存在')
    }

    const product = await this.prisma.product.create({
      data: {
        ...dto,
        status: dto.status || ProductStatus.ACTIVE,
        price: dto.price.toString(),
      },
    })

    this.logger.log(`创建产品：${product.name}`)
    return product
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })
    if (!product) {
      throw new NotFoundException('产品不存在')
    }

    if (dto.code && dto.code !== product.code) {
      const existing = await this.prisma.product.findUnique({ where: { code: dto.code } })
      if (existing) {
        throw new BadRequestException('产品编码已被使用')
      }
    }

    const data: any = { ...dto }
    if (dto.price !== undefined) {
      data.price = dto.price.toString()
    }

    const updated = await this.prisma.product.update({ where: { id }, data })
    this.logger.log(`更新产品：${updated.name}`)
    return updated
  }

  async delete(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })
    if (!product) {
      throw new NotFoundException('产品不存在')
    }

    const orderItemCount = await this.prisma.orderItem.count({ where: { productId: id } })
    if (orderItemCount > 0) {
      throw new BadRequestException('产品已存在于订单中')
    }

    await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.DISCONTINUED },
    })

    this.logger.log(`删除产品：${product.name}`)
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })
    if (!product) {
      throw new NotFoundException('产品不存在')
    }
    return product
  }

  async findAll(query: ProductQueryDto): Promise<ProductListResponse> {
    const { page = 1, pageSize = 10, keyword, category, series, status, minPrice, maxPrice } = query
    const where: any = {  }

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { code: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    if (category) where.category = category
    if (series) where.series = series
    if (status) where.status = status

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice.toString()
      if (maxPrice !== undefined) where.price.lte = maxPrice.toString()
    }

    const total = await this.prisma.product.count({ where })
    const list = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return { list, total, page, pageSize }
  }

  async updatePrice(id: string, price: number): Promise<Product> {
    if (price < 0) {
      throw new BadRequestException('价格不能为负数')
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
    })
    if (!product) {
      throw new NotFoundException('产品不存在')
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: { price: price.toString() },
    })

    this.logger.log(`更新产品价格：${updated.name} = ${price}`)
    return updated
  }

  async batchUpdatePrice(ids: string[], price: number): Promise<number> {
    if (price < 0) {
      throw new BadRequestException('价格不能为负数')
    }

    const result = await this.prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { price: price.toString() },
    })

    return result.count
  }

  async batchAdjustPrice(ids: string[], percentage: number): Promise<number> {
    if (percentage < -100) {
      throw new BadRequestException('降价幅度不能超过 100%')
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true },
    })

    const updates = products.map((product) => {
      const oldPrice = parseFloat(product.price?.toString() || "0")
      const newPrice = oldPrice * (1 + percentage / 100)
      return this.prisma.product.update({
        where: { id: product.id },
        data: { price: newPrice.toString() },
      })
    })

    await this.prisma.$transaction(updates)
    return products.length
  }

  async getCategoryStats(): Promise<{ category: string; count: number }[]> {
    const stats = await this.prisma.product.groupBy({
      by: ['category'],
      where: { category: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    return stats.filter((s) => s.category !== null).map((s) => ({ category: s.category!, count: s._count.id }))
  }

  async getSeriesStats(): Promise<{ series: string; count: number }[]> {
    const stats = await this.prisma.product.groupBy({
      by: ['series'],
      where: { series: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    return stats.filter((s) => s.series !== null).map((s) => ({ series: s.series!, count: s._count.id }))
  }

  async getCategories(): Promise<string[]> {
    const products = await this.prisma.product.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    })
    return products.map((p) => p.category!).filter(Boolean)
  }

  async getSeries(): Promise<string[]> {
    const products = await this.prisma.product.findMany({
      where: { series: { not: null } },
      select: { series: true },
      distinct: ['series'],
    })
    return products.map((p) => p.series!).filter(Boolean)
  }
}
