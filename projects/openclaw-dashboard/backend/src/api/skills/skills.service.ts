/**
 * 技能服务 - 动态加载和管理技能
 */

import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

// 技能定义
export interface Skill {
  id: string;
  name: string;
  description: string;
  version?: string;
  author?: string;
  tags?: string[];
  enabled: boolean;
  installedAt?: string;
  lastUsedAt?: string;
  useCount: number;
  config?: Record<string, any>;
  triggers?: SkillTrigger[];
}

// 触发器定义
export interface SkillTrigger {
  id: string;
  type: 'keyword' | 'schedule' | 'webhook' | 'file';
  config: {
    keywords?: string[];
    cron?: string;
    path?: string;
    events?: string[];
  };
  enabled: boolean;
}

// 技能状态存储路径
const SKILLS_DIR = path.join(process.env.HOME || '/root', '.openclaw', 'skills');
const SKILL_STATE_FILE = path.join(process.env.HOME || '/root', '.openclaw', 'skill-states.json');

@Injectable()
export class SkillsService {
  private readonly logger = new Logger(SkillsService.name);
  private skills: Map<string, Skill> = new Map();
  private skillStates: Map<string, { enabled: boolean; config: any; triggers: SkillTrigger[] }> = new Map();

  constructor() {
    this.loadSkillStates();
    this.loadSkills();
  }

  /**
   * 加载技能状态（启用/禁用、配置）
   */
  private loadSkillStates(): void {
    try {
      if (fs.existsSync(SKILL_STATE_FILE)) {
        const content = fs.readFileSync(SKILL_STATE_FILE, 'utf-8');
        const states = JSON.parse(content);
        for (const [id, state] of Object.entries(states)) {
          this.skillStates.set(id, state as any);
        }
        this.logger.log(`Loaded ${this.skillStates.size} skill states`);
      }
    } catch (error: any) {
      this.logger.warn(`Failed to load skill states: ${error?.message || error}`);
    }
  }

  /**
   * 保存技能状态
   */
  private saveSkillStates(): void {
    try {
      const states: Record<string, any> = {};
      for (const [id, state] of this.skillStates) {
        states[id] = state;
      }
      fs.writeFileSync(SKILL_STATE_FILE, JSON.stringify(states, null, 2));
      this.logger.log(`Saved ${this.skillStates.size} skill states`);
    } catch (error: any) {
      this.logger.error(`Failed to save skill states: ${error?.message || error}`);
    }
  }

  /**
   * 从文件系统加载技能
   */
  private loadSkills(): void {
    try {
      if (!fs.existsSync(SKILLS_DIR)) {
        this.logger.warn(`Skills directory not found: ${SKILLS_DIR}`);
        return;
      }

      const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const dir of dirs) {
        const skillPath = path.join(SKILLS_DIR, dir);
        const skillMdPath = path.join(skillPath, 'SKILL.md');

        if (!fs.existsSync(skillMdPath)) {
          continue;
        }

        try {
          const skill = this.parseSkillMd(dir, skillMdPath);
          if (skill) {
            // 应用保存的状态
            const savedState = this.skillStates.get(skill.id);
            if (savedState) {
              skill.enabled = savedState.enabled;
              skill.config = savedState.config;
              skill.triggers = savedState.triggers;
            }
            this.skills.set(skill.id, skill);
          }
        } catch (error: any) {
          this.logger.warn(`Failed to load skill ${dir}: ${error?.message || error}`);
        }
      }

      this.logger.log(`Loaded ${this.skills.size} skills from ${SKILLS_DIR}`);
    } catch (error: any) {
      this.logger.error(`Failed to load skills: ${error?.message || error}`);
    }
  }

  /**
   * 解析 SKILL.md 文件
   */
  private parseSkillMd(id: string, filePath: string): Skill | null {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // 解析 YAML frontmatter
      let name = id;
      let description = '';
      let version = '';
      let author = '';
      let tags: string[] = [];

      // 提取 frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        try {
          const frontmatter = yaml.parse(frontmatterMatch[1]);
          name = frontmatter.name || id;
          description = frontmatter.description || '';
          version = frontmatter.version || '';
          author = frontmatter.author || '';
          tags = frontmatter.tags || [];
        } catch (e) {
          // 解析失败，使用默认值
        }
      }

      // 如果没有 description，从内容中提取第一段
      if (!description) {
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.startsWith('#')) continue;
          if (line.trim().length > 10) {
            description = line.trim().slice(0, 200);
            break;
          }
        }
      }

      // 从路径获取安装时间
      const stats = fs.statSync(filePath);

      return {
        id,
        name,
        description,
        version,
        author,
        tags,
        enabled: true, // 默认启用
        installedAt: stats.birthtime.toISOString(),
        useCount: 0,
        triggers: [],
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * 获取所有技能
   */
  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * 获取技能详情
   */
  getSkill(id: string): Skill | null {
    return this.skills.get(id) || null;
  }

  /**
   * 获取技能完整内容（SKILL.md）
   */
  getSkillContent(id: string): string | null {
    const skillPath = path.join(SKILLS_DIR, id, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      return null;
    }
    return fs.readFileSync(skillPath, 'utf-8');
  }

  /**
   * 更新技能状态（启用/禁用）
   */
  updateSkillState(id: string, enabled: boolean): Skill | null {
    const skill = this.skills.get(id);
    if (!skill) {
      return null;
    }

    skill.enabled = enabled;
    
    // 更新状态存储
    const savedState = this.skillStates.get(id) || { enabled: true, config: {}, triggers: [] };
    savedState.enabled = enabled;
    this.skillStates.set(id, savedState);
    
    // 保存到文件
    this.saveSkillStates();

    return skill;
  }

  /**
   * 更新技能配置
   */
  updateSkillConfig(id: string, config: Record<string, any>): Skill | null {
    const skill = this.skills.get(id);
    if (!skill) {
      return null;
    }

    skill.config = config;
    
    // 更新状态存储
    const savedState = this.skillStates.get(id) || { enabled: true, config: {}, triggers: [] };
    savedState.config = config;
    this.skillStates.set(id, savedState);
    
    this.saveSkillStates();

    return skill;
  }

  /**
   * 添加触发器
   */
  addTrigger(skillId: string, trigger: Omit<SkillTrigger, 'id'>): SkillTrigger | null {
    const skill = this.skills.get(skillId);
    if (!skill) {
      return null;
    }

    const newTrigger: SkillTrigger = {
      ...trigger,
      id: `trigger-${Date.now()}`,
    };

    skill.triggers = skill.triggers || [];
    skill.triggers.push(newTrigger);

    // 保存状态
    const savedState = this.skillStates.get(skillId) || { enabled: true, config: {}, triggers: [] };
    savedState.triggers = skill.triggers;
    this.skillStates.set(skillId, savedState);
    this.saveSkillStates();

    return newTrigger;
  }

  /**
   * 删除触发器
   */
  removeTrigger(skillId: string, triggerId: string): boolean {
    const skill = this.skills.get(skillId);
    if (!skill || !skill.triggers) {
      return false;
    }

    const index = skill.triggers.findIndex(t => t.id === triggerId);
    if (index === -1) {
      return false;
    }

    skill.triggers.splice(index, 1);

    // 保存状态
    const savedState = this.skillStates.get(skillId);
    if (savedState) {
      savedState.triggers = skill.triggers;
      this.saveSkillStates();
    }

    return true;
  }

  /**
   * 更新触发器
   */
  updateTrigger(skillId: string, triggerId: string, updates: Partial<SkillTrigger>): SkillTrigger | null {
    const skill = this.skills.get(skillId);
    if (!skill || !skill.triggers) {
      return null;
    }

    const trigger = skill.triggers.find(t => t.id === triggerId);
    if (!trigger) {
      return null;
    }

    Object.assign(trigger, updates);

    // 保存状态
    const savedState = this.skillStates.get(skillId);
    if (savedState) {
      savedState.triggers = skill.triggers;
      this.saveSkillStates();
    }

    return trigger;
  }

  /**
   * 获取启用的技能
   */
  getEnabledSkills(): Skill[] {
    return Array.from(this.skills.values()).filter(s => s.enabled);
  }

  /**
   * 记录技能使用
   */
  recordUsage(id: string): void {
    const skill = this.skills.get(id);
    if (skill) {
      skill.useCount++;
      skill.lastUsedAt = new Date().toISOString();
    }
  }

  /**
   * 刷新技能列表
   */
  refreshSkills(): number {
    this.skills.clear();
    this.loadSkills();
    return this.skills.size;
  }
}