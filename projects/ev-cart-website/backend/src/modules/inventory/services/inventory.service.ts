import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { InventoryProduct } from './entities/inventory-product.entity'
import { InventoryTransaction } from './entities/inventory-transaction.entity'

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryProduct)
    private productRepo: Repository<InventoryProduct>,
    @InjectRepository(InventoryTransaction)
    private transactionRepo: Repository<InventoryTransaction>,
  ) {}

  /**
   * 获取库存列表
   */
  async getInventory(params: any) {
    const { page = 1, limit = 20, category, warehouse, status } = params
    const query = this.productRepo.createQueryBuilder('product')

    if (category) {
      query.andWhere('product.category = :category', { category })
    }
    if (warehouse) {
      query.andWhere('product.warehouseId = :warehouse', { warehouse })
    }
    if (status) {
      query.andWhere('product.status = :status', { status })
    }

    query.orderBy('product.productCode', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 获取库存统计
   */
  async getStatistics() {
    const totalProducts = await this.productRepo.count()
    const lowStock = await this.productRepo.count({
      where: {
        quantity: Between(1, 50),
      },
    })
    const outOfStock = await this.productRepo.count({
      where: { quantity: 0 },
    })

    const totalValue = await this.productRepo
      .createQueryBuilder('product')
      .select('SUM(product.quantity * product.unit_cost)', 'sum')
      .getRawOne()

    return {
      totalProducts,
      lowStock,
      outOfStock,
      totalValue: parseFloat(totalValue?.sum) || 0,
    }
  }

  /**
   * 入库操作
   */
  async stockIn(data: any, userId: string) {
    const product = await this.productRepo.findOne({ where: { id: data.productId } })
    if (!product) {
      throw new NotFoundException('产品不存在')
    }

    const beforeQuantity = product.quantity
    product.quantity += data.quantity
    const afterQuantity = product.quantity

    await this.productRepo.save(product)

    // 创建入库记录
    const transactionCode = `IN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const transaction = this.transactionRepo.create({
      transactionCode,
      productId: product.id,
      productCode: product.productCode,
      productName: product.productName,
      transactionType: 'stock_in',
      quantity: data.quantity,
      beforeQuantity: beforeQuantity,
      afterQuantity: afterQuantity,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      referenceCode: data.referenceCode,
      warehouseId: product.warehouseId,
      warehouseName: product.warehouseName,
      notes: data.notes,
      createdBy: userId,
    })

    await this.transactionRepo.save(transaction)

    return { product, transaction }
  }

  /**
   * 出库操作
   */
  async stockOut(data: any, userId: string) {
    const product = await this.productRepo.findOne({ where: { id: data.productId } })
    if (!product) {
      throw new NotFoundException('产品不存在')
    }

    if (product.quantity < data.quantity) {
      throw new NotFoundException('库存不足')
    }

    const beforeQuantity = product.quantity
    product.quantity -= data.quantity
    const afterQuantity = product.quantity

    await this.productRepo.save(product)

    // 创建出库记录
    const transactionCode = `OUT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    const transaction = this.transactionRepo.create({
      transactionCode,
      productId: product.id,
      productCode: product.productCode,
      productName: product.productName,
      transactionType: 'stock_out',
      quantity: data.quantity,
      beforeQuantity: beforeQuantity,
      afterQuantity: afterQuantity,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      referenceCode: data.referenceCode,
      warehouseId: product.warehouseId,
      warehouseName: product.warehouseName,
      notes: data.notes,
      createdBy: userId,
    })

    await this.transactionRepo.save(transaction)

    return { product, transaction }
  }

  /**
   * 获取库存流水
   */
  async getTransactions(params: any) {
    const { page = 1, limit = 20, productId, type } = params
    const query = this.transactionRepo.createQueryBuilder('transaction')

    if (productId) {
      query.andWhere('transaction.productId = :productId', { productId })
    }
    if (type) {
      query.andWhere('transaction.transactionType = :type', { type })
    }

    query.orderBy('transaction.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 库存预警
   */
  async getLowStockAlert() {
    const lowStockProducts = await this.productRepo
      .createQueryBuilder('product')
      .where('product.quantity <= product.safe_stock')
      .orderBy('product.quantity', 'ASC')
      .getMany()

    return lowStockProducts
  }
}
