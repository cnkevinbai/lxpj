/**
 * 条件分支审批服务
 * 条件表达式解析、分支路由、动态审批路径
 */
import { Injectable } from '@nestjs/common'

// 条件类型
export enum ConditionType {
  FIELD_COMPARE = 'FIELD_COMPARE', // 字段比较
  AMOUNT_RANGE = 'AMOUNT_RANGE', // 金额范围
  DEPARTMENT_MATCH = 'DEPARTMENT_MATCH', // 部门匹配
  ROLE_MATCH = 'ROLE_MATCH', // 角色匹配
  CUSTOM_EXPRESSION = 'CUSTOM_EXPRESSION', // 自定义表达式
  TIME_CONDITION = 'TIME_CONDITION', // 时间条件
  USER_ATTRIBUTE = 'USER_ATTRIBUTE', // 用户属性
}

// 比较操作符
export enum CompareOperator {
  EQUAL = 'EQUAL', // ==
  NOT_EQUAL = 'NOT_EQUAL', // !=
  GREATER = 'GREATER', // >
  LESS = 'LESS', // <
  GREATER_EQUAL = 'GREATER_EQUAL', // >=
  LESS_EQUAL = 'LESS_EQUAL', // <=
  CONTAINS = 'CONTAINS', // 包含
  NOT_CONTAINS = 'NOT_CONTAINS', // 不包含
  IN_LIST = 'IN_LIST', // 在列表中
  NOT_IN_LIST = 'NOT_IN_LIST', // 不在列表中
}

// 条件规则接口
export interface ConditionRule {
  id: string
  name: string
  description?: string
  type: ConditionType
  field?: string // 字段名（如 amount、department）
  operator?: CompareOperator
  value?: any // 比较值
  values?: any[] // 多值比较
  expression?: string // 自定义表达式
  priority?: number // 优先级
  enabled?: boolean
}

// 分支路由接口
export interface BranchRoute {
  id: string
  name: string
  conditionId: string
  targetNodeId: string // 目标节点ID
  targetNodeName: string // 目标节点名称
  order?: number // 路由顺序
  isDefault?: boolean // 是否默认分支
  description?: string
}

// 条件分支节点接口
export interface ConditionBranchNode {
  id: string
  nodeId: string
  nodeName: string
  branchType: 'CONDITION' | 'PARALLEL' | 'EXCLUSIVE' // 条件/并行/排他
  conditions: ConditionRule[]
  routes: BranchRoute[]
  defaultRoute?: BranchRoute
  evaluationMode: 'FIRST_MATCH' | 'ALL_MATCH' | 'SCORE_BASED' // 首次匹配/全部匹配/评分制
}

// 条件评估结果
export interface ConditionEvaluation {
  ruleId: string
  ruleName: string
  input: Record<string, any>
  result: boolean
  matchedValue?: any
  reason?: string
  timestamp: Date
}

// 分支路由结果
export interface BranchRoutingResult {
  nodeId: string
  nodeName: string
  matchedConditions: ConditionEvaluation[]
  selectedRoute: BranchRoute
  alternativeRoutes?: BranchRoute[]
  routingReason: string
  confidence?: number // 置信度 (0-100)
}

@Injectable()
export class ConditionBranchService {
  private conditionRules: Map<string, ConditionRule> = new Map()
  private branchRoutes: Map<string, BranchRoute> = new Map()
  private branchNodes: Map<string, ConditionBranchNode> = new Map()
  private evaluationHistory: Map<string, ConditionEvaluation[]> = new Map()

  constructor() {
    this.initDefaultData()
  }

  private initDefaultData() {
    // 初始化条件规则
    const mockRules: ConditionRule[] = [
      {
        id: 'CR-001',
        name: '金额大于5万',
        description: '采购金额超过50000元需要总经理审批',
        type: ConditionType.AMOUNT_RANGE,
        field: 'amount',
        operator: CompareOperator.GREATER,
        value: 50000,
        priority: 1,
        enabled: true,
      },
      {
        id: 'CR-002',
        name: '金额大于10万',
        description: '采购金额超过100000元需要董事会审批',
        type: ConditionType.AMOUNT_RANGE,
        field: 'amount',
        operator: CompareOperator.GREATER,
        value: 100000,
        priority: 2,
        enabled: true,
      },
      {
        id: 'CR-003',
        name: '研发部门申请',
        description: '研发部门的采购申请需要技术总监审批',
        type: ConditionType.DEPARTMENT_MATCH,
        field: 'department',
        operator: CompareOperator.EQUAL,
        value: '研发部',
        priority: 3,
        enabled: true,
      },
      {
        id: 'CR-004',
        name: '紧急采购',
        description: '紧急采购标记为true时走快速通道',
        type: ConditionType.FIELD_COMPARE,
        field: 'isUrgent',
        operator: CompareOperator.EQUAL,
        value: true,
        priority: 10,
        enabled: true,
      },
      {
        id: 'CR-005',
        name: '请假天数大于3天',
        description: '请假超过3天需要HR审批',
        type: ConditionType.FIELD_COMPARE,
        field: 'leaveDays',
        operator: CompareOperator.GREATER,
        value: 3,
        priority: 1,
        enabled: true,
      },
      {
        id: 'CR-006',
        name: '请假天数大于7天',
        description: '请假超过7天需要总经理审批',
        type: ConditionType.FIELD_COMPARE,
        field: 'leaveDays',
        operator: CompareOperator.GREATER,
        value: 7,
        priority: 2,
        enabled: true,
      },
      {
        id: 'CR-007',
        name: '工作时间申请',
        description: '工作时间内的申请走正常流程',
        type: ConditionType.TIME_CONDITION,
        expression: 'hour >= 9 && hour <= 18',
        priority: 5,
        enabled: true,
      },
      {
        id: 'CR-008',
        name: '申请人级别经理',
        description: '申请人级别为经理时跳过部门审批',
        type: ConditionType.USER_ATTRIBUTE,
        field: 'applicantLevel',
        operator: CompareOperator.IN_LIST,
        values: ['经理', '总监', '总经理'],
        priority: 8,
        enabled: true,
      },
    ]

    mockRules.forEach((rule) => {
      this.conditionRules.set(rule.id, rule)
    })

    // 初始化分支路由
    const mockRoutes: BranchRoute[] = [
      {
        id: 'BR-001',
        name: '总经理审批',
        conditionId: 'CR-001',
        targetNodeId: 'N-005',
        targetNodeName: '总经理审批',
        order: 1,
      },
      {
        id: 'BR-002',
        name: '董事会审批',
        conditionId: 'CR-002',
        targetNodeId: 'N-006',
        targetNodeName: '董事会审批',
        order: 2,
      },
      {
        id: 'BR-003',
        name: '技术总监审批',
        conditionId: 'CR-003',
        targetNodeId: 'N-007',
        targetNodeName: '技术总监审批',
        order: 3,
      },
      {
        id: 'BR-004',
        name: '快速通道',
        conditionId: 'CR-004',
        targetNodeId: 'N-008',
        targetNodeName: '快速审批',
        order: 0,
      },
      {
        id: 'BR-005',
        name: 'HR审批',
        conditionId: 'CR-005',
        targetNodeId: 'N-HR',
        targetNodeName: 'HR审批',
        order: 1,
      },
      {
        id: 'BR-006',
        name: '总经理审批请假',
        conditionId: 'CR-006',
        targetNodeId: 'N-GM',
        targetNodeName: '总经理审批',
        order: 2,
      },
      {
        id: 'BR-007',
        name: '财务审批',
        conditionId: '',
        targetNodeId: 'N-004',
        targetNodeName: '财务审批',
        order: 99,
        isDefault: true,
      },
    ]

    mockRoutes.forEach((route) => {
      this.branchRoutes.set(route.id, route)
    })

    // 初始化条件分支节点
    const mockBranchNodes: ConditionBranchNode[] = [
      {
        id: 'CBN-001',
        nodeId: 'N-CONDITION-001',
        nodeName: '采购金额判断',
        branchType: 'EXCLUSIVE',
        conditions: [this.conditionRules.get('CR-002')!, this.conditionRules.get('CR-001')!],
        routes: [
          this.branchRoutes.get('BR-002')!,
          this.branchRoutes.get('BR-001')!,
          this.branchRoutes.get('BR-007')!,
        ],
        defaultRoute: this.branchRoutes.get('BR-007')!,
        evaluationMode: 'FIRST_MATCH',
      },
      {
        id: 'CBN-002',
        nodeId: 'N-CONDITION-002',
        nodeName: '部门类型判断',
        branchType: 'CONDITION',
        conditions: [this.conditionRules.get('CR-003')!],
        routes: [this.branchRoutes.get('BR-003')!],
        defaultRoute: this.branchRoutes.get('BR-007')!,
        evaluationMode: 'FIRST_MATCH',
      },
      {
        id: 'CBN-003',
        nodeId: 'N-CONDITION-003',
        nodeName: '请假天数判断',
        branchType: 'EXCLUSIVE',
        conditions: [this.conditionRules.get('CR-006')!, this.conditionRules.get('CR-005')!],
        routes: [this.branchRoutes.get('BR-006')!, this.branchRoutes.get('BR-005')!],
        defaultRoute: {
          id: 'BR-DEFAULT',
          name: '部门主管审批',
          conditionId: '',
          targetNodeId: 'N-SUP',
          targetNodeName: '部门主管审批',
          isDefault: true,
        },
        evaluationMode: 'FIRST_MATCH',
      },
      {
        id: 'CBN-004',
        nodeId: 'N-CONDITION-004',
        nodeName: '紧急采购判断',
        branchType: 'CONDITION',
        conditions: [this.conditionRules.get('CR-004')!],
        routes: [this.branchRoutes.get('BR-004')!],
        defaultRoute: this.branchRoutes.get('BR-007')!,
        evaluationMode: 'FIRST_MATCH',
      },
    ]

    mockBranchNodes.forEach((node) => {
      this.branchNodes.set(node.id, node)
    })
  }

  // 获取条件规则列表
  async getConditionRules(query?: {
    type?: ConditionType
    enabled?: boolean
  }): Promise<ConditionRule[]> {
    let rules = Array.from(this.conditionRules.values())

    if (query) {
      if (query.type) {
        rules = rules.filter((r) => r.type === query.type)
      }
      if (query.enabled !== undefined) {
        rules = rules.filter((r) => r.enabled === query.enabled)
      }
    }

    return rules.sort((a, b) => (a.priority || 0) - (b.priority || 0))
  }

  // 获取条件规则详情
  async getConditionRule(id: string): Promise<ConditionRule | null> {
    return this.conditionRules.get(id) || null
  }

  // 获取分支路由列表
  async getBranchRoutes(nodeId?: string): Promise<BranchRoute[]> {
    let routes = Array.from(this.branchRoutes.values())
    if (nodeId) {
      routes = routes.filter((r) => r.targetNodeId === nodeId)
    }
    return routes.sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  // 获取条件分支节点列表
  async getConditionBranchNodes(): Promise<ConditionBranchNode[]> {
    return Array.from(this.branchNodes.values())
  }

  // 获取条件分支节点详情
  async getConditionBranchNode(id: string): Promise<ConditionBranchNode | null> {
    return this.branchNodes.get(id) || null
  }

  // 评估条件规则
  async evaluateCondition(
    ruleId: string,
    input: Record<string, any>,
  ): Promise<ConditionEvaluation> {
    const rule = this.conditionRules.get(ruleId)
    if (!rule) {
      return {
        ruleId,
        ruleName: 'Unknown',
        input,
        result: false,
        reason: '规则不存在',
        timestamp: new Date(),
      }
    }

    const result = this.evaluateRule(rule, input)

    const evaluation: ConditionEvaluation = {
      ruleId: rule.id,
      ruleName: rule.name,
      input,
      result,
      matchedValue: input[rule.field || ''],
      reason: result ? '条件匹配' : '条件不匹配',
      timestamp: new Date(),
    }

    // 保存评估历史
    const history = this.evaluationHistory.get(ruleId) || []
    history.push(evaluation)
    this.evaluationHistory.set(ruleId, history)

    return evaluation
  }

  // 执行规则评估逻辑
  private evaluateRule(rule: ConditionRule, input: Record<string, any>): boolean {
    const fieldValue = input[rule.field || '']

    switch (rule.type) {
      case ConditionType.FIELD_COMPARE:
      case ConditionType.AMOUNT_RANGE:
      case ConditionType.DEPARTMENT_MATCH:
      case ConditionType.USER_ATTRIBUTE:
        return this.compareValue(fieldValue, rule.operator!, rule.value, rule.values)

      case ConditionType.TIME_CONDITION:
        return this.evaluateTimeCondition(rule.expression!, input)

      case ConditionType.CUSTOM_EXPRESSION:
        return this.evaluateCustomExpression(rule.expression!, input)

      default:
        return false
    }
  }

  // 值比较逻辑
  private compareValue(
    fieldValue: any,
    operator: CompareOperator,
    value?: any,
    values?: any[],
  ): boolean {
    switch (operator) {
      case CompareOperator.EQUAL:
        return fieldValue === value
      case CompareOperator.NOT_EQUAL:
        return fieldValue !== value
      case CompareOperator.GREATER:
        return fieldValue > value
      case CompareOperator.LESS:
        return fieldValue < value
      case CompareOperator.GREATER_EQUAL:
        return fieldValue >= value
      case CompareOperator.LESS_EQUAL:
        return fieldValue <= value
      case CompareOperator.CONTAINS:
        return String(fieldValue).includes(String(value))
      case CompareOperator.NOT_CONTAINS:
        return !String(fieldValue).includes(String(value))
      case CompareOperator.IN_LIST:
        return values?.includes(fieldValue) || false
      case CompareOperator.NOT_IN_LIST:
        return !values?.includes(fieldValue)
      default:
        return false
    }
  }

  // 时间条件评估
  private evaluateTimeCondition(expression: string, input: Record<string, any>): boolean {
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay()

    // 简化表达式解析（实际应使用表达式引擎）
    if (expression.includes('hour >= 9 && hour <= 18')) {
      return hour >= 9 && hour <= 18
    }
    if (expression.includes('dayOfWeek >= 1 && dayOfWeek <= 5')) {
      return dayOfWeek >= 1 && dayOfWeek <= 5
    }

    return false
  }

  // 自定义表达式评估
  private evaluateCustomExpression(expression: string, input: Record<string, any>): boolean {
    // 简化实现，实际应使用安全的表达式引擎如 expr-eval
    try {
      // 替换变量
      let evalExpr = expression
      for (const [key, value] of Object.entries(input)) {
        evalExpr = evalExpr.replace(new RegExp(key, 'g'), String(value))
      }
      // 安全检查：只允许基本比较运算
      if (evalExpr.match(/^[\d\s<>=!&|()+\-*/.]+$/)) {
        return eval(evalExpr) as boolean
      }
      return false
    } catch {
      return false
    }
  }

  // 执行分支路由
  async routeBranch(nodeId: string, input: Record<string, any>): Promise<BranchRoutingResult> {
    const branchNode = Array.from(this.branchNodes.values()).find((n) => n.nodeId === nodeId)
    if (!branchNode) {
      return {
        nodeId,
        nodeName: 'Unknown',
        matchedConditions: [],
        selectedRoute: {
          id: 'BR-DEFAULT',
          name: '默认路由',
          conditionId: '',
          targetNodeId: 'N-DEFAULT',
          targetNodeName: '默认节点',
          isDefault: true,
        },
        routingReason: '分支节点不存在',
        confidence: 0,
      }
    }

    // 按优先级评估所有条件
    const evaluations: ConditionEvaluation[] = []
    for (const condition of branchNode.conditions.sort(
      (a, b) => (a.priority || 0) - (b.priority || 0),
    )) {
      const evalResult = await this.evaluateCondition(condition.id, input)
      evaluations.push(evalResult)
      if (evalResult.result && branchNode.evaluationMode === 'FIRST_MATCH') {
        // 首次匹配模式：找到第一个匹配的条件就停止
        const matchedRoute = branchNode.routes.find((r) => r.conditionId === condition.id)
        return {
          nodeId: branchNode.nodeId,
          nodeName: branchNode.nodeName,
          matchedConditions: evaluations,
          selectedRoute: matchedRoute || branchNode.defaultRoute!,
          routingReason: `条件 "${condition.name}" 匹配成功`,
          confidence: 100,
        }
      }
    }

    // 没有任何条件匹配，返回默认路由
    return {
      nodeId: branchNode.nodeId,
      nodeName: branchNode.nodeName,
      matchedConditions: evaluations,
      selectedRoute: branchNode.defaultRoute!,
      routingReason: '所有条件均不匹配，使用默认路由',
      confidence: 50,
    }
  }

  // 获取评估历史
  async getEvaluationHistory(ruleId?: string): Promise<ConditionEvaluation[]> {
    if (ruleId) {
      return this.evaluationHistory.get(ruleId) || []
    }

    // 返回所有历史
    const allHistory: ConditionEvaluation[] = []
    for (const history of this.evaluationHistory.values()) {
      allHistory.push(...history)
    }
    return allHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // 批量评估多个条件
  async evaluateMultipleConditions(
    ruleIds: string[],
    input: Record<string, any>,
  ): Promise<ConditionEvaluation[]> {
    const results: ConditionEvaluation[] = []
    for (const ruleId of ruleIds) {
      const result = await this.evaluateCondition(ruleId, input)
      results.push(result)
    }
    return results
  }

  // 获取条件统计
  async getConditionStats(): Promise<{
    totalRules: number
    enabledRules: number
    byType: Record<ConditionType, number>
    avgMatchRate: number
  }> {
    const rules = Array.from(this.conditionRules.values())
    const history = Array.from(this.evaluationHistory.values()).flat()

    const byType: Record<ConditionType, number> = {} as any
    rules.forEach((r) => {
      byType[r.type] = (byType[r.type] || 0) + 1
    })

    const matchedCount = history.filter((h) => h.result).length

    return {
      totalRules: rules.length,
      enabledRules: rules.filter((r) => r.enabled).length,
      byType,
      avgMatchRate: history.length > 0 ? (matchedCount / history.length) * 100 : 0,
    }
  }
}
