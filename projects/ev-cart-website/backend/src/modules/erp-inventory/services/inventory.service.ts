import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';

/**
 * 库存管理服务
 */
@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private dataSource: DataSource,
  ) {}

  // ========== 库存查询 ==========

  /**
   * 查询库存
   */
  async getInventory(query: InventoryQuery): Promise<InventoryResult> {
    const { warehouseId, materialId, keyword, page = 1, limit = 20 } = query;

    const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory');

    if (warehouseId) {
      queryBuilder.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    if (materialId) {
      queryBuilder.andWhere('inventory.materialId = :materialId', { materialId });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(inventory.materialName LIKE :keyword OR inventory.materialCode LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [items, total] = await queryBuilder
      .orderBy('inventory.materialName', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  // ========== 库存调整 ==========

  /**
   * 库存入库
   */
  async stockIn(data: StockAdjustmentDto): Promise<Inventory> {
    this.logger.log(`库存入库：${data.materialId}, 数量：${data.quantity}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let inventory = await queryRunner.manager.findOne(Inventory, {
        where: {
          warehouseId: data.warehouseId,
          materialId: data.materialId,
        },
      });

      if (!inventory) {
        // 创建新库存记录
        inventory = queryRunner.manager.create(Inventory, {
          warehouseId: data.warehouseId,
          warehouseName: data.warehouseName,
          materialId: data.materialId,
          materialCode: data.materialCode,
          materialName: data.materialName,
          unit: data.unit,
          onHandQuantity: 0,
          availableQuantity: 0,
        });
      }

      // 更新库存
      inventory.onHandQuantity += data.quantity;
      inventory.availableQuantity = inventory.onHandQuantity - inventory.allocatedQuantity;
      inventory.totalValue = inventory.onHandQuantity * inventory.unitCost;

      // 检查库存状态
      this.updateInventoryStatus(inventory);

      await queryRunner.manager.save(inventory);

      await queryRunner.commitTransaction();

      this.logger.log(`库存入库成功：${inventory.materialName}`);

      return inventory;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`库存入库失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 库存出库
   */
  async stockOut(data: StockAdjustmentDto): Promise<Inventory> {
    this.logger.log(`库存出库：${data.materialId}, 数量：${data.quantity}`);

    const inventory = await this.inventoryRepository.findOne({
      where: {
        warehouseId: data.warehouseId,
        materialId: data.materialId,
      },
    });

    if (!inventory) {
      throw new Error('库存记录不存在');
    }

    if (inventory.availableQuantity < data.quantity) {
      throw new Error('可用库存不足');
    }

    inventory.onHandQuantity -= data.quantity;
    inventory.availableQuantity = inventory.onHandQuantity - inventory.allocatedQuantity;
    inventory.totalValue = inventory.onHandQuantity * inventory.unitCost;

    this.updateInventoryStatus(inventory);

    await this.inventoryRepository.save(inventory);

    this.logger.log(`库存出库成功：${inventory.materialName}`);

    return inventory;
  }

  // ========== 库存预警 ==========

  /**
   * 获取低库存预警
   */
  async getLowStockAlert(): Promise<Inventory[]> {
    return this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.status = :status', { status: 'low' })
      .orWhere('inventory.onHandQuantity <= inventory.safetyStock')
      .orderBy('inventory.onHandQuantity', 'ASC')
      .getMany();
  }

  /**
   * 获取缺货预警
   */
  async getOutOfStockAlert(): Promise<Inventory[]> {
    return this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.status = :status', { status: 'out_of_stock' })
      .orderBy('inventory.materialName', 'ASC')
      .getMany();
  }

  // ========== 库存统计 ==========

  /**
   * 获取库存统计
   */
  async getStatistics(warehouseId?: string): Promise<InventoryStatistics> {
    const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory');

    if (warehouseId) {
      queryBuilder.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    const total = await queryBuilder.getCount();

    const statusCount = await queryBuilder
      .select('inventory.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('inventory.status')
      .getRawMany();

    const valueStats = await queryBuilder
      .select('SUM(inventory.totalValue)', 'totalValue')
      .getRawOne();

    return {
      total,
      statusCount: statusCount.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      totalValue: parseFloat(valueStats.totalValue) || 0,
    };
  }

  // ========== 辅助方法 ==========

  private updateInventoryStatus(inventory: Inventory): void {
    if (inventory.onHandQuantity <= 0) {
      inventory.status = 'out_of_stock';
    } else if (inventory.onHandQuantity <= inventory.safetyStock || inventory.onHandQuantity <= inventory.minQuantity) {
      inventory.status = 'low';
    } else if (inventory.onHandQuantity >= inventory.maxQuantity) {
      inventory.status = 'overstock';
    } else {
      inventory.status = 'normal';
    }
  }
}

// ========== 类型定义 ==========

interface InventoryQuery {
  warehouseId?: string;
  materialId?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

interface InventoryResult {
  items: Inventory[];
  total: number;
  page: number;
  limit: number;
}

interface StockAdjustmentDto {
  warehouseId: string;
  warehouseName: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  unit: string;
  quantity: number;
  unitCost?: number;
  notes?: string;
}

interface InventoryStatistics {
  total: number;
  statusCount: Record<string, number>;
  totalValue: number;
}
