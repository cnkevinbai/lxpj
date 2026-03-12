import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Department } from '../entities/department.entity';
import { User } from '../entities/user.entity';

/**
 * 部门管理服务
 */
@Injectable()
export class DepartmentManagementService {
  private readonly logger = new Logger(DepartmentManagementService.name);

  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  // ========== 部门管理 ==========

  /**
   * 创建部门
   */
  async createDepartment(data: CreateDepartmentDto): Promise<Department> {
    this.logger.log(`创建部门：${data.departmentName}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 检查部门编码是否已存在
      const existing = await queryRunner.manager.findOne(Department, {
        where: { departmentCode: data.departmentCode },
      });
      if (existing) {
        throw new BadRequestException('部门编码已存在');
      }

      // 创建部门
      const department = queryRunner.manager.create(Department, {
        ...data,
        status: 'active',
      });

      await queryRunner.manager.save(department);

      await queryRunner.commitTransaction();

      this.logger.log(`部门创建成功：${department.departmentName}`);

      return department;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`创建部门失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新部门
   */
  async updateDepartment(departmentId: string, data: UpdateDepartmentDto): Promise<Department> {
    this.logger.log(`更新部门：${departmentId}`);

    const department = await this.departmentRepository.findOne({ where: { id: departmentId } });
    if (!department) {
      throw new NotFoundException('部门不存在');
    }

    Object.assign(department, data);
    await this.departmentRepository.save(department);

    this.logger.log(`部门更新成功：${department.departmentName}`);

    return department;
  }

  /**
   * 删除部门
   */
  async deleteDepartment(departmentId: string): Promise<void> {
    this.logger.log(`删除部门：${departmentId}`);

    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
      relations: ['children'],
    });

    if (!department) {
      throw new NotFoundException('部门不存在');
    }

    // 检查是否有子部门
    if (department.children && department.children.length > 0) {
      throw new BadRequestException('部门下有子部门，无法删除');
    }

    // 检查是否有员工
    const employeeCount = await this.userRepository.count({
      where: { departmentId },
    });
    if (employeeCount > 0) {
      throw new BadRequestException(`部门下有${employeeCount}名员工，无法删除`);
    }

    // 软删除
    department.status = 'inactive';
    await this.departmentRepository.save(department);

    this.logger.log(`部门删除成功：${department.departmentName}`);
  }

  /**
   * 获取部门树
   */
  async getDepartmentTree(): Promise<Department[]> {
    return this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.children', 'children')
      .where('department.status = :status', { status: 'active' })
      .orderBy('department.sortOrder', 'ASC')
      .addOrderBy('children.sortOrder', 'ASC')
      .getMany();
  }

  /**
   * 获取部门列表
   */
  async getDepartments(query: DepartmentQuery): Promise<DepartmentResult> {
    const { page = 1, limit = 50, status, parentId } = query;

    const queryBuilder = this.departmentRepository.createQueryBuilder('department');

    if (status) {
      queryBuilder.andWhere('department.status = :status', { status });
    }

    if (parentId) {
      queryBuilder.andWhere('department.parentId = :parentId', { parentId });
    }

    const [items, total] = await queryBuilder
      .orderBy('department.sortOrder', 'ASC')
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

  /**
   * 获取部门详情
   */
  async getDepartment(departmentId: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
      relations: ['parent', 'users'],
    });

    if (!department) {
      throw new NotFoundException('部门不存在');
    }

    return department;
  }

  /**
   * 设置部门负责人
   */
  async setDepartmentManager(departmentId: string, managerId: string, managerInfo: ManagerInfo): Promise<Department> {
    this.logger.log(`设置部门负责人：${departmentId}, 负责人：${managerInfo.managerName}`);

    const department = await this.departmentRepository.findOne({ where: { id: departmentId } });
    if (!department) {
      throw new NotFoundException('部门不存在');
    }

    department.managerId = managerId;
    department.managerName = managerInfo.managerName;
    department.managerPhone = managerInfo.managerPhone;
    department.managerEmail = managerInfo.managerEmail;

    await this.departmentRepository.save(department);

    this.logger.log(`部门负责人设置成功：${department.departmentName}`);

    return department;
  }

  /**
   * 移动部门
   */
  async moveDepartment(departmentId: string, newParentId: string | null): Promise<Department> {
    this.logger.log(`移动部门：${departmentId}, 新父部门：${newParentId || '顶级'}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const department = await queryRunner.manager.findOne(Department, {
        where: { id: departmentId },
      });

      if (!department) {
        throw new NotFoundException('部门不存在');
      }

      // 不能移动到自己或子部门下
      if (newParentId) {
        const newParent = await queryRunner.manager.findOne(Department, {
          where: { id: newParentId },
        });

        if (!newParent) {
          throw new NotFoundException('新父部门不存在');
        }

        // 检查是否是子部门
        if (newParent.id === department.id) {
          throw new BadRequestException('不能移动到自己下');
        }
      }

      // 更新父部门
      if (newParentId) {
        const newParent = await queryRunner.manager.findOne(Department, {
          where: { id: newParentId },
        });
        department.parent = newParent;
      } else {
        department.parent = null;
      }

      await queryRunner.manager.save(department);

      await queryRunner.commitTransaction();

      this.logger.log(`部门移动成功：${department.departmentName}`);

      return department;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`部门移动失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ========== 统计 ==========

  /**
   * 获取部门统计
   */
  async getStatistics(): Promise<DepartmentStatistics> {
    const total = await this.departmentRepository.count({
      where: { status: 'active' },
    });

    const employeeTotal = await this.userRepository.count({
      where: { status: 'active' },
    });

    const withEmployees = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoin('user', 'user', 'user.departmentId = department.id')
      .select('department.id', 'id')
      .addSelect('COUNT(user.id)', 'employeeCount')
      .groupBy('department.id')
      .having('COUNT(user.id) > 0')
      .getRawMany();

    return {
      total,
      employeeTotal,
      withEmployeesCount: withEmployees.length,
      withoutEmployeesCount: total - withEmployees.length,
    };
  }

  /**
   * 获取部门员工统计
   */
  async getDepartmentEmployeeStats(): Promise<DepartmentEmployeeStats[]> {
    return this.departmentRepository
      .createQueryBuilder('department')
      .leftJoin('user', 'user', 'user.departmentId = department.id AND user.status = :status', { status: 'active' })
      .select('department.id', 'id')
      .addSelect('department.departmentName', 'name')
      .addSelect('COUNT(user.id)', 'employeeCount')
      .groupBy('department.id')
      .addGroupBy('department.departmentName')
      .orderBy('employeeCount', 'DESC')
      .getRawMany();
  }
}

// ========== 类型定义 ==========

interface CreateDepartmentDto {
  departmentCode: string;
  departmentName: string;
  parentId?: string;
  sortOrder?: number;
  description?: string;
  address?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  managerId?: string;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
  establishedDate?: Date;
  isVirtual?: boolean;
  notes?: string;
}

interface UpdateDepartmentDto {
  departmentName?: string;
  parentId?: string;
  sortOrder?: number;
  description?: string;
  address?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  managerId?: string;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
  establishedDate?: Date;
  isVirtual?: boolean;
  status?: string;
  notes?: string;
}

interface ManagerInfo {
  managerName: string;
  managerPhone?: string;
  managerEmail?: string;
}

interface DepartmentQuery {
  page?: number;
  limit?: number;
  status?: string;
  parentId?: string;
}

interface DepartmentResult {
  items: Department[];
  total: number;
  page: number;
  limit: number;
}

interface DepartmentStatistics {
  total: number;
  employeeTotal: number;
  withEmployeesCount: number;
  withoutEmployeesCount: number;
}

interface DepartmentEmployeeStats {
  id: string;
  name: string;
  employeeCount: number;
}
