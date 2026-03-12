import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OffboardProcess } from './entities/offboard-process.entity';

/**
 * 离职交接服务
 * 防止离职人员带走客户资源
 */
@Injectable()
export class EmployeeOffboardService {
  private readonly logger = new Logger(EmployeeOffboardService.name);

  constructor(
    @InjectRepository(OffboardProcess)
    private offboardRepository: Repository<OffboardProcess>,
    private dataSource: DataSource,
  ) {}

  /**
   * 启动离职流程
   */
  async startOffboardProcess(data: StartOffboardDto): Promise<OffboardProcess> {
    this.logger.log(`启动离职流程：${data.employeeId}, ${data.employeeName}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 创建离职流程记录
      const offboardProcess = queryRunner.manager.create(OffboardProcess, {
        processNo: this.generateProcessNo(),
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        department: data.department,
        position: data.position,
        lastWorkingDay: data.lastWorkingDay,
        reason: data.reason,
        status: 'pending',
      });

      await queryRunner.manager.save(offboardProcess);

      // 2. 统计客户资源
      const customerStats = await this.getCustomerStatistics(data.employeeId);
      offboardProcess.customerCount = customerStats.total;
      offboardProcess.opportunityCount = customerStats.opportunities;
      offboardProcess.orderCount = customerStats.orders;

      await queryRunner.manager.save(offboardProcess);

      // 3. 生成交接清单
      const handoverList = await this.generateHandoverList(data.employeeId);
      offboardProcess.handoverList = handoverList;

      await queryRunner.manager.save(offboardProcess);

      await queryRunner.commitTransaction();

      this.logger.log(`离职流程创建成功：${offboardProcess.processNo}`);

      // 4. 发送通知（异步）
      await this.sendOffboardNotification(offboardProcess);

      return offboardProcess;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`离职流程创建失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 自动回收客户资源
   */
  async autoRecoverCustomers(employeeId: string): Promise<RecoverResult> {
    this.logger.log(`自动回收客户资源：${employeeId}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 获取该员工的所有客户
      const customers = await this.getEmployeeCustomers(employeeId);

      // 2. 回收公海
      const publicSeaCount = customers.filter((c) => c.ownerId === employeeId).length;
      await this.moveToPublicSea(customers, queryRunner.manager);

      // 3. 转移商机
      const opportunities = await this.getEmployeeOpportunities(employeeId);
      const opportunityCount = opportunities.length;
      await this.transferOpportunities(opportunities, queryRunner.manager);

      // 4. 转移待办事项
      const tasks = await this.getEmployeeTasks(employeeId);
      const taskCount = tasks.length;
      await this.transferTasks(tasks, queryRunner.manager);

      await queryRunner.commitTransaction();

      this.logger.log(
        `客户资源回收完成：客户${publicSeaCount}个，商机${opportunityCount}个，待办${taskCount}个`,
      );

      return {
        success: true,
        customerCount: publicSeaCount,
        opportunityCount,
        taskCount,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`客户资源回收失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 转移客户给接手人
   */
  async transferCustomers(
    fromEmployeeId: string,
    toEmployeeId: string,
    customerIds: string[],
  ): Promise<number> {
    this.logger.log(`转移客户：${fromEmployeeId} → ${toEmployeeId}, 数量：${customerIds.length}`);

    // TODO: 实现客户转移逻辑
    // 1. 批量更新客户负责人
    // 2. 记录转移日志
    // 3. 发送通知给接手人

    return customerIds.length;
  }

  /**
   * 生成交接清单
   */
  private async generateHandoverList(employeeId: string): Promise<HandoverList> {
    // 1. 客户清单
    const customers = await this.getEmployeeCustomers(employeeId);

    // 2. 商机清单
    const opportunities = await this.getEmployeeOpportunities(employeeId);

    // 3. 待办事项
    const tasks = await this.getEmployeeTasks(employeeId);

    // 4. 合同清单
    const contracts = await this.getEmployeeContracts(employeeId);

    // 5. 文件资料
    const documents = await this.getEmployeeDocuments(employeeId);

    return {
      customers: customers.map((c) => ({
        id: c.id,
        name: c.name,
        contact: c.contactPerson,
        phone: c.phone,
        status: c.status,
      })),
      opportunities: opportunities.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        amount: o.amount,
        stage: o.stage,
      })),
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority,
      })),
      contracts: contracts.map((c) => ({
        id: c.id,
        contractNo: c.contractNo,
        customerName: c.customerName,
        amount: c.amount,
        status: c.status,
      })),
      documents: documents.map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        uploadDate: d.uploadDate,
      })),
    };
  }

  /**
   * 获取客户统计
   */
  private async getCustomerStatistics(employeeId: string): Promise<CustomerStatistics> {
    // TODO: 从数据库获取统计数据
    return {
      total: 0,
      opportunities: 0,
      orders: 0,
    };
  }

  /**
   * 获取员工的客户
   */
  private async getEmployeeCustomers(employeeId: string): Promise<any[]> {
    // TODO: 从数据库获取
    return [];
  }

  /**
   * 获取员工的商机
   */
  private async getEmployeeOpportunities(employeeId: string): Promise<any[]> {
    // TODO: 从数据库获取
    return [];
  }

  /**
   * 获取员工的待办事项
   */
  private async getEmployeeTasks(employeeId: string): Promise<any[]> {
    // TODO: 从数据库获取
    return [];
  }

  /**
   * 移动到公海
   */
  private async moveToPublicSea(customers: any[], manager: any): Promise<void> {
    // TODO: 实现公海回收逻辑
  }

  /**
   * 转移商机
   */
  private async transferOpportunities(opportunities: any[], manager: any): Promise<void> {
    // TODO: 实现商机转移逻辑
  }

  /**
   * 转移待办事项
   */
  private async transferTasks(tasks: any[], manager: any): Promise<void> {
    // TODO: 实现待办转移逻辑
  }

  /**
   * 生成流程编号
   */
  private generateProcessNo(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `OFF${year}${month}${day}${random}`;
  }

  /**
   * 发送离职通知
   */
  private async sendOffboardNotification(process: OffboardProcess): Promise<void> {
    // TODO: 发送通知给相关人员
    this.logger.log(`发送离职通知：${process.processNo}`);
  }

  // ========== 辅助方法 ==========

  private async getEmployeeContracts(employeeId: string): Promise<any[]> {
    // TODO: 实现
    return [];
  }

  private async getEmployeeDocuments(employeeId: string): Promise<any[]> {
    // TODO: 实现
    return [];
  }
}

// ========== 类型定义 ==========

interface StartOffboardDto {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  lastWorkingDay: Date;
  reason?: string;
}

interface RecoverResult {
  success: boolean;
  customerCount: number;
  opportunityCount: number;
  taskCount: number;
}

interface CustomerStatistics {
  total: number;
  opportunities: number;
  orders: number;
}

interface HandoverList {
  customers: any[];
  opportunities: any[];
  tasks: any[];
  contracts: any[];
  documents: any[];
}
