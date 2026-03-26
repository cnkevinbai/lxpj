/**
 * 技能 API 控制器
 */

import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { SkillsService, Skill, SkillTrigger } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  /**
   * 获取所有技能
   * GET /api/skills
   */
  @Get()
  getAllSkills(): { skills: Skill[]; total: number } {
    const skills = this.skillsService.getAllSkills();
    return {
      skills,
      total: skills.length,
    };
  }

  /**
   * 获取技能详情
   * GET /api/skills/:id
   */
  @Get(':id')
  getSkill(@Param('id') id: string): { skill: Skill | null; content?: string | null } {
    const skill = this.skillsService.getSkill(id);
    const content = this.skillsService.getSkillContent(id);
    return {
      skill,
      content,
    };
  }

  /**
   * 更新技能状态（启用/禁用）
   * PATCH /api/skills/:id/state
   */
  @Patch(':id/state')
  updateSkillState(
    @Param('id') id: string,
    @Body() body: { enabled: boolean },
  ): { skill: Skill | null } {
    const skill = this.skillsService.updateSkillState(id, body.enabled);
    return { skill };
  }

  /**
   * 更新技能配置
   * PATCH /api/skills/:id/config
   */
  @Patch(':id/config')
  updateSkillConfig(
    @Param('id') id: string,
    @Body() body: { config: Record<string, any> },
  ): { skill: Skill | null } {
    const skill = this.skillsService.updateSkillConfig(id, body.config);
    return { skill };
  }

  /**
   * 添加触发器
   * POST /api/skills/:id/triggers
   */
  @Post(':id/triggers')
  addTrigger(
    @Param('id') id: string,
    @Body() body: Omit<SkillTrigger, 'id'>,
  ): { trigger: SkillTrigger | null } {
    const trigger = this.skillsService.addTrigger(id, body);
    return { trigger };
  }

  /**
   * 更新触发器
   * PATCH /api/skills/:id/triggers/:triggerId
   */
  @Patch(':id/triggers/:triggerId')
  updateTrigger(
    @Param('id') id: string,
    @Param('triggerId') triggerId: string,
    @Body() body: Partial<SkillTrigger>,
  ): { trigger: SkillTrigger | null } {
    const trigger = this.skillsService.updateTrigger(id, triggerId, body);
    return { trigger };
  }

  /**
   * 删除触发器
   * DELETE /api/skills/:id/triggers/:triggerId
   */
  @Delete(':id/triggers/:triggerId')
  removeTrigger(
    @Param('id') id: string,
    @Param('triggerId') triggerId: string,
  ): { success: boolean } {
    const success = this.skillsService.removeTrigger(id, triggerId);
    return { success };
  }

  /**
   * 刷新技能列表
   * POST /api/skills/refresh
   */
  @Post('refresh')
  refreshSkills(): { count: number } {
    const count = this.skillsService.refreshSkills();
    return { count };
  }

  /**
   * 获取启用的技能
   * GET /api/skills/enabled/list
   */
  @Get('enabled/list')
  getEnabledSkills(): { skills: Skill[] } {
    const skills = this.skillsService.getEnabledSkills();
    return { skills };
  }
}