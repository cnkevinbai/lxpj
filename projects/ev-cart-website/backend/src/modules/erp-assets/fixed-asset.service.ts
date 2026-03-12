import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FixedAsset } from './entities/fixed-asset.entity';

/**
 * 固定资产服务
 */
@Injectable()
export class FixedAssetService {
  private readonly logger = new Logger(FixedAssetService.name);

  constructor(
    @InjectRepository(FixedAsset)
    private fixedAssetRepository: Repository<FixedAsset>,
    private dataSource: DataSource,
  ) {}

  // ========== 资产购置 ==========

  /**
   * 购置固定资产
   */
  async purchaseAsset(data: PurchaseAssetDto): Promise<FixedAsset> {
    this.logger.log(`购置固定资产：${data.assetName}, ${data.originalValue}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 生成资产编码
      const assetCode = await this.generateAssetCode(data.assetType);

      // 2. 创建资产
      const asset = queryRunner.manager.create(FixedAsset, {
        assetCode,
        ...data,
        status: 'available',
        salvageValue: data.originalValue * (data.salvageRate / 100),
        netValue: data.originalValue,
      });

      await queryRunner.manager.save(asset);

      await queryRunner.commitTransaction();

      this.logger.log(`固定资产购置成功：${assetCode}`);

      return asset;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`购置固定资产失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ========== 折旧计算 ==========

  /**
   * 计算月度折旧
   */
  async calculateMonthlyDepreciation(): Promise<DepreciationResult> {
    this.logger.log('开始计算月度折旧');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 获取正在折旧的资产
      const assets = await queryRunner.manager.find(FixedAsset, {
        where: { isDepreciating: true, status: 'in_use' },
      });

      let totalDepreciation = 0;
      const depreciationRecords: DepreciationRecord[] = [];

      for (const asset of assets) {
        // 检查是否已提足折旧
        if (asset.accumulatedDepreciation >= asset.originalValue - asset.salvageValue) {
          asset.isDepreciating = false;
          await queryRunner.manager.save(asset);
          continue;
        }

        // 计算月折旧额
        const monthlyDepreciation = this.calculateDepreciation(asset);
        
        // 更新资产
        asset.accumulatedDepreciation += monthlyDepreciation;
        asset.netValue = asset.originalValue - asset.accumulatedDepreciation;
        
        await queryRunner.manager.save(asset);

        totalDepreciation += monthlyDepreciation;
        depreciationRecords.push({
          assetId: asset.id,
          assetCode: asset.assetCode,
          assetName: asset.assetName,
          depreciationAmount: monthlyDepreciation,
          date: new Date(),
        });
      }

      await queryRunner.commitTransaction();

      this.logger.log(`月度折旧计算完成，总折旧额：${totalDepreciation}`);

      return {
        totalDepreciation,
        assetCount: assets.length,
        records: depreciationRecords,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`计算月度折旧失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 计算单个资产折旧
   */
  private calculateDepreciation(asset: FixedAsset): number {
    const depreciableAmount = asset.originalValue - asset.salvageValue;

    switch (asset.depreciationMethod) {
      case 'straight_line': // 平均年限法
        return depreciableAmount / asset.usefulLife;

      case 'declining_balance': // 双倍余额递减法
        const rate = 2 / asset.usefulLife;
        return asset.netValue * rate;

      case 'sum_of_years': // 年数总和法
        const sumOfYears = (asset.usefulLife * (asset.usefulLife + 1)) / 2;
        const remainingLife = asset.usefulLife - (asset.accumulatedDepreciation / (depreciableAmount / asset.usefulLife));
        return (depreciableAmount * remainingLife) / sumOfYears;

      default:
        return depreciableAmount / asset.usefulLife;
    }
  }

  // ========== 资产处置 ==========

  /**
   * 处置资产
   */
  async disposeAsset(assetId: string, data: DisposeAssetDto): Promise<FixedAsset> {
    this.logger.log(`处置资产：${assetId}, ${data.disposeType}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const asset = await queryRunner.manager.findOne(FixedAsset, { where: { id: assetId } });
      if (!asset) {
        throw new Error('资产不存在');
      }

      // 更新资产状态
      asset.status = data.disposeType === 'retired' ? 'retired' : 'disposed';
      asset.isDepreciating = false;

      await queryRunner.manager.save(asset);

      await queryRunner.commitTransaction();

      this.logger.log(`资产处置完成：${asset.assetCode}`);

      return asset;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`资产处置失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ========== 统计 ==========

  /**
   * 获取资产统计
   */
  async getStatistics(): Promise<AssetStatistics> {
    const total = await this.fixedAssetRepository.count();

    const typeCount = await this.fixedAssetRepository
      .createQueryBuilder('asset')
      .select('asset.assetType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('asset.assetType')
      .getRawMany();

    const statusCount = await this.fixedAssetRepository
      .createQueryBuilder('asset')
      .select('asset.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('asset.status')
      .getRawMany();

    const valueStats = await this.fixedAssetRepository
      .createQueryBuilder('asset')
      .select('SUM(asset.originalValue)', 'originalValue')
      .addSelect('SUM(asset.accumulatedDepreciation)', 'accumulatedDepreciation')
      .addSelect('SUM(asset.netValue)', 'netValue')
      .getRawOne();

    return {
      total,
      typeCount: typeCount.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count);
        return acc;
      }, {}),
      statusCount: statusCount.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      originalValue: parseFloat(valueStats.originalValue) || 0,
      accumulatedDepreciation: parseFloat(valueStats.accumulatedDepreciation) || 0,
      netValue: parseFloat(valueStats.netValue) || 0,
    };
  }

  // ========== 辅助方法 ==========

  /**
   * 生成资产编码
   */
  private async generateAssetCode(assetType: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const typeCode: Record<string, string> = {
      building: 'BLD',
      machine: 'MCH',
      vehicle: 'VEH',
      equipment: 'EQP',
      computer: 'CMP',
      furniture: 'FUR',
      other: 'OTH',
    };

    const todayCount = await this.fixedAssetRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `${typeCode[assetType] || 'OTH'}${year}${month}${sequence}`;
  }
}

// ========== 类型定义 ==========

interface PurchaseAssetDto {
  assetName: string;
  assetType: string;
  specification?: string;
  supplierId?: string;
  supplierName?: string;
  originalValue: number;
  salvageRate?: number;
  depreciationMethod?: string;
  usefulLife: number;
  departmentId?: string;
  departmentName?: string;
  responsibleUserId?: string;
  responsibleUserName?: string;
  location?: string;
  purchaseDate?: Date;
  useStartDate?: Date;
  notes?: string;
  images?: string[];
}

interface DisposeAssetDto {
  disposeType: 'retired' | 'disposed';
  disposeReason?: string;
  disposeDate?: Date;
  scrapValue?: number;
}

interface DepreciationRecord {
  assetId: string;
  assetCode: string;
  assetName: string;
  depreciationAmount: number;
  date: Date;
}

interface DepreciationResult {
  totalDepreciation: number;
  assetCount: number;
  records: DepreciationRecord[];
}

interface AssetStatistics {
  total: number;
  typeCount: Record<string, number>;
  statusCount: Record<string, number>;
  originalValue: number;
  accumulatedDepreciation: number;
  netValue: number;
}
