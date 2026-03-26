// 智能决策规则引擎

import type { ServiceTicket, ServiceType, TechnicalDifficulty } from '../types/service-ticket'

/**
 * 决策规则类型
 */
export interface DecisionRule {
  id: string
  name: string
  description: string
  priority: number  // 优先级，数字越大优先级越高
  enabled: boolean
  
  // 条件
  conditions: RuleCondition[]
  
  // 结果
  result: {
    serviceType: ServiceType
    confidence: number
    reasons: string[]
  }
  
  // 统计
  usageCount: number
  successRate: number
  
  // 时间戳
  createdAt: Date
  updatedAt: Date
}

/**
 * 规则条件
 */
export interface RuleCondition {
  field: string
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'regex'
  value: any
  and?: RuleCondition[]
  or?: RuleCondition[]
}

/**
 * 决策结果
 */
export interface DecisionResult {
  serviceType: ServiceType
  confidence: number
  reasons: string[]
  matchedRules: DecisionRule[]
  alternativeTypes: Array<{
    serviceType: ServiceType
    confidence: number
    reasons: string[]
  }>
}

/**
 * 智能决策规则引擎
 */
export const decisionRuleEngine = {
  // ==================== 预定义规则 ====================
  
  /**
   * 必须现场服务的规则
   */
  mustOnsiteRules: [
    {
      id: 'rule_onsite_001',
      name: '大型设备安装',
      description: '大型设备必须现场安装',
      priority: 100,
      enabled: true,
      conditions: [
        { field: 'type', operator: '==', value: 'installation' },
        { field: 'productModel', operator: 'contains', value: '大型' }
      ],
      result: {
        serviceType: 'onsite',
        confidence: 100,
        reasons: ['大型设备需要现场安装']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_onsite_002',
      name: '需要专用工具',
      description: '需要专用工具的问题必须现场处理',
      priority: 95,
      enabled: true,
      conditions: [
        { field: 'problemDescription', operator: 'contains', value: '专用工具' }
      ],
      result: {
        serviceType: 'onsite',
        confidence: 95,
        reasons: ['需要专用工具']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_onsite_003',
      name: '安全隐患',
      description: '存在安全隐患的问题必须现场处理',
      priority: 100,
      enabled: true,
      conditions: [
        { field: 'problemDescription', operator: 'regex', value: '漏电|短路|起火|爆炸|危险' }
      ],
      result: {
        serviceType: 'onsite',
        confidence: 100,
        reasons: ['存在安全隐患']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_onsite_004',
      name: '专家级难度',
      description: '专家级难度的问题需要现场处理',
      priority: 90,
      enabled: true,
      conditions: [
        { field: 'technicalDifficulty', operator: '==', value: 'expert' }
      ],
      result: {
        serviceType: 'onsite',
        confidence: 90,
        reasons: ['专家级难度需要现场处理']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ] as DecisionRule[],

  /**
   * 可以寄件的规则
   */
  canMailRules: [
    {
      id: 'rule_mail_001',
      name: '小配件更换',
      description: '小配件可以寄件处理',
      priority: 80,
      enabled: true,
      conditions: [
        { field: 'type', operator: '==', value: 'repair' },
        { field: 'needParts', operator: '==', value: true },
        { field: 'parts', operator: 'contains', value: '小配件' }
      ],
      result: {
        serviceType: 'mail',
        confidence: 85,
        reasons: ['小配件更换适合寄件']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_mail_002',
      name: '客户有操作能力',
      description: '客户有操作能力可以寄件',
      priority: 75,
      enabled: true,
      conditions: [
        { field: 'customerTechnicalSkill', operator: '==', value: 'high' }
      ],
      result: {
        serviceType: 'mail',
        confidence: 80,
        reasons: ['客户技术能力强，可自行操作']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_mail_003',
      name: '距离过远',
      description: '距离过远建议寄件',
      priority: 70,
      enabled: true,
      conditions: [
        { field: 'customerDistance', operator: '>', value: 500 }
      ],
      result: {
        serviceType: 'mail',
        confidence: 75,
        reasons: ['距离过远，建议寄件']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ] as DecisionRule[],

  /**
   * 可以远程指导的规则
   */
  canRemoteRules: [
    {
      id: 'rule_remote_001',
      name: '软件配置问题',
      description: '软件配置问题适合远程指导',
      priority: 85,
      enabled: true,
      conditions: [
        { field: 'type', operator: 'in', value: ['consultation', 'maintenance'] },
        { field: 'problemDescription', operator: 'regex', value: '配置 | 设置 | 软件 | 系统' }
      ],
      result: {
        serviceType: 'remote',
        confidence: 90,
        reasons: ['软件配置问题适合远程指导']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_remote_002',
      name: '简单故障排查',
      description: '简单故障可以远程指导',
      priority: 80,
      enabled: true,
      conditions: [
        { field: 'technicalDifficulty', operator: 'in', value: ['simple', 'normal'] }
      ],
      result: {
        serviceType: 'remote',
        confidence: 85,
        reasons: ['简单故障可远程指导']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'rule_remote_003',
      name: '操作指导',
      description: '操作指导适合远程',
      priority: 75,
      enabled: true,
      conditions: [
        { field: 'type', operator: '==', value: 'consultation' }
      ],
      result: {
        serviceType: 'remote',
        confidence: 80,
        reasons: ['操作指导适合远程']
      },
      usageCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ] as DecisionRule[],

  // ==================== 规则评估 ====================
  
  /**
   * 评估条件
   */
  evaluateCondition(condition: RuleCondition, ticket: Partial<ServiceTicket>): boolean {
    const { field, operator, value } = condition
    
    // 获取字段值
    const fieldValue = this.getFieldValue(ticket, field)
    
    // 评估操作符
    switch (operator) {
      case '==':
        return fieldValue === value
      case '!=':
        return fieldValue !== value
      case '>':
        return fieldValue > value
      case '<':
        return fieldValue < value
      case '>=':
        return fieldValue >= value
      case '<=':
        return fieldValue <= value
      case 'contains':
        return fieldValue && fieldValue.includes(value)
      case 'startsWith':
        return fieldValue && fieldValue.startsWith(value)
      case 'endsWith':
        return fieldValue && fieldValue.endsWith(value)
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue)
      case 'regex':
        return fieldValue && new RegExp(value).test(fieldValue)
      default:
        return false
    }
  },

  /**
   * 获取字段值
   */
  getFieldValue(ticket: Partial<ServiceTicket>, field: string): any {
    const keys = field.split('.')
    let value: any = ticket
    
    for (const key of keys) {
      if (value === null || value === undefined) {
        return null
      }
      value = value[key]
    }
    
    return value
  },

  /**
   * 评估规则
   */
  evaluateRule(rule: DecisionRule, ticket: Partial<ServiceTicket>): boolean {
    if (!rule.enabled) {
      return false
    }
    
    // 评估所有条件
    return this.evaluateConditions(rule.conditions, ticket)
  },

  /**
   * 评估条件组
   */
  evaluateConditions(conditions: RuleCondition[], ticket: Partial<ServiceTicket>): boolean {
    if (!conditions || conditions.length === 0) {
      return true
    }
    
    // 所有条件都必须满足（AND 关系）
    return conditions.every(condition => {
      // 处理 AND 条件
      if (condition.and && condition.and.length > 0) {
        return this.evaluateConditions(condition.and, ticket)
      }
      
      // 处理 OR 条件
      if (condition.or && condition.or.length > 0) {
        return condition.or.some(orCondition => 
          this.evaluateCondition(orCondition, ticket)
        )
      }
      
      // 评估单个条件
      return this.evaluateCondition(condition, ticket)
    })
  },

  // ==================== 智能决策 ====================
  
  /**
   * 推荐服务方式
   */
  recommendServiceType(ticket: Partial<ServiceTicket>): DecisionResult {
    const allRules = [
      ...this.mustOnsiteRules,
      ...this.canMailRules,
      ...this.canRemoteRules
    ]
    
    // 按优先级排序
    const sortedRules = allRules.sort((a, b) => b.priority - a.priority)
    
    // 匹配规则
    const matchedRules: DecisionRule[] = []
    const scores = {
      onsite: 0,
      mail: 0,
      remote: 0
    }
    const reasons: string[] = []
    
    for (const rule of sortedRules) {
      if (this.evaluateRule(rule, ticket)) {
        matchedRules.push(rule)
        
        // 更新分数
        const { serviceType, confidence } = rule.result
        scores[serviceType] = Math.max(scores[serviceType], confidence)
        
        // 添加原因
        reasons.push(...rule.result.reasons)
        
        // 更新使用统计
        rule.usageCount++
        
        // 如果是必须现场规则，直接返回
        if (rule.priority >= 100) {
          return {
            serviceType: 'onsite',
            confidence: 100,
            reasons: rule.result.reasons,
            matchedRules: [rule],
            alternativeTypes: []
          }
        }
      }
    }
    
    // 找出最高分
    const maxScore = Math.max(scores.onsite, scores.mail, scores.remote)
    let serviceType: ServiceType = 'onsite'
    
    if (maxScore === scores.mail) {
      serviceType = 'mail'
    } else if (maxScore === scores.remote) {
      serviceType = 'remote'
    }
    
    // 计算置信度
    const totalScore = scores.onsite + scores.mail + scores.remote
    const confidence = totalScore > 0 ? (maxScore / totalScore) * 100 : 50
    
    // 生成备选方案
    const alternativeTypes: Array<{
      serviceType: ServiceType
      confidence: number
      reasons: string[]
    }> = []
    
    if (scores.onsite > 0 && serviceType !== 'onsite') {
      alternativeTypes.push({
        serviceType: 'onsite',
        confidence: Math.round((scores.onsite / totalScore) * 100),
        reasons: reasons.filter(r => r.includes('现场'))
      })
    }
    
    if (scores.mail > 0 && serviceType !== 'mail') {
      alternativeTypes.push({
        serviceType: 'mail',
        confidence: Math.round((scores.mail / totalScore) * 100),
        reasons: reasons.filter(r => r.includes('寄件'))
      })
    }
    
    if (scores.remote > 0 && serviceType !== 'remote') {
      alternativeTypes.push({
        serviceType: 'remote',
        confidence: Math.round((scores.remote / totalScore) * 100),
        reasons: reasons.filter(r => r.includes('远程'))
      })
    }
    
    return {
      serviceType,
      confidence: Math.round(confidence),
      reasons: [...new Set(reasons)], // 去重
      matchedRules,
      alternativeTypes
    }
  },

  // ==================== 规则管理 ====================
  
  /**
   * 添加规则
   */
  addRule(rule: DecisionRule): void {
    if (rule.result.serviceType === 'onsite') {
      this.mustOnsiteRules.push(rule)
    } else if (rule.result.serviceType === 'mail') {
      this.canMailRules.push(rule)
    } else if (rule.result.serviceType === 'remote') {
      this.canRemoteRules.push(rule)
    }
  },

  /**
   * 更新规则
   */
  updateRule(ruleId: string, updates: Partial<DecisionRule>): boolean {
    const allRules = [
      ...this.mustOnsiteRules,
      ...this.canMailRules,
      ...this.canRemoteRules
    ]
    
    const rule = allRules.find(r => r.id === ruleId)
    if (!rule) {
      return false
    }
    
    Object.assign(rule, updates)
    rule.updatedAt = new Date()
    
    return true
  },

  /**
   * 删除规则
   */
  deleteRule(ruleId: string): boolean {
    const removeFromArray = (rules: DecisionRule[]): boolean => {
      const index = rules.findIndex(r => r.id === ruleId)
      if (index !== -1) {
        rules.splice(index, 1)
        return true
      }
      return false
    }
    
    return (
      removeFromArray(this.mustOnsiteRules) ||
      removeFromArray(this.canMailRules) ||
      removeFromArray(this.canRemoteRules)
    )
  },

  /**
   * 获取所有规则
   */
  getAllRules(): DecisionRule[] {
    return [
      ...this.mustOnsiteRules,
      ...this.canMailRules,
      ...this.canRemoteRules
    ]
  },

  /**
   * 获取规则统计
   */
  getRuleStatistics(): {
    totalRules: number
    enabledRules: number
    disabledRules: number
    byType: {
      onsite: number
      mail: number
      remote: number
    }
    avgSuccessRate: number
  } {
    const allRules = this.getAllRules()
    
    return {
      totalRules: allRules.length,
      enabledRules: allRules.filter(r => r.enabled).length,
      disabledRules: allRules.filter(r => !r.enabled).length,
      byType: {
        onsite: this.mustOnsiteRules.length,
        mail: this.canMailRules.length,
        remote: this.canRemoteRules.length
      },
      avgSuccessRate: allRules.length > 0
        ? allRules.reduce((sum, r) => sum + r.successRate, 0) / allRules.length
        : 0
    }
  },

  /**
   * 更新规则成功率
   */
  updateRuleSuccessRate(ruleId: string, success: boolean): void {
    const allRules = this.getAllRules()
    const rule = allRules.find(r => r.id === ruleId)
    
    if (rule) {
      // 移动平均计算成功率
      const totalDecisions = rule.usageCount
      const currentSuccessCount = rule.successRate * (totalDecisions - 1)
      const newSuccessCount = currentSuccessCount + (success ? 1 : 0)
      rule.successRate = newSuccessCount / totalDecisions
      rule.updatedAt = new Date()
    }
  },
}

export default decisionRuleEngine
