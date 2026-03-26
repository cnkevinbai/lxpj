/**
 * 自动触发服务
 * 
 * 功能：
 * 1. 关键词触发 - 检测用户输入关键词
 * 2. 定时触发 - Cron 调度
 * 3. Webhook 触发 - 外部 HTTP 请求
 * 4. 文件触发 - 文件变更监听
 */

import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SkillsService, SkillTrigger } from '../skills/skills.service';
import * as cron from 'node-cron';

// 触发事件
export interface TriggerEvent {
  id: string;
  skillId: string;
  triggerType: 'keyword' | 'schedule' | 'webhook' | 'file';
  triggeredAt: Date;
  payload: any;
}

// 触发回调
export type TriggerCallback = (event: TriggerEvent) => void;

@Injectable()
export class TriggerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TriggerService.name);
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();
  private callbacks: Set<TriggerCallback> = new Set();

  constructor(private readonly skillsService: SkillsService) {}

  async onModuleInit() {
    this.logger.log('Initializing trigger service...');
    this.initializeTriggers();
  }

  onModuleDestroy() {
    this.logger.log('Stopping all scheduled jobs...');
    for (const [id, job] of this.scheduledJobs) {
      job.stop();
    }
    this.scheduledJobs.clear();
  }

  /**
   * 初始化所有触发器
   */
  private initializeTriggers(): void {
    const skills = this.skillsService.getAllSkills();
    
    for (const skill of skills) {
      if (!skill.enabled || !skill.triggers) continue;
      
      for (const trigger of skill.triggers) {
        if (!trigger.enabled) continue;
        
        switch (trigger.type) {
          case 'schedule':
            this.scheduleCronJob(skill.id, trigger);
            break;
          // keyword 和 webhook 触发器在请求时检查
        }
      }
    }
    
    this.logger.log(`Initialized ${this.scheduledJobs.size} scheduled jobs`);
  }

  /**
   * 创建 Cron 定时任务
   */
  private scheduleCronJob(skillId: string, trigger: SkillTrigger): void {
    const cronExpr = trigger.config.cron;
    if (!cronExpr) {
      this.logger.warn(`No cron expression for trigger ${trigger.id}`);
      return;
    }

    try {
      const job = cron.schedule(cronExpr, () => {
        this.logger.log(`Cron trigger fired: ${trigger.id} for skill ${skillId}`);
        
        const event: TriggerEvent = {
          id: `event-${Date.now()}`,
          skillId,
          triggerType: 'schedule',
          triggeredAt: new Date(),
          payload: { triggerId: trigger.id, cron: cronExpr },
        };
        
        this.notifyCallbacks(event);
      });

      this.scheduledJobs.set(trigger.id, job);
      this.logger.log(`Scheduled job ${trigger.id}: ${cronExpr}`);
    } catch (error: any) {
      this.logger.error(`Failed to schedule job ${trigger.id}: ${error?.message || error}`);
    }
  }

  /**
   * 检查关键词触发
   */
  checkKeywordTrigger(text: string): TriggerEvent | null {
    const skills = this.skillsService.getAllSkills();
    
    for (const skill of skills) {
      if (!skill.enabled || !skill.triggers) continue;
      
      for (const trigger of skill.triggers) {
        if (!trigger.enabled || trigger.type !== 'keyword') continue;
        
        const keywords = trigger.config.keywords || [];
        for (const keyword of keywords) {
          if (text.toLowerCase().includes(keyword.toLowerCase())) {
            this.logger.log(`Keyword trigger fired: "${keyword}" for skill ${skill.id}`);
            
            return {
              id: `event-${Date.now()}`,
              skillId: skill.id,
              triggerType: 'keyword',
              triggeredAt: new Date(),
              payload: { triggerId: trigger.id, keyword, text },
            };
          }
        }
      }
    }
    
    return null;
  }

  /**
   * 处理 Webhook 触发
   */
  handleWebhookTrigger(skillId: string, payload: any): TriggerEvent | null {
    const skill = this.skillsService.getSkill(skillId);
    if (!skill || !skill.enabled) {
      return null;
    }

    this.logger.log(`Webhook trigger for skill ${skillId}`);
    
    return {
      id: `event-${Date.now()}`,
      skillId,
      triggerType: 'webhook',
      triggeredAt: new Date(),
      payload,
    };
  }

  /**
   * 添加触发器（动态）
   */
  addTrigger(skillId: string, trigger: SkillTrigger): void {
    if (trigger.type === 'schedule' && trigger.enabled) {
      this.scheduleCronJob(skillId, trigger);
    }
  }

  /**
   * 移除触发器
   */
  removeTrigger(triggerId: string): void {
    const job = this.scheduledJobs.get(triggerId);
    if (job) {
      job.stop();
      this.scheduledJobs.delete(triggerId);
      this.logger.log(`Removed scheduled job ${triggerId}`);
    }
  }

  /**
   * 更新触发器
   */
  updateTrigger(skillId: string, trigger: SkillTrigger): void {
    // 先移除旧的
    this.removeTrigger(trigger.id);
    
    // 如果启用，重新创建
    if (trigger.enabled && trigger.type === 'schedule') {
      this.scheduleCronJob(skillId, trigger);
    }
  }

  /**
   * 注册回调
   */
  onTrigger(callback: TriggerCallback): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * 通知所有回调
   */
  private notifyCallbacks(event: TriggerEvent): void {
    for (const callback of this.callbacks) {
      try {
        callback(event);
      } catch (error: any) {
        this.logger.error(`Callback error: ${error?.message || error}`);
      }
    }
  }

  /**
   * 获取所有活动的定时任务
   */
  getActiveJobs(): { id: string; running: boolean }[] {
    return Array.from(this.scheduledJobs.entries()).map(([id, job]) => ({
      id,
      running: true, // node-cron jobs don't have a running property
    }));
  }
}