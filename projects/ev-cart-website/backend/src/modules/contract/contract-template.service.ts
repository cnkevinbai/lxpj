/**
 * 合同模板服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ContractTemplate, TemplateVariable } from './entities/contract-template.entity'

@Injectable()
export class ContractTemplateService {
  constructor(
    @InjectRepository(ContractTemplate)
    private repository: Repository<ContractTemplate>,
  ) {}

  /**
   * 创建模板
   */
  async create(data: Partial<ContractTemplate>): Promise<ContractTemplate> {
    const template = this.repository.create(data)
    return this.repository.save(template)
  }

  /**
   * 获取模板列表
   */
  async findAll(type?: string) {
    const query = this.repository.createQueryBuilder('template')
      .where('template.isActive = :isActive', { isActive: true })
      .orderBy('template.createdAt', 'DESC')

    if (type) {
      query.andWhere('template.type = :type', { type })
    }

    return query.getMany()
  }

  /**
   * 获取模板详情
   */
  async findOne(id: string): Promise<ContractTemplate> {
    return this.repository.findOne({ where: { id } })
  }

  /**
   * 更新模板
   */
  async update(id: string, data: Partial<ContractTemplate>): Promise<ContractTemplate> {
    const template = await this.repository.findOne({ where: { id } })
    Object.assign(template, data)
    template.version += 1
    return this.repository.save(template)
  }

  /**
   * 生成合同内容
   */
  async generateContractContent(
    templateId: string,
    variables: Record<string, any>,
  ): Promise<string> {
    const template = await this.findOne(templateId)
    if (!template) {
      throw new Error('模板不存在')
    }

    let content = template.content

    // 替换变量
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      content = content.replace(regex, String(value))
    }

    return content
  }

  /**
   * 验证变量
   */
  validateVariables(
    variables: Record<string, any>,
    templateVariables: TemplateVariable[],
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    for (const templateVar of templateVariables) {
      if (templateVar.required && !variables[templateVar.name]) {
        errors.push(`缺少必填变量：${templateVar.label}`)
      }

      if (variables[templateVar.name]) {
        const value = variables[templateVar.name]
        
        if (templateVar.type === 'number' && isNaN(Number(value))) {
          errors.push(`${templateVar.label} 必须是数字`)
        }
        
        if (templateVar.type === 'date' && isNaN(Date.parse(value))) {
          errors.push(`${templateVar.label} 必须是有效日期`)
        }
        
        if (templateVar.type === 'select' && !templateVar.options?.includes(value)) {
          errors.push(`${templateVar.label} 必须是以下值之一：${templateVar.options.join(', ')}`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
