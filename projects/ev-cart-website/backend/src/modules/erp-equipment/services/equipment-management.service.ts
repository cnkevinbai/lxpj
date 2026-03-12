import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { EquipmentMaintenance } from '../entities/equipment-maintenance.entity';
import { EquipmentRepair } from '../entities/equipment-repair.entity';
import { EquipmentMonitoring } from '../entities/equipment-monitoring.entity';
import { EquipmentSparePart } from '../entities/equipment-spare-part.entity';

/**
 * 设备管理服务
 */
@Injectable()
export class EquipmentManagementService {
  private readonly logger = new Logger(EquipmentManagementService.name);

  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    @InjectRepository(EquipmentMaintenance)
    private maintenanceRepository: Repository<EquipmentMaintenance>,
    @InjectRepository(EquipmentRepair)
    private repairRepository: Repository<EquipmentRepair>,
    @InjectRepository(EquipmentMonitoring)
    private monitoringRepository: Repository<EquipmentMonitoring>,
    @InjectRepository(EquipmentSparePart)
    private sparePartRepository: Repository<EquipmentSparePart>,
    private dataSource: DataSource,
  ) {}

  // ========== 设备台账管理 ==========

  /**
   * 创建设备
   */
  async createEquipment(data: CreateEquipmentDto): Promise<Equipment> {
    this.logger.log(`创建设备：${data.equipmentName}`);

    const equipment = this.equipmentRepository.create({
      ...data,
      equipmentCode: await this.generateEquipmentCode(data.category),
      status: 'active',
    });

    await this.equipmentRepository.save(equipment);

    this.logger.log(`设备创建成功：${equipment.equipmentCode}`);

    return equipment;
  }

  /**
   * 更新设备状态
   */
  async updateEquipmentStatus(equipmentId: string, status: Equipment['status']): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({ where: { id: equipmentId } });
    if (!equipment) {
      throw new Error('设备不存在');
    }

    equipment.status = status;
    await this.equipmentRepository.save(equipment);

    this.logger.log(`设备状态更新：${equipment.equipmentCode}, ${status}`);

    return equipment;
  }

  /**
   * 获取设备详情
   */
  async getEquipment(equipmentId: string): Promise<Equipment> {
    return this.equipmentRepository.findOne({
      where: { id: equipmentId },
      relations: ['maintenances', 'repairs'],
    });
  }

  /**
   * 获取设备列表
   */
  async getEquipments(query: EquipmentQuery): Promise<EquipmentResult> {
    const { page = 1, limit = 20, category, status, departmentId } = query;

    const queryBuilder = this.equipmentRepository.createQueryBuilder('equipment');

    if (category) {
      queryBuilder.andWhere('equipment.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('equipment.status = :status', { status });
    }

    if (departmentId) {
      queryBuilder.andWhere('equipment.departmentId = :departmentId', { departmentId });
    }

    const [items, total] = await queryBuilder
      .orderBy('equipment.createdAt', 'DESC')
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

  // ========== 设备保养管理 ==========

  /**
   * 创建保养计划
   */
  async createMaintenance(data: CreateMaintenanceDto): Promise<EquipmentMaintenance> {
    this.logger.log(`创建保养计划：${data.maintenanceType}`);

    const maintenance = this.maintenanceRepository.create({
      ...data,
      maintenanceNo: await this.generateMaintenanceNo(),
      status: 'planned',
    });

    await this.maintenanceRepository.save(maintenance);

    this.logger.log(`保养计划创建成功：${maintenance.maintenanceNo}`);

    return maintenance;
  }

  /**
   * 完成保养
   */
  async completeMaintenance(
    maintenanceId: string,
    data: CompleteMaintenanceDto,
  ): Promise<EquipmentMaintenance> {
    const maintenance = await this.maintenanceRepository.findOne({ where: { id: maintenanceId } });
    if (!maintenance) {
      throw new Error('保养记录不存在');
    }

    maintenance.status = 'completed';
    maintenance.completedDate = new Date();
    maintenance.actualHours = data.actualHours;
    maintenance.maintenanceContent = data.maintenanceContent;
    maintenance.发现的问题 = data.发现的问题;
    maintenance.handlingMeasures = data.handlingMeasures;
    maintenance.maintenanceCost = data.maintenanceCost;
    maintenance.replacedParts = data.replacedParts;
    maintenance.equipmentStatus = data.equipmentStatus;
    maintenance.photos = data.photos;
    maintenance.remark = data.remark;

    if (data.verifierId) {
      maintenance.verifierId = data.verifierId;
      maintenance.verifierName = data.verifierName;
      maintenance.verifyDate = new Date();
    }

    await this.maintenanceRepository.save(maintenance);

    // 更新设备保养信息
    const equipment = await this.equipmentRepository.findOne({ where: { id: maintenance.equipmentId } });
    if (equipment) {
      equipment.lastMaintenanceDate = maintenance.completedDate;
      equipment.maintenanceCount += 1;
      equipment.maintenanceCost += maintenance.maintenanceCost;
      await this.equipmentRepository.save(equipment);
    }

    this.logger.log(`保养完成：${maintenance.maintenanceNo}`);

    return maintenance;
  }

  // ========== 设备维修管理 ==========

  /**
   * 创建维修工单
   */
  async createRepair(data: CreateRepairDto): Promise<EquipmentRepair> {
    this.logger.log(`创建维修工单：${data.faultType}`);

    const repair = this.repairRepository.create({
      ...data,
      repairNo: await this.generateRepairNo(),
      status: 'pending',
    });

    await this.repairRepository.save(repair);

    // 更新设备状态
    await this.equipmentRepository.update(repair.equipmentId, {
      status: 'fault',
      faultCount: () => 'fault_count + 1',
    });

    this.logger.log(`维修工单创建成功：${repair.repairNo}`);

    return repair;
  }

  /**
   * 完成维修
   */
  async completeRepair(repairId: string, data: CompleteRepairDto): Promise<EquipmentRepair> {
    const repair = await this.repairRepository.findOne({ where: { id: repairId } });
    if (!repair) {
      throw new Error('维修记录不存在');
    }

    repair.status = 'completed';
    repair.completedDate = new Date();
    repair.actualHours = data.actualHours;
    repair.downtimeHours = data.downtimeHours;
    repair.faultCause = data.faultCause;
    repair.repairMethod = data.repairMethod;
    repair.repairContent = data.repairContent;
    repair.replacedParts = data.replacedParts;
    repair.partsCost = data.partsCost;
    repair.laborCost = data.laborCost;
    repair.totalCost = data.totalCost;
    repair.preventiveMeasures = data.preventiveMeasures;
    repair.photos = data.photos;
    repair.remark = data.remark;

    await this.repairRepository.save(repair);

    // 更新设备信息
    const equipment = await this.equipmentRepository.findOne({ where: { id: repair.equipmentId } });
    if (equipment) {
      equipment.status = 'active';
      equipment.lastRepairDate = repair.completedDate;
      equipment.repairCount += 1;
      equipment.maintenanceCost += repair.totalCost;
      
      // 更新 MTBF 和 MTTR
      equipment.mttr = (equipment.mttr * (equipment.repairCount - 1) + repair.downtimeHours) / equipment.repairCount;
      
      await this.equipmentRepository.save(equipment);
    }

    this.logger.log(`维修完成：${repair.repairNo}`);

    return repair;
  }

  // ========== 设备监控 ==========

  /**
   * 记录监控数据
   */
  async recordMonitoring(data: MonitoringData): Promise<EquipmentMonitoring> {
    const monitoring = this.monitoringRepository.create(data);
    await this.monitoringRepository.save(monitoring);

    // 如果检测到故障，自动创建维修工单
    if (data.status === 'fault' && data.faultCode) {
      await this.autoCreateRepair(data.equipmentId, data.faultCode, data.faultDescription);
    }

    return monitoring;
  }

  /**
   * 获取设备实时状态
   */
  async getEquipmentStatus(equipmentId: string): Promise<EquipmentStatus> {
    const latest = await this.monitoringRepository.findOne({
      where: { equipmentId },
      order: { timestamp: 'DESC' },
    });

    if (!latest) {
      return {
        equipmentId,
        status: 'unknown',
        timestamp: null,
      };
    }

    return {
      equipmentId,
      status: latest.status,
      speed: latest.speed,
      temperature: latest.temperature,
      efficiency: latest.efficiency,
      output: latest.output,
      qualityRate: latest.qualityRate,
      timestamp: latest.timestamp,
    };
  }

  // ========== 设备统计 ==========

  /**
   * 获取设备统计
   */
  async getStatistics(): Promise<EquipmentStatistics> {
    const total = await this.equipmentRepository.count();
    const active = await this.equipmentRepository.count({ where: { status: 'active' } });
    const maintenance = await this.equipmentRepository.count({ where: { status: 'maintenance' } });
    const fault = await this.equipmentRepository.count({ where: { status: 'fault' } });

    const avgOee = await this.equipmentRepository
      .createQueryBuilder('equipment')
      .select('AVG(equipment.oee)', 'avg')
      .getRawOne();

    const totalMaintenanceCost = await this.equipmentRepository
      .createQueryBuilder('equipment')
      .select('SUM(equipment.maintenanceCost)', 'total')
      .getRawOne();

    return {
      total,
      active,
      maintenance,
      fault,
      inactive: total - active - maintenance - fault,
      avgOee: parseFloat(avgOee.total) || 0,
      totalMaintenanceCost: parseFloat(totalMaintenanceCost.total) || 0,
    };
  }

  /**
   * 计算 OEE
   */
  async calculateOEE(equipmentId: string, date: Date): Promise<OEEData> {
    // 获取当天监控数据
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const records = await this.monitoringRepository.find({
      where: {
        equipmentId,
        timestamp: () => `BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
      },
    });

    if (records.length === 0) {
      return { availability: 0, performance: 0, quality: 0, oee: 0 };
    }

    // 可用率 = 运行时间 / 计划工作时间
    const totalRunningTime = records.reduce((sum, r) => sum + r.runningTime, 0);
    const totalDowntime = records.reduce((sum, r) => sum + r.downtime, 0);
    const availability = totalRunningTime / (totalRunningTime + totalDowntime) * 100;

    // 性能率 = 实际产量 / 理论产量
    const totalOutput = records.reduce((sum, r) => sum + r.output, 0);
    const theoreticalOutput = records.length * 60; // 假设每小时 60 件
    const performance = totalOutput / theoreticalOutput * 100;

    // 合格率 = 合格品 / 总产量
    const totalDefects = records.reduce((sum, r) => sum + r.defectCount, 0);
    const quality = (totalOutput - totalDefects) / totalOutput * 100;

    // OEE = 可用率 × 性能率 × 合格率
    const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;

    return { availability, performance, quality, oee };
  }

  // ========== 辅助方法 ==========

  private async generateEquipmentCode(category: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const categoryCode = category.substring(0, 3).toUpperCase();

    const todayCount = await this.equipmentRepository.count({
      where: {
        category,
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `EQ${categoryCode}${year}${month}${sequence}`;
  }

  private async generateMaintenanceNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.maintenanceRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `MT${year}${month}${sequence}`;
  }

  private async generateRepairNo(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const todayCount = await this.repairRepository.count({
      where: {
        createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
    });

    const sequence = String(todayCount + 1).padStart(4, '0');

    return `RP${year}${month}${sequence}`;
  }

  private async autoCreateRepair(equipmentId: string, faultCode: string, faultDescription: string): Promise<void> {
    const equipment = await this.equipmentRepository.findOne({ where: { id: equipmentId } });
    if (!equipment) return;

    const repair = this.repairRepository.create({
      equipmentId,
      equipmentName: equipment.equipmentName,
      faultType: faultCode,
      faultDescription,
      priority: 'high',
      status: 'pending',
      reportedDate: new Date(),
    });

    await this.repairRepository.save(repair);
    this.logger.log(`自动创建维修工单：${repair.repairNo}`);
  }
}

// ========== 类型定义 ==========

interface CreateEquipmentDto {
  equipmentName: string;
  equipmentModel?: string;
  category: string;
  categoryName?: string;
  supplier?: string;
  supplierContact?: string;
  purchasePrice?: number;
  purchaseDate?: Date;
  installationDate?: Date;
  commissioningDate?: Date;
  warrantyDate?: Date;
  expectedLife?: number;
  location?: string;
  locationCode?: string;
  departmentId?: string;
  departmentName?: string;
  responsiblePersonId?: string;
  responsiblePersonName?: string;
  responsiblePersonPhone?: string;
  specification?: string;
  technicalParameters?: string;
  features?: string[];
  remark?: string;
  createdBy?: string;
  createdByName?: string;
}

interface EquipmentQuery {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  departmentId?: string;
}

interface EquipmentResult {
  items: Equipment[];
  total: number;
  page: number;
  limit: number;
}

interface CreateMaintenanceDto {
  equipmentId: string;
  equipmentName: string;
  maintenanceType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'special';
  planDate?: Date;
  executorId?: string;
  executorName?: string;
  maintenanceItems?: string;
  remark?: string;
  createdBy?: string;
  createdByName?: string;
}

interface CompleteMaintenanceDto {
  actualHours?: number;
  maintenanceContent?: string;
  发现的问题?: string;
  handlingMeasures?: string;
  maintenanceCost?: number;
  replacedParts?: string[];
  equipmentStatus?: number;
  verifierId?: string;
  verifierName?: string;
  photos?: string[];
  remark?: string;
}

interface CreateRepairDto {
  equipmentId: string;
  equipmentName: string;
  faultType: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  faultDescription?: string;
  reportedById?: string;
  reportedByName?: string;
}

interface CompleteRepairDto {
  actualHours?: number;
  downtimeHours?: number;
  faultCause?: string;
  repairMethod?: string;
  repairContent?: string;
  replacedParts?: string[];
  partsCost?: number;
  laborCost?: number;
  totalCost?: number;
  preventiveMeasures?: string;
  photos?: string[];
  remark?: string;
}

interface MonitoringData {
  equipmentId: string;
  equipmentName: string;
  status?: 'running' | 'idle' | 'fault' | 'maintenance' | 'stopped';
  speed?: number;
  temperature?: number;
  pressure?: number;
  vibration?: number;
  current?: number;
  voltage?: number;
  power?: number;
  efficiency?: number;
  output?: number;
  defectCount?: number;
  qualityRate?: number;
  parameters?: any;
  faultCode?: string;
  faultDescription?: string;
  runningTime?: number;
  idleTime?: number;
  downtime?: number;
  operatorId?: string;
  operatorName?: string;
}

interface EquipmentStatus {
  equipmentId: string;
  status: string;
  speed?: number;
  temperature?: number;
  efficiency?: number;
  output?: number;
  qualityRate?: number;
  timestamp: Date;
}

interface EquipmentStatistics {
  total: number;
  active: number;
  maintenance: number;
  fault: number;
  inactive: number;
  avgOee: number;
  totalMaintenanceCost: number;
}

interface OEEData {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}
