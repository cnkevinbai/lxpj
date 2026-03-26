/**
 * 任务服务 - 使用 Prisma 数据库
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DashboardRepository } from '../dashboard/dashboard.repository';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardRepo: DashboardRepository,
  ) {}

  /**
   * 查询所有任务
   */
  async findAll(query?: any): Promise<{ 
    data: Task[]; 
    meta: { total: number; page: number; limit: number; totalPages: number }; 
  }> {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;
    const skip = (page - 1) * limit;

    // 构建过滤条件
    const where: any = {};
    
    if (query?.status) {
      where.status = query.status;
    }
    if (query?.priority) {
      where.priority = query.priority;
    }
    if (query?.assignee) {
      where.assignee = query.assignee;
    }
    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // 查询数据库
    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks as Task[],
      meta: { 
        total, 
        page, 
        limit, 
        totalPages: Math.ceil(total / limit) 
      },
    };
  }

  /**
   * 查询单个任务
   */
  async findOne(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    return task as Task | null;
  }

  /**
   * 创建任务
   */
  async create(taskData: Partial<Task>): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        title: taskData.title || '未命名任务',
        description: taskData.description,
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium',
        assignee: taskData.assignee,
        dueDate: taskData.dueDate,
        tags: taskData.tags || [],
      },
    });
    
    this.logger.log(`任务创建: ${task.id} - ${task.title}`);
    
    // 记录活动
    await this.dashboardRepo.logTaskActivity(
      task.id,
      task.title,
      task.status,
      task.assignee ?? undefined,
    );
    
    return task as Task;
  }

  /**
   * 更新任务
   */
  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        updatedAt: new Date(),
      },
    });
    
    this.logger.log(`任务更新: ${id}`);
    
    // 如果状态变更，记录活动
    if (taskData.status) {
      await this.dashboardRepo.logTaskActivity(
        id,
        task.title,
        taskData.status,
        task.assignee ?? undefined,
      );
    }
    
    return task as Task;
  }

  /**
   * 删除任务
   */
  async delete(id: string): Promise<{ success: boolean; taskId: string }> {
    await this.prisma.task.delete({
      where: { id },
    });
    
    this.logger.log(`任务删除: ${id}`);
    return { success: true, taskId: id };
  }

  /**
   * 完成任务
   */
  async complete(id: string): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        status: 'completed',
        updatedAt: new Date(),
      },
    });
    
    this.logger.log(`任务完成: ${id}`);
    return task as Task;
  }

  /**
   * 获取任务统计
   */
  async getStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    byPriority: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  }> {
    const [total, pending, inProgress, completed, cancelled, low, medium, high, critical] = 
      await Promise.all([
        this.prisma.task.count(),
        this.prisma.task.count({ where: { status: 'pending' } }),
        this.prisma.task.count({ where: { status: 'in_progress' } }),
        this.prisma.task.count({ where: { status: 'completed' } }),
        this.prisma.task.count({ where: { status: 'cancelled' } }),
        this.prisma.task.count({ where: { priority: 'low' } }),
        this.prisma.task.count({ where: { priority: 'medium' } }),
        this.prisma.task.count({ where: { priority: 'high' } }),
        this.prisma.task.count({ where: { priority: 'critical' } }),
      ]);

    return {
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      byPriority: { low, medium, high, critical },
    };
  }

  /**
   * 清空所有任务
   */
  async clear(): Promise<void> {
    await this.prisma.task.deleteMany({});
    this.logger.log('所有任务已清空');
  }
}