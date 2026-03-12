import { Injectable, Logger } from '@nestjs/common';

/**
 * MRP 物料需求计划服务
 * 完整的 MRP 运算引擎
 */
@Injectable()
export class MRPService {
  private readonly logger = new Logger(MRPService.name);

  // ========== MRP 运算 ==========

  /**
   * 运行 MRP 运算
   */
  async runMRP(data: MRPInput): Promise<MRPResult> {
    this.logger.log(`运行 MRP 运算：${data.planType}, ${data.period}`);

    const result: MRPResult = {
      planType: data.planType,
      period: data.period,
      runDate: new Date(),
      materialRequirements: [],
      purchaseSuggestions: [],
      productionSuggestions: [],
      summary: {
        totalMaterials: 0,
        totalPurchaseAmount: 0,
        totalProductionAmount: 0,
      },
    };

    // 1. 获取主生产计划
    const mps = await this.getMasterProductionSchedule(data.period);

    // 2. 展开 BOM
    const bomExplosion = await this.explodeBOM(mps);

    // 3. 计算净需求
    const netRequirements = await this.calculateNetRequirements(bomExplosion);

    // 4. 生成采购建议
    result.purchaseSuggestions = await this.generatePurchaseSuggestions(netRequirements);

    // 5. 生成生产建议
    result.productionSuggestions = await this.generateProductionSuggestions(netRequirements);

    // 6. 汇总
    result.materialRequirements = netRequirements;
    result.summary.totalMaterials = netRequirements.length;
    result.summary.totalPurchaseAmount = result.purchaseSuggestions.reduce((sum, item) => sum + item.amount, 0);
    result.summary.totalProductionAmount = result.productionSuggestions.reduce((sum, item) => sum + item.amount, 0);

    this.logger.log(`MRP 运算完成：采购${result.purchaseSuggestions.length}项，生产${result.productionSuggestions.length}项`);

    return result;
  }

  /**
   * 获取主生产计划
   */
  private async getMasterProductionSchedule(period: string): Promise<MPSItem[]> {
    // TODO: 从生产计划获取
    return [];
  }

  /**
   * 展开 BOM
   */
  private async explodeBOM(mps: MPSItem[]): Promise<BOMExplosion[]> {
    const explosion: BOMExplosion[] = [];

    for (const item of mps) {
      // 获取 BOM 结构
      const bom = await this.getBOM(item.productId);
      
      // 递归展开
      this.explodeBOMRecursive(bom, item.quantity, explosion);
    }

    return explosion;
  }

  /**
   * 递归展开 BOM
   */
  private explodeBOMRecursive(bom: BOMItem[], quantity: number, result: BOMExplosion[]): void {
    for (const item of bom) {
      const requiredQuantity = item.quantity * quantity;

      // 检查是否已有该物料
      const existing = result.find(r => r.materialId === item.materialId);
      if (existing) {
        existing.requiredQuantity += requiredQuantity;
      } else {
        result.push({
          materialId: item.materialId,
          materialName: item.materialName,
          requiredQuantity,
          level: item.level,
        });
      }

      // 如果该物料还有子 BOM，继续展开
      if (item.children && item.children.length > 0) {
        this.explodeBOMRecursive(item.children, requiredQuantity, result);
      }
    }
  }

  /**
   * 计算净需求
   */
  private async calculateNetRequirements(bomExplosion: BOMExplosion[]): Promise<MaterialRequirement[]> {
    const requirements: MaterialRequirement[] = [];

    for (const item of bomExplosion) {
      // 获取库存
      const inventory = await this.getInventory(item.materialId);
      
      // 获取在途量
      const onOrder = await this.getOnOrderQuantity(item.materialId);
      
      // 获取已分配量
      const allocated = await this.getAllocatedQuantity(item.materialId);

      // 计算净需求
      const availableQuantity = inventory.onHand + onOrder - allocated;
      const netQuantity = item.requiredQuantity - availableQuantity;

      if (netQuantity > 0) {
        requirements.push({
          materialId: item.materialId,
          materialName: item.materialName,
          requiredQuantity: item.requiredQuantity,
          availableQuantity,
          netQuantity,
          suggestion: netQuantity > 0 ? 'purchase' : 'none',
        });
      }
    }

    return requirements;
  }

  /**
   * 生成采购建议
   */
  private async generatePurchaseSuggestions(requirements: MaterialRequirement[]): Promise<PurchaseSuggestion[]> {
    const suggestions: PurchaseSuggestion[] = [];

    for (const item of requirements) {
      if (item.suggestion === 'purchase') {
        // 获取采购参数
        const procurement = await this.getProcurementParams(item.materialId);

        suggestions.push({
          materialId: item.materialId,
          materialName: item.materialName,
          quantity: item.netQuantity,
          suggestedQuantity: this.roundToMOQ(item.netQuantity, procurement.moq),
          unitPrice: procurement.unitPrice,
          amount: this.roundToMOQ(item.netQuantity, procurement.moq) * procurement.unitPrice,
          supplierId: procurement.supplierId,
          supplierName: procurement.supplierName,
          leadTime: procurement.leadTime,
          suggestedDeliveryDate: this.addWorkDays(new Date(), procurement.leadTime),
        });
      }
    }

    return suggestions;
  }

  /**
   * 生成生产建议
   */
  private async generateProductionSuggestions(requirements: MaterialRequirement[]): Promise<ProductionSuggestion[]> {
    // TODO: 生成自制件生产建议
    return [];
  }

  // ========== 辅助方法 ==========

  /**
   * 获取 BOM
   */
  private async getBOM(productId: string): Promise<BOMItem[]> {
    // TODO: 从 BOM 表获取
    return [];
  }

  /**
   * 获取库存
   */
  private async getInventory(materialId: string): Promise<Inventory> {
    // TODO: 从库存表获取
    return { onHand: 0, allocated: 0 };
  }

  /**
   * 获取在途量
   */
  private async getOnOrderQuantity(materialId: string): Promise<number> {
    // TODO: 从采购订单获取
    return 0;
  }

  /**
   * 获取已分配量
   */
  private async getAllocatedQuantity(materialId: string): Promise<number> {
    // TODO: 从分配记录获取
    return 0;
  }

  /**
   * 获取采购参数
   */
  private async getProcurementParams(materialId: string): Promise<ProcurementParams> {
    // TODO: 从物料主数据获取
    return {
      moq: 1,
      unitPrice: 0,
      supplierId: '',
      supplierName: '',
      leadTime: 7,
    };
  }

  /**
   * 按 MOQ 取整
   */
  private roundToMOQ(quantity: number, moq: number): number {
    return Math.ceil(quantity / moq) * moq;
  }

  /**
   * 增加工作日
   */
  private addWorkDays(date: Date, days: number): Date {
    const result = new Date(date);
    let addedDays = 0;
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) { // 排除周末
        addedDays++;
      }
    }
    return result;
  }
}

// ========== 类型定义 ==========

interface MRPInput {
  planType: 'mps' | 'mrp';
  period: string;
  productId?: string;
}

interface MPSItem {
  productId: string;
  productName: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
}

interface BOMItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  level: number;
  children?: BOMItem[];
}

interface BOMExplosion {
  materialId: string;
  materialName: string;
  requiredQuantity: number;
  level: number;
}

interface MaterialRequirement {
  materialId: string;
  materialName: string;
  requiredQuantity: number;
  availableQuantity: number;
  netQuantity: number;
  suggestion: 'purchase' | 'production' | 'none';
}

interface Inventory {
  onHand: number;
  allocated: number;
}

interface ProcurementParams {
  moq: number;
  unitPrice: number;
  supplierId: string;
  supplierName: string;
  leadTime: number;
}

interface PurchaseSuggestion {
  materialId: string;
  materialName: string;
  quantity: number;
  suggestedQuantity: number;
  unitPrice: number;
  amount: number;
  supplierId: string;
  supplierName: string;
  leadTime: number;
  suggestedDeliveryDate: Date;
}

interface ProductionSuggestion {
  productId: string;
  productName: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  amount: number;
}

interface MRPResult {
  planType: string;
  period: string;
  runDate: Date;
  materialRequirements: MaterialRequirement[];
  purchaseSuggestions: PurchaseSuggestion[];
  productionSuggestions: ProductionSuggestion[];
  summary: {
    totalMaterials: number;
    totalPurchaseAmount: number;
    totalProductionAmount: number;
  };
}
