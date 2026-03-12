import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import { OperationLog } from '../entities/operation-log.entity';

/**
 * 后台管理仪表板服务
 */
@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(OperationLog)
    private logRepository: Repository<OperationLog>,
  ) {}

  /**
   * 获取仪表板数据
   */
  async getDashboardData(userId: string): Promise<DashboardData> {
    // 用户统计
    const userStats = await this.getUserStats();

    // 部门统计
    const departmentStats = await this.getDepartmentStats();

    // 最近操作
    const recentActivities = await this.getRecentActivities(10);

    // 快捷操作
    const quickActions = await this.getQuickActions(userId);

    // 系统信息
    const systemInfo = await this.getSystemInfo();

    return {
      userStats,
      departmentStats,
      recentActivities,
      quickActions,
      systemInfo,
    };
  }

  /**
   * 获取用户统计
   */
  private async getUserStats(): Promise<UserStats> {
    const total = await this.userRepository.count();
    const active = await this.userRepository.count({ where: { status: 'active' } });
    const newUsers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :startDate', {
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
      })
      .getCount();

    const departmentDist = await this.userRepository
      .createQueryBuilder('user')
      .select('user.departmentName', 'department')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.departmentName')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      total,
      active,
      inactive: total - active,
      newUsers,
      departmentDist: departmentDist.reduce((acc, item) => {
        acc[item.department || '未分配'] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }

  /**
   * 获取部门统计
   */
  private async getDepartmentStats(): Promise<DepartmentStats> {
    const total = await this.departmentRepository.count({
      where: { status: 'active' },
    });

    const withEmployees = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoin('user', 'user', 'user.departmentId = department.id')
      .select('department.id', 'id')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('department.id')
      .having('COUNT(user.id) > 0')
      .getCount();

    return {
      total,
      withEmployees,
      withoutEmployees: total - withEmployees,
    };
  }

  /**
   * 获取最近活动
   */
  private async getRecentActivities(limit: number): Promise<RecentActivity[]> {
    const logs = await this.logRepository
      .createQueryBuilder('log')
      .orderBy('log.createdAt', 'DESC')
      .limit(limit)
      .getMany();

    return logs.map(log => ({
      id: log.id,
      userName: log.userName,
      userDepartment: log.userDepartment,
      action: log.actionName,
      target: log.targetName,
      module: log.module,
      status: log.status,
      createdAt: log.createdAt,
    }));
  }

  /**
   * 获取快捷操作
   */
  private async getQuickActions(userId: string): Promise<QuickAction[]> {
    // 根据用户角色和常用操作推荐快捷方式
    return [
      { id: 'create_user', name: '创建用户', icon: 'user-plus', url: '/system/users/create' },
      { id: 'create_dept', name: '创建部门', icon: 'building', url: '/system/departments/create' },
      { id: 'assign_role', name: '分配角色', icon: 'shield', url: '/system/roles' },
      { id: 'view_logs', name: '操作日志', icon: 'file-text', url: '/system/logs' },
      { id: 'export_data', name: '数据导出', icon: 'download', url: '/system/export' },
      { id: 'import_data', name: '数据导入', icon: 'upload', url: '/system/import' },
    ];
  }

  /**
   * 获取系统信息
   */
  private async getSystemInfo(): Promise<SystemInfo> {
    return {
      version: '4.0.0',
      buildDate: '2026-03-12',
      environment: process.env.NODE_ENV || 'production',
      uptime: process.uptime(),
    };
  }
}

// ========== 类型定义 ==========

interface DashboardData {
  userStats: UserStats;
  departmentStats: DepartmentStats;
  recentActivities: RecentActivity[];
  quickActions: QuickAction[];
  systemInfo: SystemInfo;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  newUsers: number;
  departmentDist: Record<string, number>;
}

interface DepartmentStats {
  total: number;
  withEmployees: number;
  withoutEmployees: number;
}

interface RecentActivity {
  id: string;
  userName: string;
  userDepartment: string;
  action: string;
  target: string;
  module: string;
  status: string;
  createdAt: Date;
}

interface QuickAction {
  id: string;
  name: string;
  icon: string;
  url: string;
}

interface SystemInfo {
  version: string;
  buildDate: string;
  environment: string;
  uptime: number;
}
