/**
 * 技能管理模块
 * 
 * 功能：
 * 1. 从 ~/.openclaw/skills/ 动态加载技能
 * 2. 技能启用/禁用管理
 * 3. 技能配置存储
 * 4. 自动触发系统
 */

import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { TriggerService } from './trigger.service';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService, TriggerService],
  exports: [SkillsService, TriggerService],
})
export class SkillsModule {}