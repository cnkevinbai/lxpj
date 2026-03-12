import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import { Role } from '../entities/role.entity';

/**
 * 用户管理服务
 */
@Injectable()
export class UserManagementService {
  private readonly logger = new Logger(UserManagementService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private dataSource: DataSource,
  ) {}

  // ========== 用户管理 ==========

  /**
   * 创建用户
   */
  async createUser(data: CreateUserDto): Promise<User> {
    this.logger.log(`创建用户：${data.username}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 检查用户名是否已存在
      const existingUser = await queryRunner.manager.findOne(User, {
        where: { username: data.username },
      });
      if (existingUser) {
        throw new BadRequestException('用户名已存在');
      }

      // 检查邮箱是否已存在
      const existingEmail = await queryRunner.manager.findOne(User, {
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new BadRequestException('邮箱已存在');
      }

      // 创建用户
      const user = queryRunner.manager.create(User, {
        ...data,
        password: await this.hashPassword(data.password),
        status: 'active',
        mustChangePassword: true,
      });

      await queryRunner.manager.save(user);

      // 分配角色
      if (data.roleIds && data.roleIds.length > 0) {
        const roles = await queryRunner.manager.findByIds(Role, data.roleIds);
        user.roles = roles;
        await queryRunner.manager.save(user);

        // 更新角色用户数
        for (const role of roles) {
          role.userCount += 1;
          await queryRunner.manager.save(role);
        }
      }

      // 更新部门员工数
      if (data.departmentId) {
        const department = await queryRunner.manager.findOne(Department, {
          where: { id: data.departmentId },
        });
        if (department) {
          department.employeeCount += 1;
          await queryRunner.manager.save(department);
        }
      }

      await queryRunner.commitTransaction();

      this.logger.log(`用户创建成功：${user.username}`);

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`创建用户失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新用户
   */
  async updateUser(userId: string, data: UpdateUserDto): Promise<User> {
    this.logger.log(`更新用户：${userId}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    Object.assign(user, data);
    await this.userRepository.save(user);

    this.logger.log(`用户更新成功：${user.username}`);

    return user;
  }

  /**
   * 删除用户
   */
  async deleteUser(userId: string): Promise<void> {
    this.logger.log(`删除用户：${userId}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 软删除
    user.status = 'deleted';
    user.deletedAt = new Date();
    await this.userRepository.save(user);

    // 更新角色用户数
    if (user.roles) {
      for (const role of user.roles) {
        role.userCount -= 1;
        await this.roleRepository.save(role);
      }
    }

    // 更新部门员工数
    if (user.departmentId) {
      const department = await this.departmentRepository.findOne({
        where: { id: user.departmentId },
      });
      if (department) {
        department.employeeCount -= 1;
        await this.departmentRepository.save(department);
      }
    }

    this.logger.log(`用户删除成功：${user.username}`);
  }

  /**
   * 获取用户列表
   */
  async getUsers(query: UserQuery): Promise<UserResult> {
    const { page = 1, limit = 20, departmentId, status, keyword } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.department', 'department');
    queryBuilder.leftJoinAndSelect('user.roles', 'roles');

    if (departmentId) {
      queryBuilder.andWhere('user.departmentId = :departmentId', { departmentId });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(user.username LIKE :keyword OR user.realName LIKE :keyword OR user.email LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 排除已删除用户
    queryBuilder.andWhere('user.status != :deletedStatus', { deletedStatus: 'deleted' });

    const [items, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
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
   * 获取用户详情
   */
  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['department', 'roles'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 分配角色
   */
  async assignRoles(userId: string, roleIds: string[]): Promise<User> {
    this.logger.log(`分配角色：${userId}, 角色：${roleIds}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: ['roles'],
      });

      if (!user) {
        throw new NotFoundException('用户不存在');
      }

      // 移除旧角色
      if (user.roles) {
        for (const role of user.roles) {
          role.userCount -= 1;
          await queryRunner.manager.save(role);
        }
      }

      // 分配新角色
      const roles = await queryRunner.manager.findByIds(Role, roleIds);
      user.roles = roles;
      await queryRunner.manager.save(user);

      // 更新角色用户数
      for (const role of roles) {
        role.userCount += 1;
        await queryRunner.manager.save(role);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`角色分配成功：${userId}`);

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`角色分配失败：${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(userId: string, newPassword: string): Promise<void> {
    this.logger.log(`重置密码：${userId}`);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    user.password = await this.hashPassword(newPassword);
    user.mustChangePassword = true;
    user.passwordChangedAt = new Date();
    await this.userRepository.save(user);

    this.logger.log(`密码重置成功：${userId}`);
  }

  /**
   * 锁定/解锁用户
   */
  async toggleUserLock(userId: string, lock: boolean): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    user.status = lock ? 'locked' : 'active';
    await this.userRepository.save(user);

    this.logger.log(`用户${lock ? '锁定' : '解锁'}成功：${userId}`);

    return user;
  }

  // ========== 统计 ==========

  /**
   * 获取用户统计
   */
  async getStatistics(): Promise<UserStatistics> {
    const total = await this.userRepository.count({
      where: { status: 'active' },
    });

    const statusCount = await this.userRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.status')
      .getRawMany();

    const departmentCount = await this.userRepository
      .createQueryBuilder('user')
      .select('user.departmentId', 'departmentId')
      .addSelect('user.departmentName', 'departmentName')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.departmentId')
      .addGroupBy('user.departmentName')
      .getRawMany();

    return {
      total,
      statusCount: statusCount.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      departmentCount: departmentCount.reduce((acc, item) => {
        acc[item.departmentName || '未分配'] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }

  // ========== 辅助方法 ==========

  /**
   * 密码加密
   */
  private async hashPassword(password: string): Promise<string> {
    // TODO: 使用 bcrypt 加密
    return password; // 简化处理
  }
}

// ========== 类型定义 ==========

interface CreateUserDto {
  username: string;
  password: string;
  email: string;
  phone?: string;
  realName: string;
  nickname?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: Date;
  departmentId?: string;
  position?: string;
  employeeType?: string;
  roleIds?: string[];
  hireDate?: Date;
  language?: string;
  timezone?: string;
  isSuperAdmin?: boolean;
  twoFactorEnabled?: boolean;
  skills?: string[];
  bio?: string;
  notes?: string;
  createdBy?: string;
  createdByName?: string;
}

interface UpdateUserDto {
  email?: string;
  phone?: string;
  realName?: string;
  nickname?: string;
  avatar?: string;
  gender?: string;
  birthday?: Date;
  departmentId?: string;
  departmentName?: string;
  position?: string;
  employeeType?: string;
  hireDate?: Date;
  language?: string;
  timezone?: string;
  twoFactorEnabled?: boolean;
  skills?: string[];
  bio?: string;
  notes?: string;
}

interface UserQuery {
  page?: number;
  limit?: number;
  departmentId?: string;
  status?: string;
  keyword?: string;
}

interface UserResult {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

interface UserStatistics {
  total: number;
  statusCount: Record<string, number>;
  departmentCount: Record<string, number>;
}
