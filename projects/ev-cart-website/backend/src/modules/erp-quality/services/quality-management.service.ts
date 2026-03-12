import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { QualityInspection } from '../entities/quality-inspection.entity';
import { QualityInspectionItem } from '../entities/quality-inspection-item.entity';
import { QualityDefect } from '../entities/quality-defect.entity';
import { QualityStandard } from '../entities/quality-standard.entity';
import { QualityReport } from '../entities/quality-report.entity';

/**
 * 质量管理服务
 */
@Injectable()
export class QualityManagementService {
  private readonly logger = new Logger(QualityManagementService.name);

  constructor(
    @InjectRepository(QualityInspection)
    private inspectionRepository: Repository<QualityInspection>,
    @InjectRepository(QualityInspectionItem)
    private inspectionItemRepository: Repository<QualityInspectionItem>,
    @InjectRepository(QualityDefect)
    private defectRepository: Repository<QualityDefect>,
    @InjectRepository(QualityStandard)
    private standardRepository: Repository<QualityStandard>,
    @InjectRepository(QualityReport)
    private reportRepository: Repository<QualityReport>,
    private dataSource: DataSource,
  ) {}

  // ========== 质检单管理 ==========

  /**
   * 创建质检单
   */
  async createInspection(data: CreateInspectionDto): Promise<QualityInspection> {
    this.logger.log(`创建质检单：${data.inspectionType}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 生成质检单号
      const inspectionNo = await this.generateInspectionNo(data.inspectionType);

      // 创建质检单
      const inspection = queryRunner.manager.create(QualityInspection, {
        ...data,
        inspectionNo,
        status: 'pending',
      });

      await queryRunner.manager.save(inspection);

      // 加载检验标准
      if (data.standardId) {
        const standard = await queryRunner.manager.findOne(QualityStandard, {
          where: { id: data.standardId },
          relations: ['items'],
        });

        if (standard && standard.items) {
          // 创建检验项
          const items = standard.items.map(item =>
            queryRunner.manager.create(QualityInspectionItem, {
              inspectionId: inspection.id,
              inspection,
              itemCode: item.itemCode,
              itemName: item.itemName,
              itemType: item.itemType,
              inspectionMethod: item.inspectionMethod,
              unit: item.unit,
              standardValue: item.standardValue,
              upperLimit: item.upperLimit,
              lowerLimit: item.lowerLimit,
              result: 'pending',
            })
          );

          await queryRunner.manager.save(items);
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(`质检单创建成功：${inspectionNo}`);

      return inspection;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`创建质检单失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新检验结果
   */
  async updateInspectionResult(
    inspectionId: string,
    items: UpdateInspectionItemDto[],
  ): Promise<QualityInspection> {
    this.logger.log(`更新检验结果：${inspectionId}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const inspection = await queryRunner.manager.findOne(QualityInspection, {
        where: { id: inspectionId },
        relations: ['items'],
      });

      if (!inspection) {
        throw new Error('质检单不存在');
      }

      let qualifiedQuantity = 0;
      let defectiveQuantity = 0;
      const defectTypes = new Set<string>();

      // 更新检验项
      for (const itemData of items) {
        const item = inspection.items.find(i => i.id === itemData.itemId);
        if (item) {
          item.actualValue = itemData.actualValue;
          item.result = itemData.result;
          item.defectRate = itemData.defectRate || 0;
          item.inspectorId = itemData.inspectorId;
          item.inspectorName = itemData.inspectorName;
          item.inspectionTime = new Date();

          await queryRunner.manager.save(item);

          if (item.result === 'qualified') {
            qualifiedQuantity += 1;
          } else {
            defectiveQuantity += 1;
            if (itemData.defectType) {
              defectTypes.add(itemData.defectType);
            }
          }
        }
      }

      // 更新质检单
      inspection.qualifiedQuantity = qualifiedQuantity;
      inspection.defectiveQuantity = defectiveQuantity;
      inspection.qualifiedRate = inspection.quantity > 0
        ? (qualifiedQuantity / inspection.quantity) * 100
        : 0;
      inspection.defectTypes = Array.from(defectTypes);
      inspection.status = defectiveQuantity > 0 ? 'rejected' : 'completed';
      inspection.completedDate = new Date();

      await queryRunner.manager.save(inspection);

      // 如果有不良品，创建不良品记录
      if (defectiveQuantity > 0) {
        await this.createDefectFromInspection(queryRunner.manager, inspection);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`检验结果更新成功：${inspectionId}`);

      return inspection;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`更新检验结果失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 获取质检单详情
   */
  async getInspection(inspectionId: string): Promise<QualityInspection> {
    return this.inspectionRepository.findOne({
      where: { id: inspectionId },
      relations: ['items'],
    });
  }

  /**
   * 获取质检单列表
   */
  async getInspections(query: InspectionQuery): Promise<InspectionResult> {
    const { page = 1, limit = 20, inspectionType, status, relatedOrderId } = query;

    const queryBuilder = this.inspectionRepository.createQueryBuilder('inspection');

    if (inspectionType) {
      queryBuilder.andWhere('inspection.inspectionType = :inspectionType', { inspectionType });
    }

    if (status) {
      queryBuilder.andWhere('inspection.status = :status', { status });
    }

    if (relatedOrderId) {
      queryBuilder.andWhere('inspection.relatedOrderId = :relatedOrderId', { relatedOrderId });
    }

    const [items, total] = await queryBuilder
      .orderBy('inspection.createdAt', 'DESC')
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

  // ========== 不良品管理 ==========

  /**
   * 创建不良品记录
   */
  async createDefect(data: CreateDefectDto): Promise<QualityDefect> {
    this.logger.log(`创建不良品记录：${data.defectType}`);

    const defect = this.defectRepository.create({
      ...data,
      defectNo: await this.generateDefectNo(),
      status: 'pending',
    });

    await this.defectRepository.save(defect);

    this.logger.log(`不良品记录创建成功：${defect.defectNo}`);

    return defect;
  }

  /**
   * 更新不良品处理
   */
  async updateDefectHandling(
    defectId: string,
    data: UpdateDefectHandlingDto,
  ): Promise<QualityDefect> {
    const defect = await this.defectRepository.findOne({ where: { id: defectId } });
    if (!defect) {
      throw new Error('不良品记录不存在');
    }

    Object.assign(defect, data);

    if (data.handlingMethod) {
      defect.status = 'processing';
    }

    if (data.preventiveMeasures && data.completedDate) {
      defect.status = 'completed';
    }

    await this.defectRepository.save(defect);

    return defect;
  }

  // ========== 质量追溯 ==========

  /**
   * 质量追溯
   */
  async traceability(productId: string, batchNo?: string): Promise<TraceabilityResult> {
    // 获取该产品的所有质检记录
    const inspections = await this.inspectionRepository.find({
      where: productId ? { productId } : {},
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });

    // 获取不良品记录
    const defects = await this.defectRepository.find({
      where: productId ? { productId } : {},
      order: { createdAt: 'DESC' },
    });

    return {
      productId,
      batchNo,
      inspections,
      defects,
      summary: {
        totalInspections: inspections.length,
        totalDefects: defects.length,
        qualifiedRate: this.calculateQualifiedRate(inspections),
      },
    };
  }

  // ========== 质量报表 ==========

  /**
   * 生成质量报表
   */
  async generateReport(data: GenerateReportDto): Promise<QualityReport> {
    this.logger.log(`生成质量报表：${data.reportType}, ${data.reportPeriod}`);

    // 统计检验数据
    const inspections = await this.inspectionRepository
      .createQueryBuilder('inspection')
      .where('inspection.createdAt BETWEEN :startDate AND :endDate', {
        startDate: data.startDate,
        endDate: data.endDate,
      })
      .andWhere('inspection.inspectionType = :inspectionType', {
        inspectionType: data.inspectionType,
      })
      .getMany();

    const totalQuantity = inspections.reduce((sum, i) => sum + Number(i.quantity), 0);
    const qualifiedQuantity = inspections.reduce((sum, i) => sum + Number(i.qualifiedQuantity), 0);
    const defectiveQuantity = inspections.reduce((sum, i) => sum + Number(i.defectiveQuantity), 0);

    // 统计不良类型分布
    const defectTypeDistribution = {};
    inspections.forEach(i => {
      if (i.defectTypes) {
        i.defectTypes.forEach(type => {
          defectTypeDistribution[type] = (defectTypeDistribution[type] || 0) + 1;
        });
      }
    });

    const report = this.reportRepository.create({
      ...data,
      totalQuantity,
      qualifiedQuantity,
      defectiveQuantity,
      qualifiedRate: totalQuantity > 0 ? (qualifiedQuantity / totalQuantity) * 100 : 0,
      defectRate: totalQuantity > 0 ? (defectiveQuantity / totalQuantity) * 100 : 0,
      defectTypeDistribution,
    });

    await this.reportRepository.save(report);

    this.logger.log(`质量报表生成成功：${data.reportPeriod}`);

    return report;
  }

  // ========== 辅助方法 ==========

  private async generateInspectionNo(inspectionType: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const typeCode: Record<string, string> = {
      incoming: 'IQC',
      process: 'IPQC',
      final: 'FQC',
      outgoing: 'OQC',
    };

    const todayCount = await this.inspectionRepository.count({
      where: {
        inspectionType,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `${typeCode[inspectionType] || 'QC'}${year}${month}${day}${sequence}`;
  }

  private async generateDefectNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.defectRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `DF${year}${month}${sequence}`;
  }

  private async createDefectFromInspection(
    manager: any,
    inspection: QualityInspection,
  ): Promise<void> {
    const defect = manager.create(QualityDefect, {
      inspectionId: inspection.id,
      inspectionNo: inspection.inspectionNo,
      productId: inspection.productId,
      productName: inspection.productName,
      productModel: inspection.productModel,
      quantity: inspection.defectiveQuantity,
      defectType: inspection.defectTypes?.join(',') || 'unknown',
      severity: 'major',
      status: 'pending',
      foundById: inspection.inspectorId,
      foundByName: inspection.inspectorName,
      foundDate: inspection.completedDate,
    });

    await manager.save(defect);
  }

  private calculateQualifiedRate(inspections: QualityInspection[]): number {
    if (inspections.length === 0) return 0;

    const totalQuantity = inspections.reduce((sum, i) => sum + Number(i.quantity), 0);
    const qualifiedQuantity = inspections.reduce((sum, i) => sum + Number(i.qualifiedQuantity), 0);

    return totalQuantity > 0 ? (qualifiedQuantity / totalQuantity) * 100 : 0;
  }
}

// ========== 类型定义 ==========

interface CreateInspectionDto {
  inspectionType: 'incoming' | 'process' | 'final' | 'outgoing';
  inspectionLevel?: 'normal' | 'strict' | 'relaxed';
  relatedOrderId?: string;
  relatedType?: string;
  relatedOrderNo?: string;
  supplierId?: string;
  supplierName?: string;
  productId?: string;
  productName?: string;
  productModel?: string;
  quantity: number;
  standardId?: string;
  standardName?: string;
  remark?: string;
  createdBy?: string;
  createdByName?: string;
}

interface UpdateInspectionItemDto {
  itemId: string;
  actualValue: string;
  result: 'qualified' | 'unqualified';
  defectRate?: number;
  defectType?: string;
  inspectorId?: string;
  inspectorName?: string;
}

interface InspectionQuery {
  page?: number;
  limit?: number;
  inspectionType?: string;
  status?: string;
  relatedOrderId?: string;
}

interface InspectionResult {
  items: QualityInspection[];
  total: number;
  page: number;
  limit: number;
}

interface CreateDefectDto {
  inspectionId?: string;
  inspectionNo?: string;
  productId?: string;
  productName?: string;
  productModel?: string;
  quantity: number;
  defectType: string;
  defectDescription?: string;
  severity: 'critical' | 'major' | 'minor';
  foundById?: string;
  foundByName?: string;
  foundDate?: Date;
  departmentId?: string;
  departmentName?: string;
}

interface UpdateDefectHandlingDto {
  causeAnalysis?: string;
  handlingMethod?: string;
  handlingCost?: number;
  preventiveMeasures?: string;
  responsiblePersonId?: string;
  responsiblePersonName?: string;
  completedDate?: Date;
  verifiedById?: string;
  verifiedByName?: string;
  verifiedDate?: Date;
}

interface TraceabilityResult {
  productId: string;
  batchNo?: string;
  inspections: QualityInspection[];
  defects: QualityDefect[];
  summary: {
    totalInspections: number;
    totalDefects: number;
    qualifiedRate: number;
  };
}

interface GenerateReportDto {
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  inspectionType: 'incoming' | 'process' | 'final' | 'outgoing';
  reportPeriod: string;
  startDate: Date;
  endDate: Date;
  preparedById?: string;
  preparedByName?: string;
}
