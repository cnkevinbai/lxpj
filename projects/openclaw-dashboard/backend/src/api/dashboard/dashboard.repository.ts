/**
 * Dashboard 数据仓库 - 使用 Prisma 数据库
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Activity } from './dashboard.entity';

@Injectable()
export class DashboardRepository {
  private readonly logger = new Logger(DashboardRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取活动日志
   */
  async getActivities(limit: number = 10): Promise<Activity[]> {
    const activities = await this.prisma.activity.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return activities.map(a => ({
      id: a.id,
      type: a.type,
      message: a.message,
      timestamp: a.createdAt.toISOString(),
      metadata: a.metadata as Record<string, any> | undefined,
    }));
  }

  /**
   * 添加活动日志
   */
  async addActivity(
    type: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<Activity> {
    const activity = await this.prisma.activity.create({
      data: {
        type,
        message,
        metadata: metadata || undefined,
      },
    });

    this.logger.log(`活动记录: [${type}] ${message}`);

    return {
      id: activity.id,
      type: activity.type,
      message: activity.message,
      timestamp: activity.createdAt.toISOString(),
      metadata: activity.metadata as Record<string, any> | undefined,
    };
  }

  /**
   * 记录消息活动
   */
  async logMessageActivity(sessionId: string, agentId: string, messagePreview: string): Promise<void> {
    await this.addActivity('message', `会话 ${sessionId.slice(0, 8)}: ${messagePreview.slice(0, 50)}...`, {
      sessionId,
      agentId,
    });
  }

  /**
   * 记录任务活动
   */
  async logTaskActivity(taskId: string, title: string, status: string, assignee?: string): Promise<void> {
    const statusEmoji = status === 'completed' ? '✅' : status === 'in_progress' ? '🔄' : '📋';
    await this.addActivity('task', `${statusEmoji} ${title}`, {
      taskId,
      status,
      assignee,
    });
  }

  /**
   * 记录 Agent 活动
   */
  async logAgentActivity(agentId: string, action: string, details?: string): Promise<void> {
    await this.addActivity('agent', `${agentId}: ${action}`, {
      agentId,
      details,
    });
  }

  /**
   * 获取仪表盘统计数据
   */
  async getStats(): Promise<{
    activeSessions: number;
    tasksCompleted: number;
    agentsOnline: number;
    totalMessages: number;
  }> {
    // 并行查询所有统计
    const [
      activeSessions,
      tasksCompleted,
      totalMessages,
      recentSessions,
    ] = await Promise.all([
      // 活跃会话数（最近24小时有消息）
      this.prisma.session.count({
        where: {
          lastMessageAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      // 已完成任务数
      this.prisma.task.count({
        where: { status: 'completed' },
      }),
      // 消息总数
      this.prisma.message.count(),
      // 最近使用的 Agent
      this.prisma.session.findMany({
        where: {
          agentId: { not: null },
          lastMessageAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // 最近1小时
          },
        },
        select: { agentId: true },
        distinct: ['agentId'],
      }),
    ]);

    // 系统配置的 Agent 总数（固定的专业 Agent）
    const CONFIGURED_AGENTS = 12; // main + 11 个专业 Agent

    // 代理在线 = 配置的 Agent 数量（都是可用的）
    // 或者可以用 recentSessions.length 表示最近活跃的
    const agentsOnline = Math.max(CONFIGURED_AGENTS, recentSessions.length);

    return {
      activeSessions,
      tasksCompleted,
      agentsOnline,
      totalMessages,
    };
  }

  /**
   * 获取7天消息趋势
   */
  async get7DayTrends(): Promise<{ labels: string[]; data: number[] }> {
    const today = new Date();
    const labels: string[] = [];
    const data: number[] = [];

    // 获取最近7天的数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dateStr = date.toISOString().split('T')[0];
      labels.push(dateStr);

      // 查询当天的消息数量
      const count = await this.prisma.message.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      data.push(count);
    }

    return { labels, data };
  }

  /**
   * 获取 Agent 使用统计
   */
  async getAgentUsage(): Promise<Array<{ agentId: string; count: number }>> {
    // 按 agentId 分组统计会话数
    const result = await this.prisma.session.groupBy({
      by: ['agentId'],
      where: {
        agentId: { not: null },
      },
      _count: {
        id: true,
      },
    });

    return result
      .filter(r => r.agentId !== null)
      .map(r => ({
        agentId: r.agentId!,
        count: r._count.id,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * 获取任务统计
   */
  async getTaskStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  }> {
    const [total, pending, inProgress, completed] = await Promise.all([
      this.prisma.task.count(),
      this.prisma.task.count({ where: { status: 'pending' } }),
      this.prisma.task.count({ where: { status: 'in_progress' } }),
      this.prisma.task.count({ where: { status: 'completed' } }),
    ]);

    return { total, pending, inProgress, completed };
  }

  /**
   * 获取最近会话
   */
  async getRecentSessions(limit: number = 5): Promise<any[]> {
    const sessions = await this.prisma.session.findMany({
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return sessions.map(s => ({
      id: s.id,
      title: s.title,
      agentId: s.agentId,
      messageCount: s._count.messages,
      lastMessageAt: s.lastMessageAt?.toISOString(),
      createdAt: s.createdAt.toISOString(),
    }));
  }
}